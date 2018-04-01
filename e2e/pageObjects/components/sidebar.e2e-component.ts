import { $, $$, browser, ElementArrayFinder, ElementFinder, ExpectedConditions as EC } from 'protractor';

import { safeDragAndDrop } from '../../helpers/helper';
import { _$, _$$, ExtendedElementFinder } from '../../helpers/ExtendedElementFinder';
import { Color, DialogModal, Find, Show, Size, TreeMenuModal } from './sidebarComponents';

export class Sidebar {
  /**
   * Note that sidebar could include specific elements in different charts
   * The elements could be added in constructor
   */
  private params = browser.params;
  private isDesktop = this.params.desktop;

  /**
   *  Common elements
   *  change it carefully becaues it can affect all charts
   */
  rootElement: ElementFinder = $('.vzb-tool-sidebar');
  sidebar = {
    colorsSection: $('[data-dlg="colors"]'),
    miniMap: $('.vzb-cl-minimap'),
    searchSection: $('.vzb-find-filter'),
    countriesList: $('.vzb-find-list'),
    advancedButtons: $('.vzb-tool-buttonlist'),
    switcherSHOW_SELECT: $('.vzb-dialog-title-switch')
  };

  yearAtTop: ExtendedElementFinder = _$('.vzb-timedisplay');

  colorSection: Color;
  findSelect: Find;
  size: Size;
  show: Show;
  dialogModal: DialogModal;
  treeMenuModal: TreeMenuModal;

  /**
   * Options
   */
  optionsButton: ExtendedElementFinder = _$$('[data-btn="moreoptions"]').last();
  optionsMenuSizeButton: ExtendedElementFinder = _$$('span[data-vzb-translate="buttons/size"]').last();
  optionsMenuHandIcon: ElementFinder = $('.thumb-tack-class-ico-drag[data-dialogtype="moreoptions"]');
  optionsModalDialogue: ElementArrayFinder = $$('div[data-dlg="moreoptions"]');

  activeOptionsMenu: ExtendedElementFinder = _$('.vzb-accordion-active');
  opacityMenu: ExtendedElementFinder = _$('[data-dlg="opacity"]');
  labelsMenu: ExtendedElementFinder = _$('[data-dlg="label"]');

  /**
   * Zoom
   */
  zoomButton: ExtendedElementFinder = this.isDesktop ? _$$('[data-btn="plus"]').first() : _$('.vzb-tool-buttonlist [data-btn="zoom"]');

  constructor() {
    this.colorSection = new Color();
    this.findSelect = new Find();
    this.size = new Size();
    this.show = new Show();
    this.dialogModal = new DialogModal();
    this.treeMenuModal = new TreeMenuModal();
  }

  async waitForVisible(): Promise<void> {
    await browser.wait(EC.visibilityOf(this.rootElement), 10000, `element ${this.rootElement.locator()} not visible`);
  }

  async changeOpacityForNonSelected(): Promise<void> {
    const nonSelectedSlider: ExtendedElementFinder = this.opacityMenu._$$('.vzb-dialog-bubbleopacity-selectdim .handle--e').first();
    await this.changeOpacity(nonSelectedSlider);
  }

  async changeRegularOpacity(): Promise<void> {
    const regularOpacitySlider: ExtendedElementFinder = this.opacityMenu._$$('.vzb-dialog-bubbleopacity-regular .handle--e').first();
    await this.changeOpacity(regularOpacitySlider);
  }

  async changeOpacity(sliderType: ExtendedElementFinder): Promise<void> {
    await this.optionsButton.safeClick();
    await this.opacityMenu.safeClick();
    await safeDragAndDrop(sliderType, { x: -50, y: 0 });
  }

  async moveGroupSlider() {
    await this.optionsButton.safeClick();
    await this.dialogModal.group.safeClick();
    await this.dialogModal.moveGroupSlider();
  }
}
