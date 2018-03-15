import { $, browser, ElementFinder, ExpectedConditions as EC } from 'protractor';

import { CommonChartPage } from '../charts/common-chart.po';
import { _$, ExtendedElementFinder } from '../../helpers/ExtendedElementFinder';
import { safeDragAndDrop } from '../../helpers/helper';

export class Slider {
  public sliderSelectedYear: ExtendedElementFinder = _$('.vzb-ts-slider-value');
  public sliderButton: ElementFinder = $('.vzb-ts-slider-handle');
  public sliderReady: ElementFinder = $('.domain.rounded'); // TODO remove this because there is static property
  public sliderAxis: ElementFinder = $('.vzb-ts-slider');
  public speedStepper: ExtendedElementFinder = _$('.vzb-tool-stepped-speed-slider');

  async waitForSliderToBeReady(): Promise<{}> {
    return await browser.wait(EC.visibilityOf(this.sliderReady), 30000, 'slider not visible');
  }

  async getPosition(): Promise<string> {
    await this.waitForSliderToBeReady();

    return this.sliderSelectedYear.getAttribute('textContent');
  }

  async dragToMiddle(): Promise<{}> {
    await this.waitForSliderToBeReady();
    
    const windowSize = await browser.driver.manage().window().getSize();
    let distance: number;
    windowSize.width > 900 ? distance = -900 : distance = -300;
    await safeDragAndDrop(this.sliderButton, {x: distance, y: 0});

    return await browser.wait(EC.urlContains('#_state_time_value='), 10000, 'drag slider to middle');
  }

  async dragToStart(): Promise<{}> {
    await this.waitForSliderToBeReady();
    await safeDragAndDrop(this.sliderButton, CommonChartPage.buttonPlay);

    return await browser.wait(EC.urlContains('#_state_time_value='), 10000, 'drag slider to start');
  }

  async dragToRightEdge(): Promise<{}> {
    await this.waitForSliderToBeReady();
    await safeDragAndDrop(this.sliderButton, this.speedStepper);

    return await browser.wait(EC.not(EC.urlContains('#_state_time_value=')), 10000, 'drag slider to right');
  }

  async playTimesliderSeconds(seconds: number): Promise<void> {
    await this.waitForSliderToBeReady();
    await CommonChartPage.buttonPlay.safeClick();
    await browser.sleep(seconds * 1000);
    await CommonChartPage.buttonPause.safeClick();
  }

  async playSlider() {
    await this.waitForSliderToBeReady();
    await CommonChartPage.buttonPlay.safeClick();
  }

}
