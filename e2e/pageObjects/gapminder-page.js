'use strict';

/**
 * Page object for the Gapminder page.
 * @constructor
 */

const EC = protractor.ExpectedConditions;

let GapminderPage = function () {
  this.gapminderOrgLogo = element(by.css('#logo'));
  this.footerImage = element(by.css('#footer-logo'));
  this.teachTopMenu = element.all(by.css('a[class="menu-item nav-toggle-expanded"]')).get(1);
  this.factsTopMenu = element.all(by.css('a[class="menu-item nav-toggle-expanded"]')).get(0);
  this.bubbleChartLinkInfactsTopMenu = element(by.css('a[href*="world"]'));
  this.massiveIgnoranceLinkInFactsTopMenu = element(by.css('a[href*="ignorance"]'));
  this.answersLinkInFactsTopMenu = element(by.css('a[href*="ignorance"]'));
  this.dataLinkInFactsTopMenu = element(by.css('a[href*="data"]'));
  this.aboutTopMenu = element.all(by.css('a[class="menu-item nav-toggle-expanded"]')).get(2);
  this.ourOrganisationLinkInAboutTopMenu = element(by.css('a[href*="about-gapminder"]'));
  this.newsLinkInAboutTopMenu = element(by.css('a[href*="news"]'));
  this.openLicenseLinkInAboutTopMenu = element(by.css('a[href*="free-material"]'));
  this.frequentlyAskedQuestionsLinkInAboutTopMenu = element(by.css('a[href*="faq_frequently_asked_questions"]'));
  this.teachersLinkInTeachTopMenu = element(by.css('a[href*="teachers"]'));
  this.workshopsLinkInTeachTopMenu = element(by.css('a[href*="workshops"]'));
  this.slideshowsLinkInTeachTopMenu = element(by.css('a[href*="presentations"]'));
  this.testQuestionsLinkInTeachTopMenu = element(by.css('a[href*="presentations"]'));
  this.forTeachersPageHeaderImage = element.all(by.css('img[class="logo"]')).first();
  this.headerImage = element(by.css('app-header > div > a'));
  this.buttonPlay = element(by.css('button.vzb-ts-btn-play.vzb-ts-btn > svg'));
  this.answersPageHeaderLogo = element(by.css('div[class*="navbar-header"] span[class*="gapminder-logo"]'));
  this.answersPageFooterLogo = element(by.css('div[class*="footer-top"] span[class*="gapminder-logo"]'));

  /**
   * Get page
   * @param url
   */
  this.get = function (url) {
    browser.driver.manage().window().maximize();
    browser.ignoreSynchronization = true;
    browser.get(url);
    browser.waitForAngular();
  };
  /**
   * Waits for Gapminder.org main page logos to be displayed
   */
  this.waitForGapminderOrgPageLogosDisplayed = function () {
    browser.wait(EC.visibilityOf(this.gapminderOrgLogo));
    browser.wait(EC.visibilityOf(this.footerImage));
  };

  /**
   * Waits for Gapminder.org/answers page logos to be displayed
   */
  this.waitForGapminderForTeachersPageLogosDisplayed = function () {
    browser.wait(EC.visibilityOf(this.answersPageHeaderLogo));
    browser.wait(EC.visibilityOf(this.answersPageFooterLogo));
  };


  /**
   * Waits for Gapminder.org/for-teachers page logos to be displayed
   */
  this.waitForGapminderForTeachersPageLogosDisplayed = function () {
    browser.wait(EC.visibilityOf(this.forTeachersPageHeaderImage));
    browser.wait(EC.visibilityOf(this.footerImage));
  };

  /**
   * Waits for Gapminder.org/for-teachers, workshops, test questions, slideshows, license pages logos to be displayed
   */
  this.waitForGapminderLogosForSeveralPagesDisplayed = function () {
    browser.wait(EC.visibilityOf(element.all(by.css('span[class="gapminder-logo "]')).first()));
    browser.wait(EC.visibilityOf(element.all(by.css('span[class="gapminder-logo "]')).get(2)));
  };

  /**
   * Waits for Gapminder.org logos to be displayed
   */
  this.waitForToolsPageLogosDisplayed = function () {
    browser.wait(EC.visibilityOf(this.headerImage));
    browser.wait(EC.visibilityOf(this.buttonPlay));
  };
};

module.exports = GapminderPage;
