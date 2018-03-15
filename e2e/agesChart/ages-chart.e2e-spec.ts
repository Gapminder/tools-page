import { browser, protractor } from 'protractor';

import { safeDragAndDrop, safeExpectIsDispayed, safeOpen, waitForSpinner } from '../helpers/helper';
import { Sidebar } from '../pageObjects/sidebar/sidebar.e2e-component';
import { CommonChartPage } from '../pageObjects/charts/common-chart.po';
import { Slider } from '../pageObjects/components/slider.e2e-component';
import { AgesChart } from '../pageObjects/charts/ages-chart.po';

const commonChartPage: CommonChartPage = new CommonChartPage();
const agesChart: AgesChart = new AgesChart();
const slider: Slider = new Slider();

describe('Ages chart', () => {
  const sidebar: Sidebar = new Sidebar(agesChart);

  beforeEach(async() => {
    await agesChart.openChart();
  });

  it(`Open chart by click on link`, async() => {
    await safeOpen('');
    await agesChart.openByClick();

    const URL = await browser.getCurrentUrl();
    const pattern = new RegExp(agesChart.url, 'g');

    await expect(URL.match(pattern).length).toEqual(1);
  });

  it(`Data shown by hover on bar`, async() => {
    await agesChart.bars.first().hover();

    expect(await agesChart.labelOnBar.safeGetText()).toEqual('0-year-olds World: 136M');
  });

  it(`select specific bar on chart (by click on bar)`, async() => {
    const allBars = await agesChart.bars.count();
    const barToSelect = await agesChart.bars.get(15);

    await barToSelect.safeClick();

    expect(Number(await barToSelect.getCssValue('opacity'))).toEqual(CommonChartPage.opacity.highlighted);
    expect(await agesChart.countHighlightedBars()).toEqual(1);
    expect(await agesChart.countDimmedBars()).toEqual(allBars - 1);
  });

});
