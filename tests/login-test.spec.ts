import {test, expect, FrameLocator} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js'
import { HomePage } from '../pages/HomePage.js';

test('Valid Login', async({page}) =>{
    let login: LoginPage = new LoginPage(page);
    await login.gotToLoginPage();
    let homePage: HomePage = await login.doLogin('test123@test.com','test');
    expect(await homePage.isUserLoggedIn()).toBeTruthy();
});

test('Invalid Login', async({page}) =>{
    let login: LoginPage = new LoginPage(page);
    await login.gotToLoginPage();
    await login.doLogin('test_user@testing.com','test123');
    let invalidLoginMessage = await login.getInvalidLoginMessage();
    expect(invalidLoginMessage).toContain('Warning: No match for E-Mail Address and/or Password.');
});