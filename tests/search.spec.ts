import {parse} from 'csv-parse/sync';
import fs from 'fs';

import { test, expect } from '../fixtures/baseFixtures'

import { ResultsPage } from '../pages/ResultsPage.js';

let searchData = [
    {searchkey: 'macbook', resultsCount: 3},
    {searchkey: 'samsung', resultsCount: 2},
    {searchkey: 'imac', resultsCount: 1},
    {searchkey: 'canon', resultsCount: 1},
    {searchkey: 'dummy', resultsCount: 0}
]

for(let product of searchData){
    test(`test product search ${product.searchkey}`, async({homePage}) =>{
        let resultsPage: ResultsPage =  await homePage.doSearch(product.searchkey);
        expect(await resultsPage.getSearchResultsCount()).toBe(product.resultsCount);
    });
}

type ProductSearchDataSchema = {
    searchkey: string, 
    resultsCount: string
};

let fileContent = fs.readFileSync('./test-data/product-search.csv', 'utf-8');
let productSearchData: ProductSearchDataSchema[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
});

for(let product of productSearchData){
    test(`test product search using csv ${product.searchkey}`, async({homePage}) =>{
        let resultsPage: ResultsPage =  await homePage.doSearch(product.searchkey);
        expect(await resultsPage.getSearchResultsCount()).toBe(parseInt(product.resultsCount, 10));
    });
}