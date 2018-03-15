import {
  $, $$, browser, by, By, element, ElementArrayFinder, ElementFinder,
  ExpectedConditions as EC
} from 'protractor';
import { promise } from 'selenium-webdriver';
import { waitUntil } from './waitHelper';
import { WebdriverWebElement } from 'protractor/built/element';

const TIMEOUT = 15000;

export class ExtendedElementFinder extends ElementFinder {
  private errorMessage = `element ${this.locator().value} not visible`;

  constructor(elementFinder: ElementFinder) {
    super(elementFinder.browser_, elementFinder.elementArrayFinder_);
  }

  safeClick(): promise.Promise<void> {
    return browser.wait(EC.elementToBeClickable(this), TIMEOUT, this.errorMessage).then(() => {
      return this.click();
    });
  }

  safeClear(): promise.Promise<void> {
    return browser.wait(EC.visibilityOf(this), TIMEOUT, this.errorMessage).then(() => {
      return this.clear();
    });
  }

  safeSendKeys(text: string): promise.Promise<void> {
    return browser.wait(EC.visibilityOf(this), TIMEOUT, this.errorMessage).then(() => {
      return this.sendKeys(text);
    });
  }

  typeText(text: string): promise.Promise<void> {
    return browser.wait(EC.presenceOf(this), TIMEOUT).then(() => {
      return browser.wait(EC.elementToBeClickable(this), TIMEOUT, this.errorMessage)
        .then(() => {
          return this.clear().then(() => {
            return this.sendKeys(text);
          });
        });
    });
  }

  hover(): promise.Promise<void> {
    return browser.wait(EC.visibilityOf(this), TIMEOUT, this.errorMessage).then(() => {
      return browser.actions().mouseMove(this).perform();
    });
  }

  safeGetAttribute(attr: string): promise.Promise<string> {
    return browser.wait(EC.visibilityOf(this), TIMEOUT, this.errorMessage).then(() => {
      return this.getAttribute(attr);
    });
  }

  safeGetCssValue(val: string): promise.Promise<string> {
    return browser.wait(EC.visibilityOf(this), TIMEOUT, this.errorMessage).then(() => {
      return this.getCssValue(val);
    });
  }

  safeGetText(): promise.Promise<string> {
    return browser.wait(EC.visibilityOf(this), TIMEOUT, this.errorMessage).then(() => {
      return this.getText();
    });
  }

  _$$(cssSelector: string) {
    return new ExtendedArrayFinder(this.$$(cssSelector));
  }

  _$(cssSelector: string) {
    return new ExtendedElementFinder(this.$(cssSelector));
  }

  // TODO think about this, because for now it looks weird
  dragAndDrop(to: any): promise.Promise<void> {
    return browser.wait(EC.visibilityOf($(this.locator().value)), TIMEOUT, this.errorMessage).then(() => {
      return browser.actions().dragAndDrop(this, to).perform();
    });
  }
}


export class ExtendedArrayFinder extends ElementArrayFinder {
  constructor(elementArrayFinder: ElementArrayFinder) {
    super(elementArrayFinder.browser_, elementArrayFinder.getWebElements, elementArrayFinder.locator(), elementArrayFinder.actionResults_);
  }

  get(index: number): ExtendedElementFinder {
    return new ExtendedElementFinder(super.get(index));
  }

  first(): ExtendedElementFinder {
    return new ExtendedElementFinder(super.first());
  }

  last(): ExtendedElementFinder {
    return new ExtendedElementFinder(super.last());
  }

  findElementByText(searchText: string): ExtendedElementFinder {
    return new ExtendedElementFinder(element.all(by.cssContainingText(this.first().locator().value, searchText)).first());
  }

  safeGetAttribute(attr: string): promise.Promise<string> {
    return browser.wait(EC.visibilityOf(this.first()), TIMEOUT, this.errorMessage).then(() => {
      return this.getAttribute(attr);
    });
  }

  safeGetText(): promise.Promise<string> {
    return browser.wait(EC.visibilityOf(this.first()), TIMEOUT, this.errorMessage).then(() => {
      return this.getText();
    });
  }
}


export function _$(cssSelector: string): ExtendedElementFinder {
  // only css selector supported
  return new ExtendedElementFinder($(cssSelector));
}

export function _$$(cssSelector: string): ExtendedArrayFinder {
  // only css selector supported
  return new ExtendedArrayFinder($$(cssSelector));
}
