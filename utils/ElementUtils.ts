import { Page, Locator, FrameLocator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

type customLocator = string | Locator;

export class ElementUtil{
    private page: Page;
    private defaultTimeout: number = 30000;

    constructor(page:Page, timeout:number = 30000){
        this.page = page;
        this.defaultTimeout = timeout;     
        // Set the default timeout for all Playwright actions on this page
        this.page.setDefaultTimeout(timeout);
        this.page.setDefaultNavigationTimeout(timeout);    
    }

    //===================Locator Utils===================

     /**
     * returns Locator referring to current page
     * if locator is string returns locator using css or xpath
     * @param locator 
     * @returns Locator
     */
    private getLocator(locator: customLocator, index?:number): Locator{
        if(typeof(locator) === 'string'){
          if(index){
               return this.page.locator(locator).nth(index);
          }
          else{
               return this.page.locator(locator).first();
          }  
        }
        else{
          if(index){
               return locator.nth(index);
          }
          else{
               return locator.first();
          }
        }
    }

    public getFrameLocator(selector: string): FrameLocator{
     return this.page.frameLocator(selector);
    }
    
    //===================Element Actions===================

    /**
     * Click operation
     * @param locator 
     * @param options 
     */
     async click(locator: customLocator, options?: {force?: boolean,index?: number}): Promise<void>{
          await this.getLocator(locator, options?.index).click({
               force: options?.force
          });
          console.log('Clicked on element: '+locator);
     }

     /**
      * Fill operation
      * @param locator 
      * @param text 
      */
     async fill(locator: customLocator, text: string, options?: {index?: number}): Promise<void>{
          await this.getLocator(locator, options?.index).fill(text, {timeout: this.defaultTimeout});
          console.log('Entered text '+ text +' on element: '+locator);
     }

     /**
      * Double Click
      * @param locator 
      */
     async dblclick(locator: customLocator): Promise<void>{
          await this.getLocator(locator).dblclick();
          console.log('Clicked on element: '+locator);
     }

     /**
      * Right Click
      * @param locator 
      */
     async rightClick(locator: customLocator): Promise<void>{
          await this.getLocator(locator).click({
               button: 'right'
          });
          console.log('Right Clicked on element: '+locator);
     }

     /**
      * Fill text with delay with delay 
      * @param locator 
      * @param text 
      * @param delay 
      */
     async type(locator: customLocator, text: string, delay:number = 500): Promise<void>{
          await this.getLocator(locator).pressSequentially(text, {
               timeout: this.defaultTimeout,
               delay: delay
          });
          console.log('Typed text as human'+ text +' on element: '+locator);
     }

     /**
      * Clear text from text field
      * @param locator 
      */
     async clear(locator: customLocator): Promise<void>{
          await this.getLocator(locator).clear();
          console.log('Cleared text on element: '+locator);
     }

     //============Get Text and attribute============
     async getElementTextContent(locator: customLocator, options?: {index?: number}): Promise<string | null>{
          const textContent = await this.getLocator(locator, options?.index).textContent();
          console.log(`Textcontent of element ${locator} is ${textContent}`);
          return textContent;
     }

     async getElementInnerText(locator: customLocator): Promise<string>{
          const innerText = await this.getLocator(locator).innerText();
          console.log(`Innertext of element ${locator} is ${innerText}`);
          return innerText;
     }

     async getElementInputValue(locator: customLocator): Promise<string>{
          const inputValue = await this.getLocator(locator).inputValue();
          console.log(`Input value of element ${locator} is ${inputValue}`);
          return inputValue;
     }

     async getAttribute(locator: customLocator, attributeName: string): Promise<string|null>{
          const attributeValue = await this.getLocator(locator).getAttribute(attributeName);
          console.log(`Attribute value of element ${locator} is ${attributeValue}`);
          return attributeValue;
     }

     //============Element visibility & State check============
     async isVisible(locator: customLocator, index?: number): Promise<boolean>{
          return await this.getLocator(locator, index).isVisible();
     }

     async isHidden(locator: customLocator): Promise<boolean>{
          return await this.getLocator(locator).isHidden();
     }

     async isEnabled(locator: customLocator): Promise<boolean>{
          return await this.getLocator(locator).isEnabled();
     }

     async isDisabled(locator: customLocator): Promise<boolean>{
          return await this.getLocator(locator).isDisabled();
     }

     async isChecked(locator: customLocator): Promise<boolean>{
          return await this.getLocator(locator).isChecked();
     }

     async isEditable(locator: customLocator): Promise<boolean>{
          return await this.getLocator(locator).isEditable();
     }

     //============Wait Utils============ 
     /**
      * wait for element to be visible with default timeout
      * @param locator 
      * @param timeout 
      * @returns 
      */
     async waitForElementVisible(locator: customLocator, timeout: number = 5000): Promise<boolean>{
          try{
               await this.getLocator(locator).waitFor({state: 'visible', timeout});
               return true;
          }
          catch{
               return false;
          }
     }

     /**
      * wait for element to be hidden with default timeout
      * @param locator 
      * @param timeout 
      * @returns 
      */
     async waitForElementHidden(locator: customLocator, timeout: number = 5000): Promise<boolean>{
          try{
               await this.getLocator(locator).waitFor({state: 'hidden', timeout});
               return true;
          }
          catch{
               return false;
          }
     }
     /**
      * wait for page state
      * @param state 
      */
     async waitForPageLoad(state: 'load' | 'domcontentloaded' |'networkidle' = 'load'): Promise<void>{
          await this.page.waitForLoadState(state);
          console.log(`Waited for page load state: ${state}`);
     }

     /**
      * Static wait
      * @param timeout 
      */
     async sleep(timeout: number){
          console.log(`Sleep for ${timeout}`);
          await this.page.waitForTimeout(timeout);
          console.log('Sleep Done!!!');
     }
     
     //============Multiple elements============ 
     async getElementsTextContent(locator: customLocator): Promise<string[]>{
          const textContents:string[] = await this.getLocator(locator).allTextContents();
          console.log(`Textcontent of element ${locator} is ${textContents}`);
          return textContents;
     }

     async getElementsInnerText(locator: customLocator): Promise<string[]>{
          const innerTexts:string[] = await this.getLocator(locator).allInnerTexts();
          console.log(`Textcontent of element ${locator} is ${innerTexts}`);
          return innerTexts;
     }

     async getElements(locator: customLocator): Promise<Locator[]>{
          return await this.getLocator(locator).all();
     }

     //============Dropdown utils============ 
     async selectByText(locator: customLocator, text:string){
          await this.getLocator(locator).selectOption({label:text});
          console.log(`selected option ${text} from dropdown ${locator}`);
     }
     async selectByValue(locator: customLocator, value:string){
          await this.getLocator(locator).selectOption({value:value});
          console.log(`selected option ${value} from dropdown ${locator}`);
     }
     async selectByIndex(locator: customLocator, index:number){
          await this.getLocator(locator).selectOption({index:index});
          console.log(`selected option ${index} from dropdown ${locator}`);
     }

     //============scroll utils============ 
     async scrollToElement(locator: customLocator): Promise<void>{
          await this.getLocator(locator).scrollIntoViewIfNeeded();
          console.log(`Scrolled to element: ${locator}`);
     }

     async scrollBy(x: number, y: number): Promise<void>{
          await this.page.evaluate(({x, y}) => window.scrollBy(x, y), {x, y});
          console.log(`Relative scrolled page by x:${x} and y:${y}`);
     }

     async scrollTo(x: number, y: number): Promise<void>{
          await this.page.evaluate(({x, y}) => window.scrollTo(x, y), {x, y});
          console.log(`Absolute scrolled page to x:${x} and y:${y}`);
     }
     async scrollToTopOrBottom(top: boolean): Promise<void>{
          if (top == true){
               await this.page.evaluate(() => window.scrollTo(0, 0));
               console.log('Scrolled to top of page');
          }
          else{
               await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
               console.log('Scrolled to bottom of page');
          }
     }

     //============screenshot utils============
     async takePageScreenshot(fullPage:boolean = false, file_prefix: string = 'auto_',): Promise<void>{
          const pageScreenshotPath: string = 'screenshots/page/';
          // Create the folder if it doesn’t exist
          if (!fs.existsSync(pageScreenshotPath)) {
               fs.mkdirSync(pageScreenshotPath, { recursive: true });
          }

          // Generate random filename (e.g., abc123ef4a.png)
          const randomString = randomBytes(5).toString('hex'); // 10-char hex string
          const fileName = `${file_prefix}${randomString}.png`;

          // Full path of screenshot
          const filePath = path.join(pageScreenshotPath, fileName);

          //Take screenshot
          await this.page.screenshot({path: filePath, fullPage});

          console.log(`Screenshot saved: ${filePath}`);
     }

     async takeElementScreenshot(locator: customLocator,file_prefix: string = 'auto_',): Promise<void>{
          const elementScreenshotPath: string = 'screenshots/elements/';
          // Create the folder if it doesn’t exist
          if (!fs.existsSync(elementScreenshotPath)) {
               fs.mkdirSync(elementScreenshotPath, { recursive: true });
          }

          // Generate random filename (e.g., abc123ef4a.png)
          const randomString = randomBytes(5).toString('hex'); // 10-char hex string
          const fileName = `${file_prefix}${randomString}.png`;

          // Full path of screenshot
          const filePath = path.join(elementScreenshotPath, fileName);

          //Take screenshot
          await this.getLocator(locator).screenshot({path:filePath});

          console.log(`Screenshot saved: ${filePath}`);
     }

     //============Frame utils============ 

}