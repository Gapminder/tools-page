import { $, $$, browser, ElementArrayFinder, ElementFinder } from 'protractor';

import { CommonChartPage } from './common-chart.po';
import { _$, _$$, ExtendedArrayFinder, ExtendedElementFinder } from '../../helpers/ExtendedElementFinder';
import { waitUntil } from '../../helpers/waitHelper';

export class MountainChart extends CommonChartPage {
  url = 'chart-type=mountain';
  chartLink: ExtendedElementFinder = _$('.about a[href*="mountain"]');


  public selectedCountries: ExtendedArrayFinder = _$$('text[class="vzb-mc-label-text"]');
  public extremePovertyPercentage: ElementFinder = $('text[class="vzb-shadow vzb-mc-probe-value-ul"]');
  public axisXLineNumbers: ElementArrayFinder = $$('g[class="tick"]');
  public verticalLine: ElementFinder = $$('.vzb-mc-probe-value-dl').first();
  public extremePovertyTitle: ElementFinder = $('text[class="vzb-mc-probe-extremepoverty"]');
  public allCountriesOnChart: ElementArrayFinder = $$('path[class="vzb-mc-mountain vzb-mc-aggrlevel0"]');
  public advancedControlsShowButtons: ExtendedElementFinder = _$$('[data-btn="show"]').last();
  public showButtonSearchInputField: ExtendedElementFinder = _$('input[class="vzb-show-search"]');
  public linesChartSearchResult: ElementFinder = $$('div[class*="vzb-show-item vzb-dialog-checkbox"] label').first(); // TODO
  public rightSidePanelCountriesList: ElementArrayFinder = $$('.vzb-find-list > div'); // TODO
  public showMenuSelectedCountry: ElementFinder = $$('.vzb-show-item').first();
  public yearLabel: ElementFinder = $('g[class="vzb-mc-year vzb-dynamic-background"]');
  public visualizationSelectedCountries: ElementArrayFinder = $$('.vzb-selected');

  public sidebar = {
    stackSection: $('.vzb-howtostack')
  };

  getSidebarElements() {
    return this.sidebar;
  }

  getSelectedCountries(): ElementArrayFinder {
    return this.selectedCountries;
  }

  async hoverMouseOver500AxisXOnMountainsChart(): Promise<void> {
    const element = await this.axisXLineNumbers.get(10);
    await browser.actions().mouseMove(element).perform();
    await waitUntil(this.verticalLine);
  }

  async hoverMouserOverExtremePovertyTitle(): Promise<void> {
    await browser.actions().mouseMove(this.extremePovertyTitle).perform();
    await browser.actions().mouseMove({x: 10, y: 90}).perform();
    await waitUntil(this.verticalLine);
  }
}
