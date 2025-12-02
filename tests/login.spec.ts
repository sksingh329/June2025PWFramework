import { test, expect } from '../fixtures/baseFixtures';
import { LoginPage } from '../pages/LoginPage';
import { generateRandomEmail } from '../utils/StringUtils';

test('Valid Login @login', async({ homePage }) =>{
    await expect(homePage.page).toHaveTitle('My Account');
});

test('Invalid Login', {
    tag: ['@sanity'],
    annotation: [
        {type: 'epic', description: 'EPIC 100 - Sanity Test'},
        {type: 'feature', description: 'Login page feature'},
        {type: 'user story', description: 'Valid User Login'}
    ]
},async({page, baseURL}) =>{
    const login: LoginPage = new LoginPage(page);
    await login.gotToLoginPage(baseURL);
    await login.doLogin(generateRandomEmail(),'test123');
    const invalidLoginMessage = await login.getInvalidLoginMessage();
    expect(invalidLoginMessage).toContain('Warning: No match for E-Mail Address and/or Password.');
});