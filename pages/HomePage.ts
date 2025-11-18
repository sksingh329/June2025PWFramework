import { Page, Locator } from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtils.js';
import { LoginPage } from './LoginPage.js';
import { ResultsPage } from './ResultsPage.js';

export class HomePage{
    private readonly page: Page;
    private readonly eleUtil: ElementUtil;
    private readonly logoutLink: Locator;
    private readonly search: Locator;
    private readonly searchIcon: Locator;
    private readonly login: Locator;

    constructor(page: Page){
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.search = page.getByRole('textbox', { name: 'Search' });
        this.searchIcon = page.locator(`#search > span.input-group-btn > button.btn`);
        this.login = page.getByRole('link', { name: 'Login' });
    }

    async isUserLoggedIn(): Promise<boolean>{
        return await this.eleUtil.isVisible(this.logoutLink, 0);
    }

    async logout(): Promise<LoginPage>{
        await this.eleUtil.click(this.logoutLink, {index: 1});
        await this.eleUtil.click(this.login,{index: 1});
        return new LoginPage(this.page);
    }

    async doSearch(searchKey: string): Promise<ResultsPage>{
        console.log(`Search Key: ${searchKey}`);
        await this.eleUtil.fill(this.search, searchKey);
        await this.eleUtil.click(this.searchIcon);
        return new ResultsPage(this.page);
    }

}