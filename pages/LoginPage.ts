import { Page, Locator } from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtils.js';
import {HomePage} from './HomePage.js';

export class LoginPage{
    private readonly page: Page;
    private readonly eleUtil: ElementUtil;

    // Page Locators/objects/OR
    private readonly emailId: Locator;
    private readonly password: Locator;
    private readonly loginBtn: Locator;
    private readonly warningMessage: Locator

    //page construtor
    /**
     * store locator for Login page web elements 
     * @param page 
     */
    constructor(page: Page){
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.emailId = page.getByRole('textbox', { name: 'E-Mail Address' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.loginBtn = page.locator(`input[type="submit"][value="Login"]`);
        this.warningMessage = page.locator('.alert.alert-danger.alert-dismissible');
    }

    //***page actions**** 
    /**
     * Navigate to Login Page 
     */
    async gotToLoginPage(baseURL: string | undefined){
        await this.page.goto(`${baseURL}?route=account/login`);
    }

    /**
     * login to app using given email and password
     * @param email 
     * @param password 
     * @returns HomePage
     */
    async doLogin(email: string, password: string): Promise<HomePage>{
        await this.eleUtil.fill(this.emailId,email);
        await this.eleUtil.fill(this.password,password);
        await this.eleUtil.click(this.loginBtn);

        return new HomePage(this.page);
    }

    /**
     * Get warning message incase of invalid login 
     * @returns 
     */
    async getInvalidLoginMessage(): Promise<string|null>{
        return await this.eleUtil.getElementTextContent(this.warningMessage);
    }
}