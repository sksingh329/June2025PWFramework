import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

type HomePageFixture = {
    homePage: HomePage;
};

export const test = base.extend<HomePageFixture>({
    homePage: async({page, baseURL}, use, testInfo) =>{
        const loginPage: LoginPage = new LoginPage(page);
        await loginPage.gotToLoginPage(baseURL);
        const username = testInfo.project.metadata.username;
        const password = testInfo.project.metadata.password;
        const homePage: HomePage = await loginPage.doLogin(username, password);
        expect(homePage.isUserLoggedIn).toBeTruthy();
        await use(homePage);
    }
});

export { expect };