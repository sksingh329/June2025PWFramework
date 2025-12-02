import {parse} from 'csv-parse/sync';
import fs from 'fs';

import { test, expect } from '../fixtures/baseFixtures';

import { ResultsPage } from '../pages/ResultsPage.js';

const searchData = [
    {searchkey: 'macbook', resultsCount: 3},
    {searchkey: 'samsung', resultsCount: 2},
    {searchkey: 'imac', resultsCount: 1},
    {searchkey: 'canon', resultsCount: 1},
    {searchkey: 'dummy', resultsCount: 0}
];

for(const product of searchData){
    test(`test product search ${product.searchkey}`, async({homePage}) =>{
        const resultsPage: ResultsPage =  await homePage.doSearch(product.searchkey);
        expect(await resultsPage.getSearchResultsCount()).toBe(product.resultsCount);
    });
}

type ProductSearchDataSchema = {
    searchkey: string, 
    resultsCount: string
};

const fileContent = fs.readFileSync('./test-data/product-search.csv', 'utf-8');
const productSearchData: ProductSearchDataSchema[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
});

for(const product of productSearchData){
    test(`test product search using csv ${product.searchkey}`, async({homePage}) =>{
        const resultsPage: ResultsPage =  await homePage.doSearch(product.searchkey);
        expect(await resultsPage.getSearchResultsCount()).toBe(parseInt(product.resultsCount, 10));
    });
}