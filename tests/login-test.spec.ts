import {test, expect, FrameLocator} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js'
import { HomePage } from '../pages/HomePage.js';

test.skip('InValid Login', async({page}) =>{
    let login: LoginPage = new LoginPage(page);
    await login.gotToLoginPage();
    let invalidLoginMessage = await login.getInvalidLoginMessage();
    expect(invalidLoginMessage).toContain('Warning: No match for E-Mail Address and/or Password.');
});

test('Valid Login', async({page}) =>{
    let login: LoginPage = new LoginPage(page);
    await login.gotToLoginPage();
    let homePage: HomePage = await login.doLogin('test123@test.com','test');
    expect(await homePage.isUserLoggedIn()).toBeTruthy();
});