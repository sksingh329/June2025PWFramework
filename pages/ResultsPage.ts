import { Page, Locator } from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtils.js';
import { ProductInfoPage } from './ProductInfoPage.js';

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

    async selectProduct(productName: string): Promise<ProductInfoPage>{
        console.log(`Product name: ${productName}`);
        await this.eleUtil.click(this.page.getByRole('link', { name: productName }));
        return new ProductInfoPage(this.page);
    }
}