import { browser, ElementFinder, ExpectedConditions as EC } from 'protractor';
import { ExtendedElementFinder } from './ExtendedElementFinder';

const TIMEOUT = 10000;

export async function waitUntil(element: ElementFinder | ExtendedElementFinder) {
  return await browser.wait(EC.visibilityOf(element), TIMEOUT, `element ${element.locator().value} not visible`);
}
