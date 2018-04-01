import { browser, ExpectedConditions as EC } from 'protractor';

import { _$, _$$, ExtendedArrayFinder, ExtendedElementFinder } from '../../../helpers/ExtendedElementFinder';
import { waitForSpinner, isCountryAddedInUrl } from '../../../helpers/helper';

export class Find {
  private isDesktop: boolean = browser.params.desktop; // TODO replace isDesktop with isOpen

  findButton: ExtendedElementFinder = this.isDesktop ? _$('.vzb-switch-on') : _$$('[data-btn="find"]').last();
  countriesInFindModal: ExtendedArrayFinder = _$$('.vzb-find-item.vzb-dialog-checkbox');
  searchInputField: ExtendedElementFinder = _$('.vzb-find-search');
  searchResult: ExtendedArrayFinder = _$$('.vzb-find-item.vzb-dialog-checkbox label');
  countriesList: ExtendedArrayFinder = _$$('.vzb-find-list > div'); // TODO
  deselectButton: ExtendedElementFinder = _$('.vzb-find-deselect');

  async searchAndSelectCountry(country: string, select = true): Promise<void> {
    /**
     * this method can be used to both select and deselect country
     * LineChart-page use it's own selectors
     */
    if (!this.isDesktop) {
      await this.findButton.safeClick();
    }

    await this.searchInputField.typeText(country);
    await browser.wait(EC.presenceOf(this.searchResult.first()), 5000, 'search results not present');
    const counrtyInSearchResults = await this.searchResult.findElementByText(country);
    await counrtyInSearchResults.safeClick();

    await browser.wait(isCountryAddedInUrl(country, select), 10000, 'coutry in URL');

    await waitForSpinner();
    await this.closeOnMobile();
  }

  async deselectCountryInSearch(country: string): Promise<void> {
    await this.searchAndSelectCountry(country, false);
  }

  async deselectAllCountries(): Promise<void> {
    if (!this.isDesktop) {
      await this.findButton.safeClick();
    }

    await this.deselectButton.safeClick();
    await this.closeOnMobile();
  }

  async clickOnFindButton(): Promise<void> {
    await this.findButton.safeClick();
    await browser.wait(EC.visibilityOf(this.countriesInFindModal.first()));
  }

  async clickOnCountryFromList(country: string): Promise<void> {
    if (!this.isDesktop) {
      await this.findButton.safeClick();
    }

    await this.searchResult.findElementByText(country).safeClick();

    await browser.wait(isCountryAddedInUrl(country));
    await waitForSpinner();
    await this.closeOnMobile();
  }

  async hoverCountryFromList(country: string): Promise<void> {
    if (!this.isDesktop) {
      await this.findButton.safeClick();
    }

    await this.searchResult.findElementByText(country).hover();
    await this.closeOnMobile();
  }

  async closeOnMobile(): Promise<void> {
    if (!this.isDesktop) {
      await this.findButton.safeClick();
    }
  }


}
