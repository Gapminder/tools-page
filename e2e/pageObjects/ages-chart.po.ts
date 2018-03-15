import { $, $$, browser, ElementArrayFinder, ElementFinder, ExpectedConditions as EC } from 'protractor';

import { CommonChartPage } from './common-chart.po';
import { _$, _$$, ExtendedArrayFinder, ExtendedElementFinder } from '../helpers/ExtendedElementFinder';
import { ActionSequence, promise } from 'selenium-webdriver';
import { safeDragAndDrop } from '../helpers/helper';

export class AgesChart extends CommonChartPage {
  url = 'chart-type=popbyage';
  chartLink: ExtendedElementFinder = _$('.about a[href*="popbyage"]');

  searchInputField: ExtendedElementFinder = _$('.vzb-show-search');
  searchResult: ExtendedArrayFinder = _$$('div[class="vzb-show-item vzb-dialog-checkbox"] label'); // TODO the same selector as in LineChart
  bars: ExtendedArrayFinder = _$$('.vzb-bc-stack');
  labelOnBar: ExtendedElementFinder = _$('.vzb-bc-label.vzb-hovered');
  graphTitles: ExtendedArrayFinder = _$$('.vzb-bc-title.vzb-bc-title-center');
  graphsOnChart: ExtendedArrayFinder = _$$('.vzb-bc-graph');

  public sidebar = {
    timeDisplay: $('.vzb-timedisplay'),
    resetFiltersBtn: $('.vzb-show-deselect'),
    groupSection: $$('[data-dlg="grouping"]').get(1)
  };

  groupSliderHangle: ElementFinder = $$('.vzb-slider-thumb-badge').last();
  secondGroup: ElementFinder = this.sidebar.groupSection.$$('.vzb-dialog-groups [class=".vzb-dialog-groups-title"]').get(2);

  countHighlightedBars(): promise.Promise<number> {
    return this.countBarsByOpacity(CommonChartPage.opacity.highlighted);
  }

  countDimmedBars(): promise.Promise<number> {
    return this.countBarsByOpacity(CommonChartPage.opacity.dimmed);
  }

  countBarsByOpacity(opacity: number): promise.Promise<number> {
    return $$(`.vzb-bc-stack[style*="opacity: ${opacity};"]`).count();
  }

  moveGroupSlider() {
    return safeDragAndDrop(this.groupSliderHangle, this.secondGroup);
  }
}
