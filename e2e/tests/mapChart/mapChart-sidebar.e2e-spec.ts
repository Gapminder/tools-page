import { browser } from 'protractor';

import { MapChart } from '../../pageObjects/charts';
import { Sidebar } from '../../pageObjects/components';

const mapChart: MapChart = new MapChart();
const sidebar: Sidebar = new Sidebar();

describe('Maps chart: Sidebar', () => {
  beforeEach(async () => {
    await mapChart.openChart();
  });

  it('Countries could be selected/deselected using the search in sidebar', async () => {
    await sidebar.findSelect.searchAndSelectCountry('China');
    expect(await mapChart.selectedCountries.count()).toEqual(1);

    await sidebar.findSelect.searchAndSelectCountry('India');
    expect(await mapChart.selectedCountries.count()).toEqual(2);

    expect(await mapChart.selectedCountriesLabels.getText()).toMatch('China');
    expect(await mapChart.selectedCountriesLabels.getText()).toMatch('India');
    expect(await browser.getCurrentUrl()).toContain('country=ind');
    expect(await browser.getCurrentUrl()).toContain('country=chn');

    await sidebar.findSelect.deselectCountryInSearch('India');
    expect(await mapChart.selectedCountries.count()).toEqual(1);

    await sidebar.findSelect.deselectCountryInSearch('China');
    expect(await mapChart.selectedCountries.count()).toEqual(0);

    expect(await browser.getCurrentUrl()).not.toContain('country=ind');
    expect(await browser.getCurrentUrl()).not.toContain('country=chn');
  });
});
