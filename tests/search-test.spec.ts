import {test, expect, FrameLocator} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js'
import { HomePage } from '../pages/HomePage.js';
import { ResultsPage } from '../pages/ResultsPage.js';

let searchData = [
    {searchkey: 'macbook', resultsCount: 3},
    {searchkey: 'samsung', resultsCount: 2},
    {searchkey: 'imac', resultsCount: 1},
    {searchkey: 'canon', resultsCount: 1},
    {searchkey: 'dummy', resultsCount: 0}
]

for(let product of searchData){
    test(`test product search ${product.searchkey}`, async({page}) =>{
        let login: LoginPage = new LoginPage(page);
        await login.gotToLoginPage();
        let homePage: HomePage = await login.doLogin('test123@test.com','test');
        let resultsPage: ResultsPage =  await homePage.doSearch(product.searchkey);
        expect(await resultsPage.getSearchResultsCount()).toBe(product.resultsCount);
    });
}
