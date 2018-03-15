'use strict';

const GapminderPage = require('./pages/gapminder-page');

let page;
let url = 'https://gapminder.org/';

beforeEach(() => {
  page = new GapminderPage();
});

describe('checking redirecting', () => {
  it('should open https://www.gapminder.org', (done) => {
    page.get('https://www.gapminder.org');
    page.waitForGapminderOrgPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/');
    done();
  });

  it('should redirect https://www.gapminder.org/ to https://www.gapminder.org', (done) => {
    page.get('https://www.gapminder.org/');
    page.waitForGapminderOrgPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/');
    done();
  });

  it('should redirect http://www.gapminder.org to https://www.gapminder.org', (done) => {
    page.get('http://www.gapminder.org');
    page.waitForGapminderOrgPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/');
    done();
  });
  it('should redirect http://www.gapminder.org/ to https://www.gapminder.org', (done) => {
    page.get('http://www.gapminder.org/');
    page.waitForGapminderOrgPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/');
    done();
  });
  it('should redirect https://gapminder.org to https://www.gapminder.org', (done) => {
    page.get('https://gapminder.org');
    page.waitForGapminderOrgPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/');
    done();
  });
  it('should redirect http://gapminder.org to https://www.gapminder.org', (done) => {
    page.get('http://gapminder.org');
    page.waitForGapminderOrgPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/');
    done();
  });
  it('should redirect http://gapminder.org to https://www.gapminder.org', (done) => {
    page.get('http://gapminder.org');
    page.waitForGapminderOrgPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/');
    done();
  });

  it('should redirect https://www.gapminder.org/tools to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('https://www.gapminder.org/tools');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect http://www.gapminder.org/tools to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('http://www.gapminder.org/tools');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect https://gapminder.org/tools to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('https://gapminder.org/tools');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect http://gapminder.org/tools to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('http://gapminder.org/tools');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect https://www.gapminder.org/tools/ to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('https://www.gapminder.org/tools/');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect http://www.gapminder.org/tools/ to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('http://www.gapminder.org/tools/');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect https://gapminder.org/tools/ to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('https://gapminder.org/tools/');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect http://gapminder.org/tools/ to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('http://gapminder.org/tools/');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect https://www.gapminder.org/tools/bubbles to https://www.gapminder.org/tools/#_chart-type=bubbles',
    (done) => {
      page.get('https://www.gapminder.org/tools/bubbles');
      page.waitForToolsPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
      done();
    });
  it('should redirect http://www.gapminder.org/tools/bubbles to https://www.gapminder.org/tools/#_chart-type=bubbles',
    (done) => {
      page.get('http://www.gapminder.org/tools/bubbles');
      page.waitForToolsPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
      done();
    });
  it('should redirect https://gapminder.org/tools/bubbles to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('https://gapminder.org/tools/bubbles');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect http://gapminder.org/tools/bubbles to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('http://gapminder.org/tools/bubbles');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect https://www.gapminder.org/tools/bubbles/ to https://www.gapminder.org/tools/#_chart-type=bubbles',
    (done) => {
      page.get('https://www.gapminder.org/tools/bubbles/');
      page.waitForToolsPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
      done();
    });
  it('should redirect http://www.gapminder.org/tools/bubbles/ to https://www.gapminder.org/tools/#_chart-type=bubbles',
    (done) => {
      page.get('http://www.gapminder.org/tools/bubbles/');
      page.waitForToolsPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
      done();
    });
  it('should redirect https://gapminder.org/tools/bubbles/ to https://www.gapminder.org/tools/#_chart-type=bubbles',
    (done) => {
      page.get('https://gapminder.org/tools/bubbles/');
      page.waitForToolsPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
      done();
    });
  it('should redirect http://gapminder.org/tools/bubbles/ to https://www.gapminder.org/tools/#_chart-type=bubbles', (done) => {
    page.get('http://gapminder.org/tools/bubbles/');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect https://www.gapminder.org/tools/#_chart-type=bubbles to https://www.gapminder.org/tools/' +
    '#_chart-type=bubbles', (done) => {
    page.get('https://www.gapminder.org/tools/#_chart-type=bubbles');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect http://www.gapminder.org/tools/#_chart-type=bubbles to https://www.gapminder.org/tools/' +
    '#_chart-type=bubbles', (done) => {
    page.get('http://www.gapminder.org/tools/#_chart-type=bubbles');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect https://gapminder.org/tools/#_chart-type=bubbles to https://www.gapminder.org/tools/' +
    '#_chart-type=bubbles', (done) => {
    page.get('https://gapminder.org/tools/#_chart-type=bubbles');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  it('should redirect http://gapminder.org/tools/#_chart-type=bubbles to https://www.gapminder.org/tools/' +
    '#_chart-type=bubbles', (done) => {
    page.get('http://gapminder.org/tools/#_chart-type=bubbles');
    page.waitForToolsPageLogosDisplayed();
    expect(browser.getCurrentUrl()).toContain('chart-type=bubbles');
    done();
  });
  describe('checking Teach menu items', () => {
    it('should open for-teachers page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.teachTopMenu.click();
      page.teachersLinkInTeachTopMenu.click();
      page.waitForGapminderForTeachersPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/for-teachers/');
      done();
    });
    it('should open workshops page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.teachTopMenu.click();
      page.workshopsLinkInTeachTopMenu.click();
      page.waitForGapminderLogosForSeveralPagesDisplayed();
      expect(browser.getCurrentUrl()).toEqual('http://www.gapminder.org/workshops/');
      done();
    });
    it('should open slideshows page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.teachTopMenu.click();
      page.slideshowsLinkInTeachTopMenu.click();
      page.waitForGapminderLogosForSeveralPagesDisplayed();
      expect(browser.getCurrentUrl()).toEqual('http://www.gapminder.org/slideshows/');
      done();
    });
    it('should open test questions page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.teachTopMenu.click();
      page.testQuestionsLinkInTeachTopMenu.click();
      page.waitForGapminderLogosForSeveralPagesDisplayed();
      expect(browser.getCurrentUrl()).toEqual('http://www.gapminder.org/test-questions/');
      done();
    });
  });
  describe('checking page.factsTopMenu menu items', () => {
    it('should open bubble-chart page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.factsTopMenu.click();
      page.bubbleChartLinkInfactsTopMenu.click();
      page.waitForGapminderForTeachersPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toContain('http://www.gapminder.org/world/');
      done();
    });
    it('should open massive ignorance page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.factsTopMenu.click();
      page.massiveIgnoranceLinkInFactsTopMenu.click();
      page.waitForGapminderForTeachersPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/ignorance/');
      done();
    });
    it('should open answers page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.factsTopMenu.click();
      page.answersLinkInFactsTopMenu.click();
      page.waitForGapminderForTeachersPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toEqual('http://www.gapminder.org/answers/');
      done();
    });
    it('should open data page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.factsTopMenu.click();
      page.dataLinkInFactsTopMenu.click();
      page.waitForGapminderForTeachersPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/data/');
      done();
    })
  });
  describe('checking page.aboutTopMenu menu items', () => {
    it('should open our organization page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.aboutTopMenu.click();
      page.ourOrganisationLinkInAboutTopMenu.click();
      page.waitForGapminderForTeachersPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toContain('https://www.gapminder.org/page.aboutTopMenu-gapminder/');
      done();
    });
    it('should open faq page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.aboutTopMenu.click();
      page.frequentlyAskedQuestionsLinkInAboutTopMenu.click();
      page.waitForGapminderForTeachersPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/faq_frequently_asked_questions/');
      done();
    });
    it('should open news page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.aboutTopMenu.click();
      page.newsLinkInAboutTopMenu.click();
      page.waitForGapminderForTeachersPageLogosDisplayed();
      expect(browser.getCurrentUrl()).toEqual('https://www.gapminder.org/news/');
      done();
    });
    it('should open open license page', (done) => {
      page.get(url + '/tools/');
      page.waitForToolsPageLogosDisplayed();
      page.aboutTopMenu.click();
      page.openLicenseLinkInAboutTopMenu.click();
      page.waitForGapminderLogosForSeveralPagesDisplayed();
      expect(browser.getCurrentUrl()).toEqual('http://www.gapminder.org/free-material/');
      done();
    })
  });

});
