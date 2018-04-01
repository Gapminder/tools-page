import { browser } from 'protractor';

import { _$, _$$ } from '../helpers/ExtendedElementFinder';
import { safeDragAndDrop } from '../helpers/helper';
import { CommonChartPage, BubbleChart } from '../pageObjects/charts';
import { Sidebar } from '../pageObjects/components';

const bubbleChart: BubbleChart = new BubbleChart();
const sidebar: Sidebar = new Sidebar();

describe('Sidebar: Select', () => {

  beforeEach(async () => {
    await bubbleChart.openChart();
  });

  if (browser.params.desktop) {
    it('Hover country in the country list highlight it', async () => {
      await sidebar.findSelect.hoverCountryFromList('Australia');

      expect(await bubbleChart.countBubblesByOpacity(CommonChartPage.opacity.highlighted)).toEqual(1);
      expect(await bubbleChart.bubbleLabelOnMouseHover.safeGetText()).toEqual('Australia');
    });
  }
});

describe('Sidebar: Advanced buttons', () => {

  beforeEach(async () => {
    await bubbleChart.openChart();
  });

  it('Change regular opacity', async () => {
    const allBubblesCount = await bubbleChart.allBubbles.count();

    await changeRegularOpacity();

    const newOpacity = await _$$('.vzb-bc-entity').first().safeGetCssValue('opacity');
    const newOpacityCount = await bubbleChart.countBubblesByOpacity(Number(newOpacity));

    await expect(allBubblesCount).toEqual(newOpacityCount);
  });

  it('Change opacity for non-selected', async () => {
    const allBubblesCount = await bubbleChart.allBubbles.count();

    await changeOpacityForNonSelected();

    await bubbleChart.clickOnCountryBubble('India'); // select bubble

    const newOpacity = await _$$('.vzb-bc-entity').first().safeGetCssValue('opacity');
    const newOpacityCount = await bubbleChart.countBubblesByOpacity(Number(newOpacity));

    await expect(newOpacityCount).toEqual(allBubblesCount - 1);
  });
});

async function changeRegularOpacity() {
  await sidebar.optionsButton.safeClick();
  await _$('[data-dlg="opacity"]').safeClick();
  await safeDragAndDrop(_$('.vzb-dialog-bubbleopacity-regular .handle--e'), { x: -100, y: 0 });
}

async function changeOpacityForNonSelected() {
  await sidebar.optionsButton.safeClick();
  await _$('[data-dlg="opacity"]').safeClick();
  await safeDragAndDrop(_$('.vzb-dialog-bubbleopacity-selectdim .handle--e'), { x: -20, y: 0 });
}