'use strict';

/**
 * Page object for the Tools page.
 * @constructor
 */

const EC = protractor.ExpectedConditions;
const url = browser.baseUrl;

let ToolsPage = function () {
  /**
   * General elements
   */
  this.mountainsChart = element(by.css('a[href*="mountain"]'));
  this.mapsChart = element(by.css('a[href*="map"]'));
  this.rankingsChart = element(by.css('a[href*="barrank"]'));
  this.linesChart = element(by.css('a[href*="linechart"]'));
  this.headerImage = element(by.css('app-header > div > a'));
  this.buttonPlay = element(by.css('button.vzb-ts-btn-play.vzb-ts-btn > svg'));
  this.buttonPause = element(by.css('button.vzb-ts-btn-pause.vzb-ts-btn > svg'));
  this.rightSidePanel = element.all(by.css('.vzb-tool-sidebar > div > div > div>  div[class*="vzb-dialog-title"]'));
  this.advancedControlsRightSidePanelExpandButton = element.all(by.css('[data-btn="fullscreen"]')).last();
  this.advancedControlsRightSidePanelShowButton = element.all(by.css('[data-btn="show"]')).last();
  this.advancedControlsRightSidePanelOptionsButton = element.all(by.css('[data-btn="moreoptions"]')).last();
  this.advancedControlsRightSidePanelPresentButton = element.all(by.css('[data-btn="presentation"]')).last();
  this.sliderButton = element(by.css('.vzb-ts-slider-handle'));
  this.sliderSelectedYear = element(by.css('.vzb-ts-slider-value'));
  this.rightSidePanelCountriesList = element.all(by.css('.vzb-find-list > div'));
  this.rightSidePanelSearchInputField = element(by.css('.vzb-find-search'));
  this.rightSidePanelSearchResult = element.all(by.css('div[class="vzb-find-item vzb-dialog-checkbox"] > label')).first();
  this.movingSliderProgress = element.all(by.css('g[class="vzb-ts-slider-progress"] > path'));
  this.rightSidePanelColorDropDown = element.all(by.css('span[class="vzb-ip-select"]')).first();
  this.rightSidePanelSizeDropDown = element.all(by.css('span[class="vzb-ip-select"]')).get(1);
  this.axisXLineNumbers = element.all(by.css('g[class="tick"]'));
  this.pageLoader = element.all(by.css('div[class="vzb-placeholder vzb-loading-data"]'));
  this.pageLoader2 = element.all(by.css('div[class="vzb-placeholder"]'));
  this.dataDoubtsLink = element(by.css('g[class="vzb-data-warning vzb-noexport"]'));
  this.dataDoubtsWindow = element(by.css('div[class="vzb-data-warning-body vzb-dialog-scrollable"]'));
  this.pageHeader = element(by.css('div[class="header"]'));
  this.rightSidePanelOptionsButton = element.all(by.css('span[data-vzb-translate="buttons/more_options"]')).last();
  this.rightSidePanelOptionsMenuSizeButton = element.all(by.css('span[data-vzb-translate="buttons/size"]')).last();
  this.rightSidePanelOptionsMenuBubblesResizeButton = element.all(by.css('svg[class="handle handle--w w vzb-slider-thumb"] > g[class="vzb-slider-thumb-badge"] > path')).last();
  this.rightSidePanelColorIndicatorDropdown = element.all(by.css('span[class="vzb-ip-holder"] > span')).get(8);
  this.sizeListBabiesPerWomanColorIndicator = element.all(by.css('span[class="vzb-treemenu-list-item-label"]')).first();
  this.sizeListChildMortalityRateColorIndicator = element.all(by.css('span[class="vzb-treemenu-list-item-label"]')).get(3);
  this.sizeListIncomePerPersonColorIndicator = element.all(by.css('span[class="vzb-treemenu-list-item-label"]')).get(4);
  this.sizeListLifeExpectancyColorIndicator = element.all(by.css('span[class="vzb-treemenu-list-item-label"]')).get(5);
  this.rightSidePanelColorIndicatorDescription = element.all(by.css('span[class="vzb-cl-unit-text"]')).first();
  this.rightSidePanelOptionsMenuHandIcon = element.all(by.css('div[data-dlg="moreoptions"] > div > span > svg > path')).get(1);
  this.rightSidePanelOptionsModalDialogue = element(by.css('div[data-dlg="moreoptions"]'));
  this.axisYTitle = element(by.css('g[class="vzb-bc-axis-y-title"]'));
  this.axisYSearchFieldInputField = element(by.css('input[class="vzb-treemenu-search"]'));
  this.axisYFirstSearchResult = element.all(by.css('span[class="vzb-treemenu-list-item-label"] > span')).first();
  this.rightSidePanelZoomButton = element.all(by.css('div[class="vzb-dialog-zoom-buttonlist"] > button[class="vzb-buttonlist-btn"] > span > svg > path')).first();
  this.axisYMaxValue = element.all(by.css('svg[class="vzb-bc-axis-y"] > g > g[class="tick"] > text')).last();
  this.axisXMaxValue = element.all(by.css('svg[class="vzb-bc-axis-x"] > g > g[class="tick"] > text')).last();
  this.showMenuSelectedCountry = element.all(by.css('div[class="vzb-show-list"] > div > label')).first();
  this.searchMenuSelectedCountry = element.all(by.css('div[class*="vzb-find-item vzb-dialog-checkbox vzb-checked"] > label')).first();

  /**
   * Maps chart elements
   */
  this.mapsChartSelectedCountries = element.all(by.css('circle[class="vzb-bmc-bubble vzb-selected"]'));
  this.mapsChartSelectedCountriesLabels = element.all(by.css('text[class="vzb-bmc-label-content stroke"]'));
  this.mapsChartSelectedCountryLabel = element(by.css('g[class="vzb-bmc-labels"] > g'));
  this.mapsChartAllBubbles = element.all(by.css('circle[class="vzb-bmc-bubble"]'));
  this.mapsChartBubbleLabelOnMouseHover = element(by.css('g[class="vzb-bmc-tooltip"] > text'));
  this.mapsChartSelectedCountryCrossMark = element(by.css('g[class="vzb-bmc-label-x"]'));
  this.mapsChartYAxisTitle = element(by.css('g[class="vzb-bmc-axis-y-title"] > text'));

  /**
   * Mountains chart elements
   */
  this.mountainsChartLeftSidePanelSelectedCountries = element.all(by.css('text[class="vzb-mc-label-text"]'));
  this.mountainsChartVisualizationSelectedCountries = element.all(by.css('path[class="vzb-mc-mountain vzb-mc-aggrlevel0 vzb-selected"]'));
  this.mountainsChartVisualizationAllCountries = element.all(by.css('path[class="vzb-mc-mountain vzb-mc-aggrlevel0"]'));
  this.mountainsChartVisualizationWorldPopulation = element(by.css('text[class="vzb-mc-probe-value-dl"]'));
  this.mountainsChartExtremePovertyPercentage = element(by.css('text[class="vzb-shadow vzb-mc-probe-value-ul"]'));
  this.mountainsChartExtremePovertyTitle = element(by.css('text[class="vzb-mc-probe-extremepoverty"]'));
  this.mountainsChartAdvancedControlsShowButtons = element.all(by.css('div[class="vzb-tool-buttonlist"] > ' +
    'button[class="vzb-buttonlist-btn"] > span[class="vzb-buttonlist-btn-icon fa"]'));
  this.mountainsChartShowButtonSearchInputField = element(by.css('input[class="vzb-show-search"]'));
  this.mountainsChartYearLabel = element(by.css('g[class="vzb-mc-year vzb-dynamic-background"]'));

  /**
   * Rankings chart elements
   */
  this.rankingsChartRightSidePanelYearLabel = element(by.css('div.vzb-dialog-content.vzb-dialog-content-fixed > svg > g > text'));
  this.rankingsChartSelectedCountries = element.all(by.css('g[class="vzb-br-bar vzb-selected"]'));

  /**
   * Lines chart elements
   */
  this.linesChartShowAllButton = element(by.css('.vzb-dialog-buttons > div[class*="vzb-dialog-button vzb-show-deselect"] > span'));
  this.linesChartRightSidePanelCountriesList = element.all(by.css('.vzb-show-list > div'));
  this.linesChartRightSidePanelSearchInputField = element(by.css('.vzb-show-search'));
  this.linesChartSearchResult = element.all(by.css('div[class="vzb-show-item vzb-dialog-checkbox"] > label')).first();
  this.linesChartDataDoubtsLabel = element.all(by.css('g[class="vzb-data-warning vzb-noexport"]'));
  this.linesChartSelectedCountries = element.all(by.css('.vzb-lc-label'));
  this.advancedControlsRightSidePanelFindButton = element.all(by.css('[data-btn="find"]')).last();

  /**
   * Bubbles chart elements
   */
  this.bubblesChartSelectedCountries = element.all(by.css('text[class="vzb-bc-label-content stroke"]'));
  this.bubblesChartCountriesList = {
    Nigeria: element(by.css('circle[class*="vzb-bc-entity bubble-nga"]')),
    India: element(by.css('circle[class*="vzb-bc-entity bubble-ind"]')),
    USA: element(by.css('circle[class*="vzb-bc-entity bubble-usa"]')),
    Russia: element(by.css('circle[class*="vzb-bc-entity bubble-rus"]')),
    China: element(by.css('circle[class*="vzb-bc-entity bubble-chn"]')),
    Bangladesh: element(by.css('circle[class*="vzb-bc-entity bubble-bgd"]')),
  };
  this.bubblesChartAllBubbles = element.all(by.css('g[class="vzb-bc-bubbles"] > circle'));
  this.bubblesChartBubbleLabelOnMouseHover = element(by.css('g[class="vzb-bc-tooltip"] > text'));
  this.bubblesChartAxisXValue = element.all(by.css('g[class="vzb-axis-value"] > text')).first();
  this.bubblesChartUnitedStatesBubble = element(by.css('circle[class*="vzb-bc-entity bubble-usa"]'));
  this.bubblesChartIndiaBubble = element(by.css('circle[class*="vzb-bc-entity bubble-ind"]'));
  this.bubblesChartChinaBubble = element(by.css('circle[class*="vzb-bc-entity bubble-chn"]'));
  this.bubblesChartSelectedCountryLabel = element(by.css('rect[class="vzb-label-fill vzb-tooltip-border"]'));
  this.bubblesChartCountrySelectedBiggerLabel = element(by.css('g[class="vzb-bc-labels"] > g'));
  this.bubblesChartSelectedCountryCrossMark = element(by.css('svg[class="vzb-bc-label-x-icon"]> path'));
  this.bubblesChartChinaTrails = element.all(by.css('g[class="vzb-bc-entity entity-trail trail-chn"] > g[class="vzb-bc-trailsegment"]'));
  this.bubblesChartUnitedStatesTrails = element.all(by.css('g[class="vzb-bc-entity entity-trail trail-usa"] > g[class="vzb-bc-trailsegment"]'));
  this.bubblesChartLockButton = element.all(by.css('button[data-btn="lock"]')).last();
  this.bubblesChartTrailsButton = element.all(by.css('button[data-btn="trails"]')).last();

  /**
   * Get Tools page
   * @param url
   */
  this.get = function (url) {
    //browser.driver.manage().window().maximize(); //disabled due to https://bugs.chromium.org/p/chromedriver/issues/detail?id=1901
    browser.driver.manage().window().setSize(1920, 1080);
    browser.ignoreSynchronization = true;
    browser.get(url);
    browser.waitForAngular();
  };

  /**
   * Waits for Tools page to be loaded
   */
  this.waitForToolsPageCompletelyLoaded = function () {
    browser.wait(EC.visibilityOf(this.headerImage));
    browser.wait(EC.visibilityOf(this.buttonPlay));
    browser.wait(EC.invisibilityOf(this.movingSliderProgress.get(1)), 30000);
  };

  this.openBubblesChart = function () {
    this.get(url);
    this.waitForToolsPageCompletelyLoaded();
  };

  /**
   * Open Mountains Chart page
   */
  this.openMountainsChart = function () {
    this.get(url);
    this.mountainsChart.click();
    this.waitForToolsPageCompletelyLoaded();
  };

  /**
   * Refresh page and wait for page to be loaded
   */
  this.refreshToolsPage = function () {
    browser.refresh();
    this.waitForToolsPageCompletelyLoaded();
  };

  /**
   * Open Maps Chart page
   */
  this.openMapsChart = function () {
    this.get(url);
    this.mapsChart.click();
    this.waitForToolsPageCompletelyLoaded();
  };

  /**
   * Open Rankings Chart page
   */
  this.openRankingsChart = function () {
    this.get(url);
    this.rankingsChart.click();
    this.waitForToolsPageCompletelyLoaded();
  };

  /**
   * Open Lines Chart page
   */
  this.openLinesChart = function () {
    this.get(url);
    this.linesChart.click();
    this.waitForToolsPageCompletelyLoaded();
    this.waitForLinesChartPageToBeLoaded();
  };

  /**
   * Return text of selected on Side panel element
   * @param index
   * @returns {promise.Promise<string>|*|string|!webdriver.promise.Promise.<string>}
   */
  this.getRightSidePanelText = function (index) {
    return this.rightSidePanel.get(index).getText();
  };

  /**
   * Move slider
   */
  this.dragSlider = function () {
    browser.actions().dragAndDrop(this.sliderButton, {x: -900, y: 0}).perform()
  };

  this.dragSliderToPosition = function (x, y) {
    browser.actions().dragAndDrop(this.sliderButton, {x: x, y: y}).perform();
  };

  this.dragSliderToBeginning = function () {
    browser.actions().dragAndDrop(this.sliderButton, {x: -1496, y: 0}).perform();
  };

  /**
   * Select element on Bubbles chart page
   * @param country
   * @returns {*}
   */
  this.selectCountryOnBubblesChart = function (country) {
    let element = this.bubblesChartCountriesList[country];
    element.click();
    return element;
  };

  /**
   * Hover mouse over country on Bubbles chart page
   * @param country
   */
  this.hoverMouseOverCountryOnBubblesChart = function (country) {
    let element = this.bubblesChartCountriesList[country];
    browser.actions().mouseMove(element).perform();
  };

  /**
   * Search country and select it from search result
   * @param country
   */
  this.searchAndSelectCountry = function (country) {
    this.rightSidePanelSearchInputField.clear();
    this.rightSidePanelSearchInputField.sendKeys(country);

    this.rightSidePanelSearchResult.click();
  };


  /**
   * Search country and select it from search result
   * @param country
   */
  this.searchAndSelectCountryOnLinesChart = function (country) {
    this.linesChartRightSidePanelSearchInputField.clear();
    this.linesChartRightSidePanelSearchInputField.sendKeys(country);

    this.linesChartSearchResult.click();
  };

  /**
   * Get label of selected country on Mountains chart
   * @returns {promise.Promise<string>|!webdriver.promise.Promise.<string>|*|string}
   */
  this.getSelectedCountryTextOnMountainsChart = function (index) {
    return this.mountainsChartLeftSidePanelSelectedCountries.get(index).getText();
  };

  /**
   * Custom waiter: wait for certain elements count
   * @param elementArrayFinder
   * @param expectedCount
   * @returns {Function}
   */
  this.waitForCount = function (elementArrayFinder, expectedCount) {
    return function () {
      return elementArrayFinder.count().then(function (actualCount) {
        return expectedCount === actualCount;  // or <= instead of ===, depending on the use case
      });
    };
  };

  /**
   * Wait for Lines Chart page to be loaded
   */
  this.waitForLinesChartPageToBeLoaded = function () {
    browser.wait(this.waitForCount(this.movingSliderProgress, 1), 10000);
    browser.wait(this.waitForCount(this.linesChartDataDoubtsLabel, 1), 10000);
  };

  /**
   * Wait for Lines chart page Loader disappear after adding/removing country
   */
  this.waitForLinesChartPageToBeReloadedAfterAction = function () {
    browser.sleep(4000);
    browser.wait(this.waitForCount(this.pageLoader, 0));
  };

  this.selectTwoBiggestRedBubblesMapsChart = function () {
    this.mapsChartAllBubbles.filter(function (elem) {
      return elem.getAttribute('fill').then(function (text) {
        return text === '#ff5872';
      });
    }).then(function (filteredElements) {
      return filteredElements;
    }).then(function (filteredElements) {
      for (let i = 0; i < 2; i++) {
        filteredElements[i].click();
      }
    });
  };

  this.hoverMouseOverFirstBiggestRedBubbleMapsChart = function () {
    this.mapsChartAllBubbles.filter(function (elem) {
      return elem.getAttribute('fill').then(function (text) {
        return text === '#ff5872';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[0]).perform();
    })
  };

  this.hoverMouseOverSecondBiggestRedBubbleMapsChart = function () {
    this.mapsChartAllBubbles.filter(function (elem) {
      return elem.getAttribute('fill').then(function (text) {
        return text === '#ff5872';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[1]).perform();
    })
  };

  this.hoverMouseOverBiggestYellowBubbleMapsChart = function () {
    this.mapsChartAllBubbles.filter(function (elem) {
      return elem.getAttribute('fill').then(function (text) {
        return text === '#ffe700';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[0]).perform();
    })
  };

  this.hoverMouseOverBiggestBlueBubbleMapsChart = function () {
    this.mapsChartAllBubbles.filter(function (elem) {
      return elem.getAttribute('fill').then(function (text) {
        return text === '#00d5e9';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[0]).perform();
    })
  };

  this.hoverMouseOverBiggestGreenBubbleMapsChart = function () {
    this.mapsChartAllBubbles.filter(function (elem) {
      return elem.getAttribute('fill').then(function (text) {
        return text === '#7feb00';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[0]).perform();
    })
  };

  this.selectBiggestGreenBubbleMapsChart = function () {
    this.mapsChartAllBubbles.filter(function (elem) {
      return elem.getAttribute('fill').then(function (text) {
        return text === '#7feb00';
      });
    }).then(function (filteredElements) {
      filteredElements[0].click();
    })
  };

  this.getOpacityOfNonSelectedBubblesMapsChart = function () {
    this.mapsChartAllBubbles.each(function (elem) {
      return elem.getAttribute('style').then(function (opacity) {
        return opacity;
      });
    })
  };

  this.hoverMouseOverFirstBiggestRedBubbleBubblesChart = function () {
    this.bubblesChartAllBubbles.filter(function (elem) {
      return elem.getCssValue('fill').then(function (fill) {
        return fill === 'rgb(255, 88, 114)';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[0]).mouseMove({x: 0, y: 20}).perform();
    })
  };

  this.hoverMouseOverBiggestYellowBubbleBubblesChart = function () {
    this.bubblesChartAllBubbles.filter(function (elem) {
      return elem.getCssValue('fill').then(function (fill) {
        return fill === 'rgb(255, 231, 0)';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[0]).perform();
    })
  };

  this.hoverMouseOverSecondBiggestRedBubbleBubblesChart = function () {
    this.bubblesChartAllBubbles.filter(function (elem) {
      return elem.getCssValue('fill').then(function (fill) {
        return fill === 'rgb(255, 88, 114)';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[1]).perform();
    })
  };

  this.hoverMouseOverBiggestBlueBubbleBubblesChart = function () {
    this.bubblesChartAllBubbles.filter(function (elem) {
      return elem.getCssValue('fill').then(function (fill) {
        return fill === 'rgb(0, 213, 233)';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[0]).perform();
    })
  };

  this.hoverMouseOverBiggestGreenBubbleBubblesChart = function () {
    this.bubblesChartAllBubbles.filter(function (elem) {
      return elem.getCssValue('fill').then(function (fill) {
        return fill === 'rgb(127, 235, 0)';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[0]).mouseMove({x: 0, y: 20}).perform();
    })
  };

  this.selectBiggestGreenBubbleBubblesChart = function () {
    this.bubblesChartAllBubbles.filter(function (elem) {
      return elem.getCssValue('fill').then(function (fill) {
        return fill === 'rgb(127, 235, 0)';
      });
    }).then(function (filteredElements) {
      browser.actions().mouseMove(filteredElements[0]).mouseMove({x: 0, y: 20}).click().perform();
    })
  };

  this.getNumberOfNonSelectedBubblesOnBubblesChart = function () {
    this.bubblesChartAllBubbles.filter(function (elem) {
      return elem.getCssValue('opacity').then(function (opacity) {
        return opacity === '1';
      }).then(function (filteredElements) {
        return filteredElements.length;
      });
    })
  };

  this.countElementsByOpacity = function (element, opacity) {
    {
      if (!opacity) {
        return element.then(function (elements) {
          return elements.length;
        });
      }
      return element.map(function (element) {
        return element.getCssValue('opacity');
      }).then(function (textArray) {
        let numElements = 0;
        for (let i in textArray) {
          if (textArray[i] == opacity) {
            numElements++;
          }
        }
        return numElements;
      });
    }
  };

  this.dragAndDropSelectedCountryLabelMapsChart = function (x, y) {
    browser.actions().dragAndDrop(this.mapsChartSelectedCountriesLabels.get(0), {x: x, y: y}).perform();
  };

  this.dragAndDropSelectedCountryLabelBubblesChart = function (x, y) {
    browser.actions().dragAndDrop(this.bubblesChartSelectedCountryLabel, {x: x, y: y}).perform();
  };

  this.deselectCountryByClickingCrossMarkOnLabelMapsChart = function () {
    browser.actions().mouseMove(this.mapsChartSelectedCountryLabel).perform();
    this.mapsChartSelectedCountryCrossMark.click();
  };

  this.deselectCountryByClickingCrossMarkOnLabelBubblesChart = function () {
    browser.actions().mouseMove(this.bubblesChartSelectedCountryLabel).perform();
    this.bubblesChartSelectedCountryCrossMark.click();
  };

  this.hoverMouseOver500AxisXOnMountainsChart = function () {
    browser.actions().mouseMove(this.axisXLineNumbers.get(10)).perform();
  };

  this.hoverMouserOverExtremePovertyTitleMapsChart = function () {
    browser.actions().mouseMove(this.mountainsChartExtremePovertyTitle).mouseMove({x: 10, y: 90}).perform();
  };

  this.searchAndSelectCountryInShowMenu = function (country) {
    this.mountainsChartShowButtonSearchInputField.clear();
    this.mountainsChartShowButtonSearchInputField.sendKeys(country);

    this.linesChartSearchResult.click();
  };

  this.deselectCountryInShowMenu = function (country) {
    this.mountainsChartShowButtonSearchInputField.clear();
    this.mountainsChartShowButtonSearchInputField.sendKeys(country);
    browser.wait(EC.presenceOf(this.showMenuSelectedCountry), 5000);

    this.showMenuSelectedCountry.click();
  };

  this.deselectCountryInSearchMenu = function (country) {
    this.rightSidePanelSearchInputField.clear();
    this.rightSidePanelSearchInputField.sendKeys(country);

    browser.wait(EC.presenceOf(this.searchMenuSelectedCountry), 5000);

    this.searchMenuSelectedCountry.click();
  };

  this.waitForPageToBeReloadedAfterAction = function () {
    browser.wait(this.waitForCount(this.pageLoader, 0));
    browser.wait(EC.stalenessOf(this.pageLoader), 5000);
    browser.wait(EC.presenceOf(this.pageLoader2), 5000);
  };

  this.getCoordinatesOfLowerOpacityBubblesOnBubblesChart = function () {
    return this.bubblesChartAllBubbles
      .filter(function (elem) {
        return elem.getCssValue('opacity').then(function (opacity) {
          return opacity === '0.3';
        });
      })
      .map(function (elm) {
        return {
          cx: elm.getAttribute('cx'),
          cy: elm.getAttribute('cy')
        };
      }).then(function (obj) {
        return obj.reduce((result, obj) => {
          result.push(obj.cx);
          result.push(obj.cy);
          return result
        }, []).sort();
      })
  };

  this.getRadiusOfBubblesOnBubblesChart = function () {
    return this.bubblesChartAllBubbles.map(function (elem) {
      return elem.getAttribute('r').then(function (radius) {
        return radius;
      });
    })
  };

  this.dragElementToPosition = function (element, x, y) {
    browser.actions()
      .mouseMove(element)
      .mouseDown(element)
      .mouseMove({x: x, y: y})
      .mouseUp()
      .perform();
  };

  this.waitForTextPresentForElement = function (element, text) {
    browser.wait(EC.textToBePresentInElement(element, text), 5000);
  };

};

module.exports = ToolsPage;
