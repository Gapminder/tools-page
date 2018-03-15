import { browser, by, element, ElementFinder, ExpectedConditions as EC } from 'protractor';
import { _$, _$$, ExtendedArrayFinder, ExtendedElementFinder } from '../../helpers/ExtendedElementFinder';
import { waitForSpinner, waitForUrlToChange, isCountryAddedInUrl, waitForSliderToBeReady } from '../../helpers/helper';
import { waitUntil } from '../../helpers/waitHelper';
import { TreeMenuModal } from './treeMenuModal.e2e-component';

export class Show {
  private isDesktop: boolean = browser.params.desktop;

  showSearchInputField: ExtendedElementFinder = _$('.vzb-find-search');
  showSearchResult: ExtendedArrayFinder = _$$('div[class*="vzb-show-item vzb-dialog-checkbox"] label'); // TODO
  showButton: ExtendedElementFinder = _$('.vzb-switch-off');
  deselectButton: ExtendedElementFinder = _$('.vzb-find-deselect');
  showApplyBtn: ExtendedElementFinder = _$('.vzb-show-apply');
  showListAccordionBtn: ExtendedElementFinder = _$('.vzb-show-list.vzb-accordion');

  countryList: ExtendedElementFinder = _$$('[class="vzb-show-item vzb-dialog-checkbox"]').first();
  resetBtn: ExtendedElementFinder = _$('.vzb-show-deselect');

  async searchAndSelectCountry(country: string, select = true): Promise<void> {
    if (!this.isDesktop && !(await this.showSearchInputField.isDisplayed())) {
      await this.showButton.safeClick();
    }

    await this.showSearchInputField.typeText(country);
    await browser.wait(EC.presenceOf(this.showSearchResult.first()), 5000, 'search results not present');
    const counrtyInSearchResults = await this.showSearchResult.findElementByText(country);
    await counrtyInSearchResults.safeClick();
    await this.showApplyBtn.safeClick();

    await browser.wait(isCountryAddedInUrl(country, select), 10000, 'coutry in URL');

    await waitForSpinner();
    await this.closeOnMobile();
  }

  async deselectCountryInSearch(country: string): Promise<void> {
    await this.searchAndSelectCountry(country, false);
  }

  async clickOnCountryFromList(country: string): Promise<void> {
    if (!this.isDesktop) {
      await this.showButton.safeClick();
    }

    await this.showListAccordionBtn.safeClick();
    await this.showSearchResult.findElementByText(country).safeClick();
    await this.showApplyBtn.safeClick();

    await browser.wait(isCountryAddedInUrl(country));
    await waitForSpinner();
    await this.closeOnMobile();
  }

  async clickResetButton(): Promise<void> {
    if (!this.isDesktop) {
      await this.showButton.safeClick();
    }

    await this.resetBtn.safeClick();
    await waitForSpinner();
    await waitForSliderToBeReady();

    await this.closeOnMobile();
  }

  async closeOnMobile(): Promise<void> {
    if (!this.isDesktop) {
      await this.showButton.safeClick();
    }
  }

}