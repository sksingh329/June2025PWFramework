import {test, expect, FrameLocator} from '@playwright/test';

import { LoginPage } from '../pages/LoginPage.js'
import { HomePage } from '../pages/HomePage.js';
import { ResultsPage } from '../pages/ResultsPage.js';
import { ProductInfoPage } from '../pages/ProductInfoPage.js';


test(`test product header`, async({page}) =>{
        let login: LoginPage = new LoginPage(page);
        await login.gotToLoginPage();
        let homePage: HomePage = await login.doLogin('test123@test.com','test');
        let resultsPage: ResultsPage =  await homePage.doSearch('macbook');
        let productInfoPage: ProductInfoPage = await resultsPage.selectProduct('MacBook Pro');
        expect(await productInfoPage.getProductHeader()).toBe('MacBook Pro');
});


let search = [
    {searchKey: 'macbook', productName: 'MacBook Pro', imageCount: "4"},
    {searchKey: 'macbook', productName: 'MacBook Air', imageCount: "4"},
    {searchKey: 'iphone', productName: 'iPhone', imageCount: "6"}
]

for (let product of search){
    test(`test product header ${product.productName}`, async({page}) => {
        let login: LoginPage = new LoginPage(page);
        await login.gotToLoginPage();
        let homePage: HomePage = await login.doLogin('test123@test.com','test');
        let resultsPage: ResultsPage =  await homePage.doSearch(product.searchKey);
        let productInfoPage: ProductInfoPage = await resultsPage.selectProduct(product.productName);
        expect(await (productInfoPage).getProductHeader()).toBe(product.productName);
    });
}

for (let product of search){
    test.skip(`test product image count ${product.productName}`, async({page}) =>{
        let login: LoginPage = new LoginPage(page);
        await login.gotToLoginPage();
        let homePage: HomePage = await login.doLogin('test123@test.com','test');
        let resultsPage: ResultsPage =  await homePage.doSearch(product.searchKey);
        let productInfoPage: ProductInfoPage = await resultsPage.selectProduct(product.productName);
        // expect(await productInfoPage.getImagesCount()).toBe(product.imageCount());
    });
}

test.skip(`test product meta data`, async({page}) =>{
        let login: LoginPage = new LoginPage(page);
        await login.gotToLoginPage();
        let homePage: HomePage = await login.doLogin('test123@test.com','test');
        let resultsPage: ResultsPage =  await homePage.doSearch('macbook');
        let productInfoPage: ProductInfoPage = await resultsPage.selectProduct('MacBook Pro');
        // expect(await productInfoPage.getImagesCount()).toBe(product.imageCount());

        let actualProductFullDetails = await productInfoPage.getProductDetails();
        expect.soft(actualProductFullDetails.get('header')).toBe('MacBook Pro');
        expect.soft(actualProductFullDetails.get('Brand')).toBe('Apple');
        expect.soft(actualProductFullDetails.get('Product Code')).toBe('Product 18');
        expect.soft(actualProductFullDetails.get('Reward Points')).toBe('800');
        expect.soft(actualProductFullDetails.get('Availability')).toBe('Out Of Stock');
});


