import { waitUntil } from '../../helpers/waitHelper';
import { LineChart } from '../../pageObjects/charts';
import { Sidebar, Slider } from '../../pageObjects/components';

const lineChart: LineChart = new LineChart();
const sidebar: Sidebar = new Sidebar();

describe('Line chart: Sidebar', () => {
  const DEFAULT_COUNTRIES_NUMBER = 4;
  beforeEach(async () => {
    await lineChart.openChart();
  });
  it('Add country from country list in sidebar', async () => {
    await sidebar.show.clickOnCountryFromList('Argentina');
    expect(await lineChart.getSelectedCountriesNames()).toMatch('Argentina');

    expect(await lineChart.countriesLines.count()).toEqual(DEFAULT_COUNTRIES_NUMBER + 1);
  });

  it('Add country from search in sidebar', async () => {
    await sidebar.show.searchAndSelectCountry('Argentina');
    expect(await lineChart.getSelectedCountriesNames()).toMatch('Argentina');

    expect(await lineChart.countriesLines.count()).toEqual(DEFAULT_COUNTRIES_NUMBER + 1);
  });

  it('Reset button drop settings to default', async () => {
    await sidebar.show.clickOnCountryFromList('Argentina');
    await sidebar.show.clickResetButton();

    expect(await lineChart.countriesLines.count()).toEqual(DEFAULT_COUNTRIES_NUMBER, 'number of selected countries');
  });

  it('"Find" button in sidebar show only selected countries', async () => {
    const chartCountries = lineChart.selectedCountries;
    await sidebar.findSelect.clickOnFindButton();
    const modalCountries = sidebar.findSelect.countriesInFindModal;

    expect(await chartCountries.count()).toEqual(await modalCountries.count());

    /**
     * 'United states' displayed on chart as 'United Sta...'
     * this removes dots from name
     * and iterate through the names to find matches
     */
    const chartCountriesText = await chartCountries.getText();
    const modalCountriesText = await modalCountries.getText();
    const filteredChartCountries = chartCountriesText
      .toString()
      .replace(/\./g, '')
      .split(',');

    const filteredModelCountries = modalCountriesText.toString();

    filteredChartCountries.forEach(item => {
      expect(filteredModelCountries.includes(item)).toBe(true, `${item} not match ${filteredModelCountries}`);
    });
  });

  it('Change lines colors at the top of sidebar', async () => {
    await sidebar.colorSection.selectInColorDropdown(sidebar.colorSection.color.mainReligion);
    await waitUntil(lineChart.countriesLines.first());

    const colorFromColorSection = await sidebar.colorSection.getColorFromColorSection();
    expect(await lineChart.getLineColor('China')).toEqual(colorFromColorSection, 'line color');
  });
});
