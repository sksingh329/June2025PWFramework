import {test, expect, FrameLocator} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js'
import { HomePage } from '../pages/HomePage.js';
import { generateRandomEmail } from '../utils/StringUtils.js';

test('Valid Login @login', async({page}) =>{
    let login: LoginPage = new LoginPage(page);
    await login.gotToLoginPage();
    let homePage: HomePage = await login.doLogin('test123@test.com','test');
    expect(await homePage.isUserLoggedIn()).toBeTruthy();
});

test('Invalid Login', {
    tag: ['@sanity'],
    annotation: [
        {type: 'epic', description: 'EPIC 100 - Sanity Test'},
        {type: 'feature', description: 'Login page feature'},
        {type: 'user story', description: 'Valid User Login'}
    ]
},async({page}) =>{
    let login: LoginPage = new LoginPage(page);
    await login.gotToLoginPage();
    await login.doLogin(generateRandomEmail(),'test123');
    let invalidLoginMessage = await login.getInvalidLoginMessage();
    expect(invalidLoginMessage).toContain('Warning: No match for E-Mail Address and/or Password.');
});