import { $, $$, browser, ElementArrayFinder, ElementFinder, ExpectedConditions as EC } from 'protractor';
import { _$, _$$, ExtendedElementFinder } from '../../helpers/ExtendedElementFinder';

import { waitForSpinner } from '../../helpers/helper';
import { RankingsChart } from '../../pageObjects/charts';
import { Sidebar, Slider } from '../../pageObjects/components';

const ranksChart: RankingsChart = new RankingsChart();
const sidebar: Sidebar = new Sidebar();
const slider: Slider = new Slider();

const yearAtTop = browser.params.desktop ? sidebar.yearAtTop : _$('.vzb-br-total');

describe('Ranks chart: Sidebar', () => {
  beforeEach(async() => {
    await ranksChart.openChart();
  });

  it('Add country from country list in sidebar', async() => {
    await sidebar.findSelect.clickOnCountryFromList('Argentina');
    await expect(ranksChart.getSelectedCountriesNames()).toMatch('Argentina');

    expect(await ranksChart.selectedCountries.count()).toEqual(1);
  });

  it('Add country from search in sidebar', async() => {
    await sidebar.findSelect.searchAndSelectCountry('Argentina');
    await expect(ranksChart.getSelectedCountriesNames()).toMatch('Argentina');

    expect(await ranksChart.selectedCountries.count()).toEqual(1);
  });

  it('Change color at the top of sidebar', async() => {
    await sidebar.colorSection.searchAndSelectInColorDropdown('Main religion');
    await waitForSpinner();

    const colorFromColorSection = await sidebar.colorSection.color.firstColor.getAttribute('style');
    expect(colorFromColorSection).toContain(await ranksChart.getBarForCountry('China').safeGetCssValue('fill'));
  });

  xit(`"SHOW" button hide all except selected`, async() => {
    await sidebar.show.searchAndSelectCountry('China');

    expect(await ranksChart.allBars.count()).toEqual(1);
    expect(await sidebar.findSelect.countriesList.count()).toEqual(1);

    await sidebar.show.searchAndSelectCountry('Ukraine');

    expect(await ranksChart.allBars.count()).toEqual(2);
    expect(await sidebar.findSelect.countriesList.count()).toEqual(2);
  });

  it(`"DESELECT" button reset selected countries`, async() => {
    await sidebar.findSelect.clickOnCountryFromList('India');
    await sidebar.findSelect.deselectAllCountries();

    expect(await ranksChart.countDimmedBars()).toEqual(0);
  });

  it(`Active year at the top`, async() => {
    await slider.dragToMiddle();
    const selectedYear = await slider.getPosition();

    expect(await yearAtTop.safeGetText()).toEqual(selectedYear);
  });
});
