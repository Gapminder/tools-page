import { browser, protractor } from 'protractor';

import { waitForSliderToBeReady } from '../../helpers/helper';
import { MountainChart } from '../../pageObjects/charts';
import { Sidebar, Slider } from '../../pageObjects/components';

const mountainChart: MountainChart = new MountainChart();
const sidebar: Sidebar = new Sidebar();
const slider: Slider = new Slider();

describe('Mountains chart', () => {
  beforeEach(async () => {
    await mountainChart.openChart();
  });

  it('Population and name displayed on the top', async () => {
    /**
     * should select a few entities, they should get selected on the visualization and their names
     * should appear as a list on top left. Population should be displayed after the name(TC23)
     */
    const EC = protractor.ExpectedConditions;
    expect(await mountainChart.yearLabel.isPresent()).toBe(true, 'year label is displayed');

    await browser.wait(EC.presenceOf(mountainChart.allCountriesOnChart.first()));

    expect(await mountainChart.allCountriesOnChart.count()).toEqual(165);
    await sidebar.findSelect.searchAndSelectCountry('China');
    await browser.wait(EC.presenceOf(mountainChart.selectedCountries.first()));

    expect(await mountainChart.selectedCountries.getText()).toMatch('China: 1.4B people');
    await browser.wait(EC.presenceOf(mountainChart.visualizationSelectedCountries.first()));
    expect(await mountainChart.visualizationSelectedCountries.count()).toEqual(1);
    expect(await mountainChart.visualizationSelectedCountries.get(0).getAttribute('style')).toContain('opacity: 1;');

    await sidebar.findSelect.searchAndSelectCountry('India');
    await browser.wait(EC.presenceOf(mountainChart.visualizationSelectedCountries.first()));
    expect(await mountainChart.selectedCountries.getText()).toMatch('India: 1.31B');
    expect(await mountainChart.visualizationSelectedCountries.count()).toEqual(2);
    expect(await mountainChart.visualizationSelectedCountries.get(1).getAttribute('style')).toContain('opacity: 1;');

    await sidebar.findSelect.searchAndSelectCountry('Brazil');
    await browser.wait(EC.presenceOf(mountainChart.visualizationSelectedCountries.first()));
    expect(await mountainChart.selectedCountries.getText()).toMatch('Brazil: 206M');
    expect(await mountainChart.visualizationSelectedCountries.count()).toEqual(3);
    expect(await mountainChart.visualizationSelectedCountries.get(2).getAttribute('style')).toContain('opacity: 1;');

    expect(await mountainChart.allCountriesOnChart.count()).toEqual(162);
    expect(await browser.getCurrentUrl()).toContain('geo=ind');
    expect(await browser.getCurrentUrl()).toContain('geo=chn');
    expect(await browser.getCurrentUrl()).toContain('geo=bra');
  });

  if (browser.params.desktop) {
    it('text on vertical line at the end of the chart', async () => {
      /**
       * should check that in 2015, the percentage of people living in the extreme poverty should be 11.5 ± 0.3%,
       * and the world population should be 7.33B(TC19)
       */
      await waitForSliderToBeReady();
      const extremePovertyPercentage = await mountainChart.extremePovertyPercentage.getText();

      await expect(Number(extremePovertyPercentage.replace('%', ''))).toBeGreaterThan(11.2);
      await expect(Number(extremePovertyPercentage.replace('%', ''))).toBeLessThan(11.8);

      await mountainChart.hoverMouseOver500AxisXOnMountainsChart();
      expect(await mountainChart.verticalLine.getText()).toEqual('7.33B');
    });

    it('labels on vertical line in 2015 and in 1800 match', async () => {
      /**
       * should check that in 2015 there is roughly the same amount of people living in the extreme poverty
       * as there was in 1800 (830 and 812 Millions)(TC20)
       */
      await mountainChart.hoverMouserOverExtremePovertyTitle();

      expect(await mountainChart.verticalLine.getText()).toEqual('833M');

      await slider.dragToStart();
      await mountainChart.hoverMouserOverExtremePovertyTitle();

      expect(await mountainChart.verticalLine.getText()).toEqual('812M');
    });
  }
});
