import { browser, protractor } from 'protractor';

import { BubbleChart, LineChart, MapChart, MountainChart, RankingsChart } from '../pageObjects/charts';
import { Sidebar, Slider } from '../pageObjects/components';
import { safeOpen, waitForPageLoaded } from '../helpers/helper';
import using = require('jasmine-data-provider');

const DATA_PROVIDER = {
  'Bubbles Chart': {chart: new BubbleChart()},
  'Map Chart': {chart: new MapChart()},
  'Mountains Chart': {chart: new MountainChart()},
  'Line Chart': {chart: new LineChart()},
  'Rankings Chart': {chart: new RankingsChart()}
};

describe('All charts - Acceptance', () => {

  describe('No additional data in URL when chart opens', () => {
    /**
     * Tests which check URL's correctness when switching between charts. Browser has to be restarted before each test!
     */

    using(DATA_PROVIDER, (data, description) => {
      it(`URL on ${description} page`, async() => {
        await safeOpen('');
        const chart = data.chart;
        await chart.openByClick();

        const URL = await browser.getCurrentUrl();
        const pattern = new RegExp(chart.url, 'g');

        await expect(URL.match(pattern).length).toEqual(1);
      });
    });
  });

  describe('Side panel presence(TC33)', () => {
    /**
     * On large screen there is a side panel with color controls and list of countries.
     */

    using(DATA_PROVIDER, (data, description) => {
      it(`Side panel on ${description} page`, async() => {
        const chart = data.chart;
        await chart.openChart();

        const sidebar: Sidebar = new Sidebar();
        await sidebar.waitForVisible();

        const commonSidebar = sidebar.sidebar;

        await Promise.all(Object.keys(commonSidebar).map(async element => {
          return await expect(commonSidebar[element].isPresent()).toBe(true, `${element} not found`);
        }));

        const chartSideBar = await chart.getSidebarElements();
        await Promise.all(Object.keys(chartSideBar).map(async element => {
          return await expect(chartSideBar[element].isPresent()).toBe(true, `${element} not found`);
        }));
      });
    });
  });

  describe('URL persistency(TC34)', () => {
    /**
     * URL persistency: set time slider to some point, refresh, timeslider should keep the point you gave it, and chart should load at the state of that point.
     * URL persistency: select a few entities, refresh, entities should be selected.
     */

    using(DATA_PROVIDER, (data, description) => {
      it(`Timeslider hold the value after reload ${description} page`, async() => {
        const EC = protractor.ExpectedConditions;
        const chart = data.chart;
        const slider: Slider = new Slider();

        await chart.openChart();
        const initialSelectedYear = await slider.getPosition();
        await slider.dragToMiddle();
        const finalSelectedYear = await slider.getPosition();

        await expect(initialSelectedYear).not.toEqual(finalSelectedYear);
        await browser.wait(EC.urlContains(finalSelectedYear), 5000);

        await chart.refreshPage();

        const sliderAfterPageReload = await slider.getPosition();

        await expect(sliderAfterPageReload).not.toEqual(initialSelectedYear);
        await expect(sliderAfterPageReload).toEqual(finalSelectedYear);
        await expect(browser.getCurrentUrl()).toContain(sliderAfterPageReload);
      });
    });

    // TODO the issue is when to use "sidebar.find" and "sidebar.show". Don't know what to do with this yet
    // using(DATA_PROVIDER, (data, description) => {
    //   it(`Entities are selected after page reload on ${description} page`, async() => {
    //     const chart = data.chart;
    //     const sidebar: Sidebar = new Sidebar(chart);

    //     await chart.openChart();

    //     await sidebar.searchAndSelectCountry('Australia');
    //     await sidebar.searchAndSelectCountry('Bangladesh');

    //     expect(await chart.getSelectedCountriesNames()).toMatch('Australia');
    //     expect(await chart.getSelectedCountriesNames()).toMatch('Bangladesh');

    //     await chart.refreshPage();

    //     expect(await chart.getSelectedCountriesNames()).toMatch('Australia');
    //     expect(await chart.getSelectedCountriesNames()).toMatch('Bangladesh');
    //     await expect(browser.getCurrentUrl()).toContain('=aus');
    //     await expect(browser.getCurrentUrl()).toContain('=bgd');
    //   });
    // });
  });

  describe('Browser history', () => {
    let bubbleChart: BubbleChart;

    beforeEach(async() => {
      bubbleChart = new BubbleChart();
      await bubbleChart.openChart();
    });

    it('Back button works', async() => {
      const urlBefore = await browser.getCurrentUrl();

      await bubbleChart.clickOnCountryBubble('India');

      await browser.navigate().back();
      await waitForPageLoaded();

      expect(await browser.getCurrentUrl()).toEqual(urlBefore);
      expect(await bubbleChart.selectedCountries.count()).toEqual(0);
    });

    xit('Forward button works: https://github.com/Gapminder/ng2-tools-page/issues/154', async() => {
      await bubbleChart.clickOnCountryBubble('India');
      const urlAfter = await browser.getCurrentUrl();

      await browser.navigate().back();
      await waitForPageLoaded();

      await browser.sleep(1000); // no idea what to wait in this case

      await browser.navigate().forward();
      await waitForPageLoaded();

      expect(await browser.getCurrentUrl()).toEqual(urlAfter);
      expect(await bubbleChart.selectedCountries.count()).toEqual(1);
    });
  });

  describe('Switching between charts', () => {
    let bubbleChart: BubbleChart;
    let mapChart: MapChart;

    beforeEach(async() => {
      bubbleChart = new BubbleChart();
      mapChart = new MapChart();

      await bubbleChart.openChart();
    });

    it('Country remains selected', async() => {
      await bubbleChart.clickOnUnitedStates();
      const selectedCountriesOnBubbles = await bubbleChart.selectedCountries.getText();

      await mapChart.openByClick();
      await waitForPageLoaded();

      expect(await mapChart.selectedCountries.count()).toEqual(1);
      expect(selectedCountriesOnBubbles).toMatch(await mapChart.selectedCountries.first().getText());
    });
  });
});
