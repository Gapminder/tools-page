import { browser } from 'protractor';
import { _$, ExtendedElementFinder } from '../../helpers/ExtendedElementFinder';
import { waitForPageLoaded, waitForSpinner, waitForUrlToChange } from '../../helpers/helper';
import { waitUntil } from '../../helpers/waitHelper';

export class Header {
  private isDesktop: boolean = browser.params.desktop;

  rootSelector: ExtendedElementFinder = this.isDesktop ? _$('.header') : _$('[class="mobile"]');
  /**
   * Social buttons
   */

  social: ExtendedElementFinder = this.isDesktop ? this.rootSelector._$('.social.desktop') : this.rootSelector._$('.social-list.mobile');
  mailButton: ExtendedElementFinder = this.social._$('.mail.button');
  mailLink: ExtendedElementFinder = this.social._$('app-social-buttons > a');
  twitterSocial: ExtendedElementFinder = this.social._$('.twitter.button');
  facebookSocial: ExtendedElementFinder = this.social._$('.facebook.button');
  icoplaneSocial: ExtendedElementFinder = this.social._$('.button.ico-plane');
  icocodeSocial: ExtendedElementFinder = this.social._$('.button.ico-code');
  shareLabel: ExtendedElementFinder = this.social._$('.share-text-box');
  howToButton: ExtendedElementFinder = this.rootSelector._$('#how-to-button');

  howToModal: ExtendedElementFinder = this.isDesktop ? this.rootSelector._$('.how-to-modal') : this.rootSelector._$('.how-to-content');
  chartSwitcherBtn: ExtendedElementFinder = this.rootSelector._$('.chart-switcher');

  /**
   * language switcher
   */
  menuBtn: ExtendedElementFinder = _$('.menu-icon');
  languageSwitcherBtn: ExtendedElementFinder = this.rootSelector._$('.lang-wrapper');
  currentLanguage: ExtendedElementFinder = this.rootSelector._$('.lang-current');
  englishLanguage: ExtendedElementFinder = this.rootSelector._$$('app-language-switcher .selected li').first();
  rtlLanguage: ExtendedElementFinder = this.rootSelector._$$('app-language-switcher .selected li').get(1);
  vimeoIframe: ExtendedElementFinder = this.howToModal._$$('iframe').first();

  async switchToChart(chartUrl: string): Promise<void> {
    await this.chartSwitcherBtn.safeClick();
    const currentUrl = await browser.getCurrentUrl();
    await _$(`.chart-switcher-options [href='/tools/${chartUrl}']`).safeClick();
    await waitForUrlToChange(currentUrl);
    await waitForPageLoaded();
  }

  changeLanguageToRtl(): Promise<void> {
    return this.changeLanguage(true);
  }

  changeLanguageToEng(): Promise<void> {
    return this.changeLanguage();
  }

  async changeLanguage(rtl?: boolean): Promise<void> {
    let language: ExtendedElementFinder;
    rtl ? language = this.rtlLanguage : language = this.englishLanguage;

    await this.openOnMobile();

    await this.languageSwitcherBtn.safeClick();
    const currentUrl = await browser.getCurrentUrl();
    await language.safeClick();
    await waitForUrlToChange(currentUrl);
    await waitForSpinner();
    await this.closeOnMobile();
  }

  async openHowToUsePopup(): Promise<void> {
    await this.openOnMobile();

    await this.howToButton.safeClick();
    await waitUntil(this.howToModal);
  }

  async refreshMailLink(): Promise<string> {
    await this.openOnMobile();

    await this.shareLabel.safeClick();
    await waitUntil(this.mailButton);

    const mailLink = decodeURIComponent(await this.mailLink.getAttribute('href'));
    await this.closeOnMobile();

    return mailLink;
  }

  async clickOnTwitterIcon() {
    await this.openOnMobile();
    await this.twitterSocial.safeClick();
    await this.closeOnMobile();
  }

  async clickOnFacebookIcon() {
    await this.openOnMobile();
    await this.facebookSocial.safeClick();
    await this.closeOnMobile();
  }

  async openOnMobile(): Promise<void> {
    if(!this.isDesktop){
      await this.menuBtn.safeClick();
    }
  }

  async closeOnMobile(): Promise<void> {
    if(!this.isDesktop){
      await this.menuBtn.safeClick();
    }
  }
}
