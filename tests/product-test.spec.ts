import {test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage.js'
import { HomePage } from '../pages/HomePage.js';
import { ResultsPage } from '../pages/ResultsPage.js';
import { ProductInfoPage } from '../pages/ProductInfoPage.js';


let search = [
    {searchKey: 'macbook', productName: 'MacBook Pro', imageCount: 4},
    {searchKey: 'macbook', productName: 'MacBook Air', imageCount: 4},
    {searchKey: 'iphone', productName: 'iPhone', imageCount: 7}
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
    test(`test product image count ${product.productName}`, async({page}) =>{
        let login: LoginPage = new LoginPage(page);
        await login.gotToLoginPage();
        let homePage: HomePage = await login.doLogin('test123@test.com','test');
        let resultsPage: ResultsPage =  await homePage.doSearch(product.searchKey);
        let productInfoPage: ProductInfoPage = await resultsPage.selectProduct(product.productName);
        expect(await productInfoPage.getImagesCount()).toBe(product.imageCount);
    });
}

test(`test product meta data`, async({page}) =>{
        let login: LoginPage = new LoginPage(page);
        await login.gotToLoginPage();
        let homePage: HomePage = await login.doLogin('test123@test.com','test');
        let resultsPage: ResultsPage =  await homePage.doSearch('macbook');
        let productInfoPage: ProductInfoPage = await resultsPage.selectProduct('MacBook Pro'); 

        let actualProductFullDetails = await productInfoPage.getProductDetails();
        expect.soft(actualProductFullDetails.get('header')).toBe('MacBook Pro');
        expect.soft(actualProductFullDetails.get('Brand')).toBe('Apple');
        expect.soft(actualProductFullDetails.get('Product Code')).toBe('Product 18');
        expect.soft(actualProductFullDetails.get('Reward Points')).toBe('800');
        expect.soft(actualProductFullDetails.get('Availability')).toBe('Out Of Stock');
});

test(`test product pricing details`, {tag:['@sanity']},async({page}) =>{
        let login: LoginPage = new LoginPage(page);
        await login.gotToLoginPage();
        let homePage: HomePage = await login.doLogin('test123@test.com','test');
        let resultsPage: ResultsPage =  await homePage.doSearch('macbook');
        let productInfoPage: ProductInfoPage = await resultsPage.selectProduct('MacBook Pro'); 

        let actualProductFullDetails = await productInfoPage.getProductDetails();
        expect.soft(actualProductFullDetails.get('header')).toBe('MacBook Pro');
        expect.soft(actualProductFullDetails.get('price')).toBe('$2,000.00');
        expect.soft(actualProductFullDetails.get('exttaxprice')).toBe('$2,000.00');
});


