import { test as base, expect } from '@playwright/test';
import {HomePage} from '../pages/HomePage';

type MyFixtures = {
    homePage: HomePage;
}

base.extend<MyFixtures>({
    homePage:async({page, baseURL}, use, testInfo) =>{
        
    }
})