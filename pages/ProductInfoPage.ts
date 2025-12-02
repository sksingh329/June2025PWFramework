import { Page, Locator } from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtils.js';

export class ProductInfoPage{
    private readonly page: Page;
    private readonly eleUtil: ElementUtil;
    private readonly productHeader: Locator;
    private readonly productImages: Locator;
    private readonly productMetaData: Locator;
    private readonly productPriceData: Locator;
    private readonly productMap = new Map<string, string | number | null>;


    constructor(page: Page){
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.productHeader = page.locator('h1');
        this.productImages = page.locator('div#content img');
        this.productMetaData = page.locator('(//div[@id=\'content\']//ul[@class=\'list-unstyled\'])[1]/li');
        this.productPriceData = page.locator('(//div[@id=\'content\']//ul[@class=\'list-unstyled\'])[2]/li');
    }

    async getProductHeader(): Promise<string>{
        const productHeader = await this.eleUtil.getElementInnerText(this.productHeader);
        console.log(`Product header is: ${productHeader}`);
        return productHeader;
    }

    async getImagesCount(): Promise<number>{
        await this.eleUtil.waitForElementVisible(this.productImages);
        const imageCount = await this.productImages.count();
        console.log(`Image count for product ${this.getProductHeader()} is: ${imageCount}`);
        return imageCount;
    }

    async getProductDetails(){
        this.productMap.set('header', await this.getProductHeader());
        this.productMap.set('imagecount', await this.getImagesCount());
        await this.getProductMetaData();
        await this.getProductPriceData();

        console.log(`Full product detail: ${await this.getProductHeader()}`);
        this.printProductDetails();

        return this.productMap;
    }

    private printProductDetails(){
        for(const [key,value] of this.productMap){
            console.log(`Key: ${key} and value: ${value}`);
        }
    }

    private async getProductMetaData(){
        const productMetaDataList: string[] = await this.productMetaData.allInnerTexts();
        for (const meta of productMetaDataList){
            const metaData: string[] = meta.split(':');
            const metaKey: string = metaData[0].trim();
            const metaValue: string = metaData[1].trim();
            this.productMap.set(metaKey,metaValue);
        }
    }

    private async getProductPriceData(){
        const productPriceDataList = await this.productPriceData.allInnerTexts();
        console.log(`Product Price Details : ${productPriceDataList}`);
        const productPrice = productPriceDataList[0].trim();
        this.productMap.set('price',productPrice);
        const productExtTax = productPriceDataList[1].split(':')[1].trim();
        this.productMap.set('exttaxprice',productExtTax);
    }

}