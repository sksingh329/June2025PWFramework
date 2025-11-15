import { Page, Locator } from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtils.js';
import { LoginPage } from './LoginPage.js';
import { resourceUsage } from 'process';

export class ResultsPage{
    private readonly page: Page;
    private readonly eleUtil: ElementUtil;
    private readonly results: Locator;

    constructor(page: Page){
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.results = page.locator('.product-thumb');
    }

    async getSearchResultsCount(): Promise<number>{
        let resultCount: number = await this.results.count();
        console.log(`Result count: ${resultCount}`);
        return resultCount;
    }
}