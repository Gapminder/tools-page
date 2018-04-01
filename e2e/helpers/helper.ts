import { browser, ElementFinder, ExpectedConditions as EC } from 'protractor';

import { CommonChartPage } from '../pageObjects/charts/common-chart.po';

const MAX_TIMEOUT = 30000;
const TIMEOUT = 15000;

export function safeOpen(url: string) {
  return browser.get(browser.baseUrl + url)
    .then(() => browser.refresh()) // TODO remove this after fixing https://github.com/Gapminder/ng2-tools-page/issues/175
    .then(() => waitForPageLoaded());
}

export function waitForPageLoaded() {
  return browser.wait(EC.visibilityOf(CommonChartPage.sideBar), MAX_TIMEOUT)
    .then(() => browser.wait(EC.visibilityOf(CommonChartPage.mainChart), MAX_TIMEOUT))
    .then(() => browser.wait(EC.visibilityOf(CommonChartPage.buttonPlay), MAX_TIMEOUT))
    .then(() => browser.wait(EC.visibilityOf(CommonChartPage.sliderReady), MAX_TIMEOUT));
}

export function waitForSpinner() {
  return browser.wait(EC.stalenessOf(CommonChartPage.spinner), TIMEOUT, 'stalenessOf of spinner');
}

export async function safeDragAndDrop(from: ElementFinder, to: any) {
  await browser.wait(EC.visibilityOf(from), TIMEOUT, `element ${from.locator().value} not visible`);
  await disableAnimations();

  await browser.actions().mouseMove(from).perform();
  await browser.actions().mouseDown().perform();
  await browser.actions().mouseMove(to).perform();
  await browser.actions().mouseUp().perform();
}

export function safeExpectIsDispayed(element: ElementFinder, interval?: number) {
  const timeout = interval || TIMEOUT;

  return browser.wait(EC.visibilityOf(element), timeout, `element ${element.locator().value} is not visible in ${timeout} ms`);
}

export function waitForSliderToBeReady() {
  return browser.wait(EC.visibilityOf(CommonChartPage.sliderReady), MAX_TIMEOUT, 'slider is not ready');
}

export async function waitForUrlToChange(currentUrl?: string) {
  const _currentUrl = currentUrl || await browser.getCurrentUrl();

  return browser.wait(EC.not(EC.urlIs(_currentUrl)), MAX_TIMEOUT, 'URL not changed');
}

export function isCountryAddedInUrl(country: string, state = true): Function {
  /**
   * if state = true use it to wait for presence string in url
   * otherwise, use to wait for string to be removed from URL
   */

  if (state) {
    return () => {
      return browser.getCurrentUrl().then(url => {
        return url.includes(`=${CommonChartPage.countries[country]}`);
      });
    };
  } else {
    return () => {
      return browser.getCurrentUrl().then(url => {
        return !url.includes(`=${CommonChartPage.countries[country]}`);
      });
    };
  }
}

export function disableAnimations() {
  return browser.executeScript(`var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '* {' +
    '-webkit-transition: none !important;' +
    '-moz-transition: none !important' +
    '-o-transition: none !important' +
    '-ms-transition: none !important' +
    'transition: none !important' +
    '}';
  document.getElementsByTagName('head')[0].appendChild(style);`);
}
