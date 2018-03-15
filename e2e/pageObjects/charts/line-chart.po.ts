import { $, $$, browser, ElementArrayFinder, ElementFinder } from 'protractor';

import { CommonChartPage } from './common-chart.po';
import { isCountryAddedInUrl, waitForSliderToBeReady, waitForSpinner, waitForUrlToChange } from '../../helpers/helper';
import { Slider } from '../components/slider.e2e-component';
import { _$, _$$, ExtendedArrayFinder, ExtendedElementFinder } from '../../helpers/ExtendedElementFinder';
import { waitUntil } from '../../helpers/waitHelper';

export class LineChart extends CommonChartPage {
  type = 'lineChart';
  url = 'chart-type=linechart';
  chartLink: ExtendedElementFinder = _$('.about a[href*="linechart"]');

  dataDoubtsLink: ExtendedElementFinder = _$('.vzb-data-warning');
  dataDoubtsWindow: ElementFinder = $('.vzb-data-warning-box');

  /**
   * specific Line chart selectors
   */
  latestPointOnChart: ElementFinder = $('[class="vzb-axis-value"]');
  selectedCountries: ExtendedArrayFinder = _$$('.vzb-lc-labelname.vzb-lc-labelfill');
  asixDropdownOptions: ExtendedArrayFinder = _$$('.vzb-treemenu-list-item-label');
  yAxisBtn: ExtendedElementFinder = _$('.vzb-lc-axis-y-title');
  axisValues: ElementArrayFinder = $$('.vzb-lc-axis-x .tick text');
  countriesLines: ElementArrayFinder = $$('.vzb-lc-line');
  linesLabels: ExtendedArrayFinder = _$$('[class="vzb-lc-entity"]');

  public linesChartShowAllButton: ElementFinder = $('.vzb-dialog-button.vzb-show-deselect');
  public linesChartRightSidePanelCountriesList: ElementArrayFinder = $$('.vzb-show-item.vzb-dialog-checkbox');
  public linesChartDataDoubtsLabel: ElementArrayFinder = $$('g[class="vzb-data-warning vzb-noexport"]');
  public linesChartSelectedCountries: ElementArrayFinder = $$('.vzb-lc-label');
  public advancedControlsRightSidePanelFindButton: ElementFinder = $$('[data-btn="find"]').last();

  /**
   * default sidebar elements
   * change it carefully
   */
  public sidebar = {
    countriesList: $('.vzb-show-list'),
    resetFilterButton: $('.vzb-show-deselect')
  };

  /**
   * specific sidebar elements, unique for Lines chart
   */
  public searchInputField: ExtendedElementFinder = _$('.vzb-show-search');
  public searchResult: ExtendedArrayFinder = _$$('div[class="vzb-show-item vzb-dialog-checkbox"] label'); // TODO maybe add test class to vizabi

  getSidebarElements() {
    return this.sidebar;
  }

  async openChart(): Promise<void> {
    await super.openChart();

    await new Slider().waitForSliderToBeReady();
  }

  async refreshPage(): Promise<void> {
    await super.refreshPage();
    await waitUntil(this.countriesLines.first());
  }

  getSelectedCountries() {
    return this.selectedCountries;
  }

  async selectLine(country: string): Promise<void> {
    await waitUntil(this.selectedCountries.first());
    await browser.sleep(500); // TODO stupid click
    await this.linesLabels.findElementByText(country).safeClick();

    await browser.wait(isCountryAddedInUrl(country), 5000, 'country in URL');
  }

  async getLineOpacity(country: string): Promise<number> {
    await waitUntil(this.selectedCountries.first());

    return Number(await this.linesLabels.findElementByText(country).safeGetCssValue('opacity'));
  }

  async countHighlightedLines(): Promise<number> {
    return await this.countLinesByOpacity(CommonChartPage.opacity.highlighted);
  }

  async countDimmedLines(): Promise<number> {
    return await this.countLinesByOpacity(CommonChartPage.opacity.dimmed);
  }

  async countLinesByOpacity(opacity: number): Promise<number> {
    return await $$(`.vzb-lc-lines .vzb-lc-entity[style="opacity: ${opacity};"]`).count();
  }

  async hoverLine(country: string): Promise<void> {
    await waitUntil(this.selectedCountries.first());
    const lines = _$$('.vzb-lc-entity');

    await this.linesLabels.findElementByText(country).hover();
  }

  changeYaxisValue(): Promise<string> {
    return super.changeYaxisValue();
  }

  async getLineLabelColor(country: string) {
    return await this.selectedCountries.findElementByText(country).safeGetCssValue('fill');
  }

  getLineColor(country: string) {
    return _$(`[class*="vzb-lc-entity-${CommonChartPage.countries[country]}"]`)
      ._$$('.vzb-lc-line')
      .first()
      .getCssValue('stroke');
  }
}
