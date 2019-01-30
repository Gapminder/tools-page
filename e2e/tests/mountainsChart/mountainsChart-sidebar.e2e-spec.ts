import { MountainChart } from '../../pageObjects/charts';
import { Sidebar } from '../../pageObjects/components';
import { safeExpectIsDispayed } from '../../helpers/helper';

const mountainChart: MountainChart = new MountainChart();
const sidebar: Sidebar = new Sidebar();

describe('Mountains chart: Sidebar', () => {
    beforeEach(async () => {
        await mountainChart.openChart();
    });

    it('"show" section hide all countries except selected', async () => {
        /**
         * should check that only checked countries displayed after click "show", check a few countries(TC21)
         */
        expect(await mountainChart.allCountriesOnChart.count()).toEqual(193);

        await sidebar.findSelect.searchAndSelectCountry('Ukraine');

        expect(await mountainChart.selectedCountriesOnChart.count()).toEqual(1);
        expect(await mountainChart.rightSidePanelSelectedCountriesList.count()).toEqual(1);

        await sidebar.findSelect.searchAndSelectCountry('Austria');
        expect(await mountainChart.selectedCountriesOnChart.count()).toEqual(2);

        expect(await mountainChart.rightSidePanelSelectedCountriesList.count()).toEqual(2);

        await sidebar.findSelect.searchAndSelectCountry('Brazil');

        expect(await mountainChart.selectedCountriesOnChart.count()).toEqual(3);
        expect(await mountainChart.rightSidePanelSelectedCountriesList.count()).toEqual(3);
    });

    it('uncheck all countries from "show" return to the default view', async () => {
        /**
         * should check that uncheck the countries from "show", when the last one is unchecked,
         * the picture should return to a default view = stacked shapes of all countries(TC22)
         */
        await sidebar.findSelect.searchAndSelectCountry('Ukraine');
        await safeExpectIsDispayed(mountainChart.allCountriesOnChart.first(), 5000);
        expect(await mountainChart.selectedCountriesOnChart.count()).toEqual(1);
        expect(await mountainChart.rightSidePanelSelectedCountriesList.count()).toEqual(1);

        await sidebar.findSelect.searchAndSelectCountry('Austria');
        await safeExpectIsDispayed(mountainChart.allCountriesOnChart.get(1), 5000);

        expect(await mountainChart.selectedCountriesOnChart.count()).toEqual(2);
        expect(await mountainChart.rightSidePanelSelectedCountriesList.count()).toEqual(2);

        await sidebar.findSelect.deselectCountryInSearch('Ukraine');
        await sidebar.findSelect.deselectCountryInSearch('Austria');
        expect(await mountainChart.allCountriesOnChart.count()).toEqual(193);
        expect(await mountainChart.rightSidePanelCountriesList.count()).toBeGreaterThan(25);
    });
});
