import { browser, by, element, ElementFinder } from 'protractor';
import { _$, _$$, ExtendedElementFinder } from '../../../helpers/ExtendedElementFinder';
import { waitForSpinner, waitForUrlToChange } from '../../../helpers/helper';
import { waitUntil } from '../../../helpers/waitHelper';
import { TreeMenuModal } from './treeMenuModal.e2e-component';

export class Color {
  private isDesktop = browser.params.desktop;

  treeMenuModal: TreeMenuModal = new TreeMenuModal();
  colorBtn: ExtendedElementFinder = _$$('[data-btn="colors"]').last();
  colorDropDownBtn: ExtendedElementFinder = _$$('span[class="vzb-ip-select"]').first();
  colorLabel: ExtendedElementFinder = this.isDesktop ? this.colorDropDownBtn : _$('.vzb-bc-axis-s-title');
  color = {
    childMortalityRate: this.treeMenuModal.listItems.get(3), // TODO add test class to vizabi
    incomePerPerson: this.treeMenuModal.listItems.get(4), // TODO add test class to vizabi
    mainReligion: element(by.cssContainingText('.vzb-treemenu-list-item-label', 'Main religion')),
    firstColor: _$$('.vzb-cl-color-sample').first()
  };
  minimapAsiaRegion = _$$('.vzb-cl-minimap').$$('path').first();
  minimapDropdown: ExtendedElementFinder = _$('[class=vzb-cl-select-dialog]'); // will find any active(mobile or desktop)

  async selectInColorDropdown(element: ExtendedElementFinder | ElementFinder): Promise<void> {
    if (!this.isDesktop) {
      await this.colorBtn.safeClick();
    }

    await this.colorDropDownBtn.safeClick();

    if (element instanceof ExtendedElementFinder) {
      await element.safeClick();
    } else {
      await new ExtendedElementFinder(element).safeClick();
    }

    await waitForSpinner();

    await this.closeOnMobile();
  }

  async getColorFromColorSection(): Promise<string> {
    if (!this.isDesktop) {
      await this.colorBtn.safeClick();
    }

    const style = await this.color.firstColor.safeGetAttribute('style');

    const color = style.slice(style.indexOf('background-color: '), style.indexOf(';'))
      .replace('background-color: ', '');

    await this.closeOnMobile();

    return color;
  }


  async hoverMinimapRegion(region: string): Promise<void> {
    if (!this.isDesktop) {
      await this.colorBtn.safeClick();
      await waitUntil(this.minimapAsiaRegion);
    }

    await browser.actions().mouseMove(this.minimapAsiaRegion, { x: 20, y: 10 }).perform();

    await this.closeOnMobile();
  }


  async clickMinimapRegion(region?: string): Promise<void> {
    if (!this.isDesktop) {
      await this.colorBtn.safeClick();
      await waitUntil(this.minimapAsiaRegion);
    }

    await browser.actions().mouseMove(this.minimapAsiaRegion, { x: 20, y: 10 }).perform();
    await browser.actions().click().perform();
  }

  async removeEverythingElseInMinimap() {
    await this.clickMinimapRegion();
    await this.minimapDropdown._$$('.vzb-cl-select-dialog-item').get(1).safeClick();
    await waitForSpinner();

    await this.closeOnMobile();
  }

  async selectAllInThisGroup() {
    await this.clickMinimapRegion();
    await this.minimapDropdown._$$('.vzb-cl-select-dialog-item').get(0).safeClick();
    await waitForSpinner();

    await this.closeOnMobile();
  }

  async changeColor(index?: number) {
    if (!this.isDesktop) {
      await this.colorBtn.safeClick();
    }

    await this.colorDropDownBtn.safeClick();
    await this.treeMenuModal.listItems.get(index || 3).safeClick();
    await waitForUrlToChange();
    await waitForSpinner();

    await this.closeOnMobile();
  }

  async searchAndSelectInColorDropdown(colorOption: string) {
    if (!this.isDesktop) {
      await this.colorBtn.safeClick();
    }

    await this.colorDropDownBtn.safeClick();
    const option = await this.treeMenuModal.searchForItem(colorOption);
    await option.safeClick();
    await waitForSpinner();

    await this.closeOnMobile();
  }

  async closeOnMobile(): Promise<void> {
    if (!this.isDesktop) {
      await this.colorBtn.safeClick();
    }

  }
}
