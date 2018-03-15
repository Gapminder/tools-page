import { $, $$, browser, ElementArrayFinder, ElementFinder, ExpectedConditions as EC } from 'protractor';

import {
  disableAnimations,
  safeOpen, waitForPageLoaded, waitForSliderToBeReady, waitForSpinner,
  waitForUrlToChange
} from '../../helpers/helper';
import { _$, _$$, ExtendedArrayFinder, ExtendedElementFinder } from '../../helpers/ExtendedElementFinder';
import { promise } from 'selenium-webdriver';
import { waitUntil } from '../../helpers/waitHelper';
import { TreeMenuModal } from '../sidebar/treeMenuModal.e2e-component';

export class CommonChartPage {
  static countries = {
    'Russia': 'rus',
    'Nigeria': 'nga',
    'Bangladesh': 'bgd',
    'Australia': 'aus',
    'India': 'ind',
    'China': 'chn',
    'USA': 'usa',
    'United States': 'usa',
    'Brazil': 'bra',
    'Argentina': 'arg',
    'Africa': 'africa',
    'Austria': 'aut',
    'Ukraine': 'ukr'
  };

  static opacity = {
    highlighted: 1,
    dimmed: 0.3
  };

  public static sideBar: ElementFinder = $('.vzb-tool-sidebar');
  public static buttonPlay: ExtendedElementFinder = _$('.vzb-ts-btn-play');
  public static buttonPause: ExtendedElementFinder = _$('.vzb-ts-btn-pause.vzb-ts-btn');
  public static mainChart: ElementFinder = $('.vzb-tool');
  public static spinner: ElementFinder = $('.vzb-loading-data');
  public static sliderReady: ElementFinder = $('.domain.rounded');
  public movingSliderProgress: ElementArrayFinder = $$('.domain.rounded');
  public mapsChart: ElementFinder = $('a[href*="map"]');
  public bubblesChart: ElementFinder = $('a[href*="bubbles"]');
  public linesChart: ElementFinder = $('a[href*="linechart"]');
  public mountainsChart: ElementFinder = $('a[href*="mountain"]');
  public rankingsChart: ElementFinder = $('a[href*="barrank"]');
  public pageHeader: ElementFinder = $('.header');
  public axisSearchInput: ExtendedElementFinder = _$('.vzb-treemenu-search');

  yAxisBtn: ExtendedElementFinder = _$('.vzb-bc-axis-y-title');
  xAxisBtn: ExtendedElementFinder = _$('.vzb-bc-axis-x-title');

  url: string;
  chartLink: ExtendedElementFinder;
  selectedCountries: ExtendedArrayFinder;

  public axisYMaxValue: ExtendedElementFinder = _$$('.vzb-bc-axis-y g[class="tick"] text').last();
  public axisXMaxValue: ExtendedElementFinder = _$$('.vzb-bc-axis-x g[class="tick"] text').last();
  asixDropdownOptions: ExtendedArrayFinder = _$$('.vzb-treemenu-list-item-label');

  treeMenuModal: TreeMenuModal = new TreeMenuModal();

  async waitForToolsPageCompletelyLoaded(): Promise<{}> {
    await waitUntil(CommonChartPage.sideBar);
    await waitUntil(CommonChartPage.buttonPlay);
    await browser.wait(EC.invisibilityOf(this.movingSliderProgress.get(1)), 30000);

    return await waitForSpinner();
  }

  async openChart(): Promise<void> {
    await safeOpen(`#_${this.url}`);
    await disableAnimations();
  }

  async openByClick(): Promise<{}> {
    const currentUrl = await browser.getCurrentUrl();
    /**
     * if we are already on this page no need to click on the link
     */
    if (!currentUrl.match(this.url)) {
      await this.chartLink.safeClick();

      return await waitForUrlToChange();
    }
  }

  async refreshPage(): Promise<void> {
    await browser.refresh();
    await waitForPageLoaded();
    await disableAnimations();
  }

  async getSelectedCountriesNames(): Promise<string> {
    await disableAnimations();
    await waitUntil(this.selectedCountries.first());
    await browser.sleep(1000); // TODO decide what to do with this

    return await this.selectedCountries.safeGetText();
  }

  async changeYaxisValue(option?: string): Promise<string> {
    return await this.changeAxisValue(this.yAxisBtn, option);
  }

  async changeXaxisValue(option: string) {
    return await this.changeAxisValue(this.xAxisBtn, option);
  }

  async changeAxisValue(axisBtn: ExtendedElementFinder, option?: string): Promise<string> {
    await axisBtn.safeClick();

    if (option) {
      await this.treeMenuModal.searchForItem(option);
      // await this.axisSearchInput.typeText(option);
      // await browser.sleep(1000); // no idea what to wait here
    }

    // const newOption: ExtendedElementFinder = this.asixDropdownOptions.first();
    const newOption: ExtendedElementFinder = this.treeMenuModal.listItems.first();

    await waitUntil(newOption);
    const newOptionValue = await newOption.getText();
    await newOption.click();

    await waitForSpinner();
    await waitForSliderToBeReady();

    return newOptionValue;
  }

}
