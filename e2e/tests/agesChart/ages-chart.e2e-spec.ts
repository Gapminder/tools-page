import { browser } from 'protractor';

import { AgesChart, CommonChartPage } from '../../pageObjects/charts';
import { safeOpen } from '../../helpers/helper';

const agesChart: AgesChart = new AgesChart();

describe('Ages chart', () => {

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
