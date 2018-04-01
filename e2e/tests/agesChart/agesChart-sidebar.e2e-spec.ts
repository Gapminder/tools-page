import { AgesChart } from '../../pageObjects/charts';
import { Sidebar } from '../../pageObjects/components';
import { waitForSliderToBeReady, waitForSpinner } from '../../helpers/helper';

const agesChart: AgesChart = new AgesChart();

describe('Ages chart: Sidebar', () => {
  const sidebar: Sidebar = new Sidebar();

  beforeEach(async () => {
    await agesChart.openChart();
  });

  it(`add region to chart from sidebar by click`, async () => {
    await sidebar.show.clickOnCountryFromList('Africa');

    expect(await agesChart.graphTitles.safeGetText()).toMatch('Africa');
    expect(await agesChart.graphsOnChart.count()).toEqual(2);
  });

  it(`"Group" slider on sidebar increases group range`, async () => {
    const allBarsBefore = await agesChart.bars.count();
    await sidebar.moveGroupSlider();
    await waitForSpinner();
    await waitForSliderToBeReady();
    const allBarsAfter = await agesChart.bars.count();

    await expect(allBarsBefore).toBeGreaterThan(allBarsAfter);
  });
});
