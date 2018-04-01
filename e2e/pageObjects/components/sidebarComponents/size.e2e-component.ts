import { browser, ExpectedConditions as EC } from 'protractor';

import { _$, _$$, ExtendedElementFinder } from '../../../helpers/ExtendedElementFinder';
import { safeDragAndDrop, waitForSpinner } from '../../../helpers/helper';
import { TreeMenuModal } from './treeMenuModal.e2e-component';
import { DialogModal } from './dialogModal.e2e-component';

export class Size {
  private isDesktop: boolean = browser.params.desktop;
  private treeMenuModal: TreeMenuModal = new TreeMenuModal();
  private dialogModal: DialogModal = new DialogModal();

  sizeDropDown: ExtendedElementFinder = _$$('span[class="vzb-ip-select"]').get(1);
  sizeListBabiesPerWomanColorIndicator: ExtendedElementFinder = this.treeMenuModal.listItems.first();
  sizeLabel: ExtendedElementFinder = this.isDesktop ? this.sizeDropDown : _$('.vzb-bc-axis-s-title');
  resizeToddler: ExtendedElementFinder = _$$('.vzb-slider.vzb-slider-bubblesize .w').last();

  async moveSizeSlider(): Promise<void> {
    await safeDragAndDrop(this.resizeToddler, { x: 60, y: 0 });
    await browser.wait(EC.urlContains(`size_extent@`), 3000);
  }

  async changeSizeIndicator() {
    await this.dialogModal.sizeDropdown.safeClick();
    await this.treeMenuModal.listItems.first().safeClick();
    await waitForSpinner();
  }

  async getCurrentSizeIndicator() {
    let sizeIndicator: string;
    if (!this.isDesktop) {
      const indicatorTitle = await this.sizeLabel.getText();

      sizeIndicator = indicatorTitle
        .slice(indicatorTitle.lastIndexOf('Size: '), indicatorTitle.indexOf(', Color'))
        .replace('Size: ', '');
    }

    if (this.isDesktop) {
      sizeIndicator = await this.sizeDropDown.safeGetText();
  }

    return sizeIndicator;
  }
}
