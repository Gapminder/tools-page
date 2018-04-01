import { browser } from 'protractor';

import { Slider } from '../pageObjects/components';
import { safeOpen } from '../helpers/helper';

describe('Slider', () => {
  const slider: Slider = new Slider();

  beforeEach(async() => {
    await safeOpen('');
  });

  it('Change speed during playing not reset slider', async() => {
    await slider.dragToStart();
    await slider.playSlider();

    await slider.speedStepper.safeClick();

    const timeStamp = Number(await slider.getPosition());
    await browser.wait(() => slider.getPosition().then(res => Number(res) > timeStamp), 5000);

    expect(Number(await slider.getPosition())).toBeLessThan(2015);
  });
});
