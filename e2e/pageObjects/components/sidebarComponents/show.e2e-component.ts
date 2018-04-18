import { browser, ExpectedConditions as EC } from 'protractor';

import { _$, _$$, ExtendedArrayFinder, ExtendedElementFinder } from '../../../helpers/ExtendedElementFinder';
import { isCountryAddedInUrl, waitForSliderToBeReady, waitForSpinner } from '../../../helpers/helper';

export class Show {
  private isDesktop: boolean = browser.params.desktop;

  findButton: ExtendedElementFinder = _$$('[data-btn="find"]').last();
  showSearchInputField: ExtendedElementFinder = _$('.vzb-find-search');
  showSearchResult: ExtendedArrayFinder = _$$('div[class*="vzb-show-item vzb-dialog-checkbox"] label'); // TODO
  showSwitchButton: ExtendedElementFinder = _$('.vzb-switch-off');
  deselectButton: ExtendedElementFinder = _$('.vzb-find-deselect');
  showApplyBtn: ExtendedElementFinder = this.isDesktop ? _$('.vzb-show-apply') : _$('div[class*="vzb-dialog-button"][data-dialogtype="find"]');
  showListAccordionBtn: ExtendedElementFinder = _$('.vzb-show-list.vzb-accordion');
  geographicLocation: ExtendedElementFinder = _$$('.vzb-show-category').findElementByText('Geographic location');
  geographicRegions: ExtendedElementFinder = _$$('.vzb-show-category').findElementByText('Geographic regions');

  countryList: ExtendedElementFinder = _$$('[class="vzb-show-item vzb-dialog-checkbox"]').first();
  resetBtn: ExtendedElementFinder = _$('.vzb-show-deselect');

  async searchAndSelectCountry(country: string, select = true): Promise<void> {
    if (!this.isDesktop && !(await this.showSearchInputField.isDisplayed())) {
      await this.findButton.safeClick();
    }
    if (await this.showSwitchButton.isDisplayed()) {
      await this.showSwitchButton.safeClick();
    }

    await this.showSearchInputField.typeText(country);
    await browser.wait(EC.presenceOf(this.showSearchResult.first()), 5000, 'search results not present');
    const counrtyInSearchResults = await this.showSearchResult.findElementByText(country);
    await counrtyInSearchResults.safeClick();
    await this.showApplyBtn.safeClick();

    await browser.wait(isCountryAddedInUrl(country, select), 10000, 'coutry in URL');

    await waitForSpinner();
  }

  async deselectCountryInSearch(country: string): Promise<void> {
    await this.searchAndSelectCountry(country, false);
  }

  async clickOnCountryFromList(country: string, preopen = false): Promise<void> {
    if (!this.isDesktop) {
      await this.findButton.safeClick();
    }
    if (await this.showSwitchButton.isDisplayed()) {
      await this.showSwitchButton.safeClick();
    }

    if (!preopen) await this.geographicLocation.safeClick();
    await this.showSearchResult.findElementByText(country).safeClick();
    await this.showApplyBtn.safeClick();

    await browser.wait(isCountryAddedInUrl(country));
    await waitForSpinner();
  }

  async clickResetButton(): Promise<void> {
    if (!this.isDesktop) {
      await this.findButton.safeClick();
    }
    if (await this.showSwitchButton.isDisplayed()) {
      await this.showSwitchButton.safeClick();
    }

    await this.resetBtn.safeClick();
    await waitForSpinner();
    await waitForSliderToBeReady();

    await this.closeOnMobile();
  }

  async closeOnMobile(): Promise<void> {
    if (!this.isDesktop) {
      await this.findButton.safeClick();
    }
  }

}
