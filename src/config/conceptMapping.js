const toolsPage_conceptMapping = {
  //If you are adding a new redirect, ctrl+f the concpet you are redirecting from
  //in this file! it might be that one of the old redirects needs to be updated

  // 2025-11-21 rename OECD indicators
  aid_given_2007_us: {
    concept: "aid_given_2023_us",
  },
  aid_given_per_person_2007_us: {
    concept: "aid_given_per_person_2023_us",
  },

  // 2025-11-21 murder/traffic death rates by age group removed
  murdered_15_29_per_100000_people: {
    concept: "murder_per_100000_people",
  },
  murdered_30_44_per_100000_people: {
    concept: "murder_per_100000_people",
  },
  murdered_45_59_per_100000_people: {
    concept: "murder_per_100000_people",
  },
  murdered_60plus_per_100000_people: {
    concept: "murder_per_100000_people",
  },
  murdered_children_0_14_per_100000_people: {
    concept: "murder_per_100000_people",
  },
  traffic_mortality_15_29_per_100000_people: {
    concept: "traffic_deaths_per_100000_people",
  },
  traffic_mortality_30_44_per_100000_people: {
    concept: "traffic_deaths_per_100000_people",
  },
  traffic_mortality_45_59_per_100000_people: {
    concept: "traffic_deaths_per_100000_people",
  },
  traffic_mortality_60plus_per_100000_people: {
    concept: "traffic_deaths_per_100000_people",
  },
  traffic_mortality_children_0_14_per_100000_people: {
    concept: "traffic_deaths_per_100000_people",
  },

  // 2025-11-21 suicide rate's age groups removed
  suicide_age_0_14_per_100000_people: {
    concept: "suicide_per_100000_people",
  },
  suicide_age_45_59_per_100000_people: {
    concept: "suicide_age_45_54_per_100000_people",
  },
  suicide_age_30_44_per_100000_people: {
    concept: "suicide_age_30_49_per_100000_people",
  },
  suicide_age_60plus_per_100000_people: {
    concept: "suicide_age_85plus_per_100000_people",
  },

  // 2025-11-21 fix a typo
  other_infections_deaths_in_children_1_59_months_per_1000_birt: {
    concept: "other_infections_deaths_in_children_1_59_months_per_1000_births",
  },

  // 2025-07-30 rename poverty indicators
  extreme_poverty_percent_people_below_215_a_day: {
    concept: "extreme_poverty_percent_people_below_300_a_day",
  },
  poverty_percent_people_below_365_a_day: {
    concept: "poverty_percent_people_below_420_a_day",
  },
  poverty_percent_people_below_685_a_day: {
    concept: "poverty_percent_people_below_830_a_day",
  },

  // 2025-07-21 moving core indicators (updated 2025-11-09)
  child_mortality_0_5_year_olds_dying_per_1000_born: {
    concept: "child_mortality_0_5_year_olds_dying_per_1000_born",
    source: "fasttrack",
  },
  child_mortality_0_5_year_olds_more_years_version_7: {
    concept: "child_mortality_0_5_year_olds_dying_per_1000_born",
    source: "fasttrack",
  },
  gapminder_gini: { concept: "gini", source: "fasttrack" },
  co2_emissions_tonnes_per_person: {
    concept: "c_emission_cap",
    source: "fasttrack",
  },
  consumption_co2_emissions_1000_tonnes: {
    concept: "co2_cons",
    source: "fasttrack",
  },
  consumption_emissions_tonnes_per_person: {
    concept: "co2_pcap_cons",
    source: "fasttrack",
  },
  cumulative_co2_emissions_tonnes: { concept: "co2_cons", source: "fasttrack" },
  yearly_co2_emissions_1000_tonnes: {
    concept: "co2_cons",
    source: "fasttrack",
  },

  //2024-10-09 moving corruption_perception_index_cpi to fasttrack
  corruption_perception_index_cpi_pre2012: {
    concept: "corruption_perception_index_cpi",
    source: "fasttrack",
  },
  corruption_perception_index_cpi: {
    concept: "corruption_perception_index_cpi",
    source: "fasttrack",
  },

  //2024-08-15 moving more from SG to fasttrack
  children_per_woman_total_fertility: {
    concept: "children_per_woman_total_fertility",
    source: "fasttrack",
  },
  children_per_woman_total_fertility_with_projections: {
    concept: "children_per_woman_total_fertility",
    source: "fasttrack",
  },

  population_aged_0_14_years_both_sexes_percent: {
    concept: "population_aged_0_14_years_both_sexes_percent",
    source: "fasttrack",
  },
  population_aged_0_14_years_female_percent: {
    concept: "population_aged_0_14_years_female_percent",
    source: "fasttrack",
  },
  population_aged_0_14_years_male_percent: {
    concept: "population_aged_0_14_years_male_percent",
    source: "fasttrack",
  },
  population_aged_0_14_years_total_number: {
    concept: "population_aged_0_14_years_total_number",
    source: "fasttrack",
  },
  population_aged_0_4_years_both_sexes_percent: {
    concept: "population_aged_0_4_years_both_sexes_percent",
    source: "fasttrack",
  },
  population_aged_0_4_years_female_percent: {
    concept: "population_aged_0_4_years_female_percent",
    source: "fasttrack",
  },
  population_aged_0_4_years_male_percent: {
    concept: "population_aged_0_4_years_male_percent",
    source: "fasttrack",
  },
  population_aged_0_4_years_total_number: {
    concept: "population_aged_0_4_years_total_number",
    source: "fasttrack",
  },
  population_aged_10_14_years_both_sexes_percent: {
    concept: "population_aged_10_14_years_both_sexes_percent",
    source: "fasttrack",
  },
  population_aged_10_14_years_female_percent: {
    concept: "population_aged_10_14_years_female_percent",
    source: "fasttrack",
  },
  population_aged_10_14_years_male_percent: {
    concept: "population_aged_10_14_years_male_percent",
    source: "fasttrack",
  },
  population_aged_10_14_years_total_number: {
    concept: "population_aged_10_14_years_total_number",
    source: "fasttrack",
  },
  population_aged_15_19_years_both_sexes_percent: {
    concept: "population_aged_15_19_years_both_sexes_percent",
    source: "fasttrack",
  },
  population_aged_15_19_years_female_percent: {
    concept: "population_aged_15_19_years_female_percent",
    source: "fasttrack",
  },
  population_aged_15_19_years_male_percent: {
    concept: "population_aged_15_19_years_male_percent",
    source: "fasttrack",
  },
  population_aged_15_19_years_total_number: {
    concept: "population_aged_15_19_years_total_number",
    source: "fasttrack",
  },
  population_aged_20_39_years_both_sexes_percent: {
    concept: "population_aged_20_39_years_both_sexes_percent",
    source: "fasttrack",
  },
  population_aged_20_39_years_female_percent: {
    concept: "population_aged_20_39_years_female_percent",
    source: "fasttrack",
  },
  population_aged_20_39_years_male_percent: {
    concept: "population_aged_20_39_years_male_percent",
    source: "fasttrack",
  },
  population_aged_20_39_years_total_number: {
    concept: "population_aged_20_39_years_total_number",
    source: "fasttrack",
  },
  population_aged_40_59_years_both_sexes_percent: {
    concept: "population_aged_40_59_years_both_sexes_percent",
    source: "fasttrack",
  },
  population_aged_40_59_years_female_percent: {
    concept: "population_aged_40_59_years_female_percent",
    source: "fasttrack",
  },
  population_aged_40_59_years_male_percent: {
    concept: "population_aged_40_59_years_male_percent",
    source: "fasttrack",
  },
  population_aged_40_59_years_total_number: {
    concept: "population_aged_40_59_years_total_number",
    source: "fasttrack",
  },
  population_aged_5_9_years_both_sexes_percent: {
    concept: "population_aged_5_9_years_both_sexes_percent",
    source: "fasttrack",
  },
  population_aged_5_9_years_female_percent: {
    concept: "population_aged_5_9_years_female_percent",
    source: "fasttrack",
  },
  population_aged_5_9_years_male_percent: {
    concept: "population_aged_5_9_years_male_percent",
    source: "fasttrack",
  },
  population_aged_5_9_years_total_number: {
    concept: "population_aged_5_9_years_total_number",
    source: "fasttrack",
  },
  population_aged_60plus_years_both_sexes_percent: {
    concept: "population_aged_60plus_years_both_sexes_percent",
    source: "fasttrack",
  },
  population_aged_60plus_years_female_percent: {
    concept: "population_aged_60plus_years_female_percent",
    source: "fasttrack",
  },
  population_aged_60plus_years_male_percent: {
    concept: "population_aged_60plus_years_male_percent",
    source: "fasttrack",
  },
  population_aged_60plus_years_total_number: {
    concept: "population_aged_60plus_years_total_number",
    source: "fasttrack",
  },
  population_aged_65plus_years_both_sexes_percent: {
    concept: "population_aged_65plus_years_both_sexes_percent",
    source: "fasttrack",
  },
  population_aged_65plus_years_female_percent: {
    concept: "population_aged_65plus_years_female_percent",
    source: "fasttrack",
  },
  population_aged_65plus_years_male_percent: {
    concept: "population_aged_65plus_years_male_percent",
    source: "fasttrack",
  },
  population_aged_65plus_years_total_number: {
    concept: "population_aged_65plus_years_total_number",
    source: "fasttrack",
  },
  population_aged_70plus_years_both_sexes_percent: {
    concept: "population_aged_70plus_years_both_sexes_percent",
    source: "fasttrack",
  },
  population_aged_70plus_years_female_percent: {
    concept: "population_aged_70plus_years_female_percent",
    source: "fasttrack",
  },
  population_aged_70plus_years_male_percent: {
    concept: "population_aged_70plus_years_male_percent",
    source: "fasttrack",
  },
  population_aged_70plus_years_total_number: {
    concept: "population_aged_70plus_years_total_number",
    source: "fasttrack",
  },

  //2023-05-11 moving some important indicators from SG to fasttrack
  population_total: { concept: "pop", source: "fasttrack" },
  life_expectancy_years: { concept: "lex", source: "fasttrack" },
  income_per_person_gdppercapita_ppp_inflation_adjusted: {
    concept: "gdp_pcap",
    source: "fasttrack",
  },

  // legacy temporary GW indicator
  "20120905_extreme_poverty_percent_people_below_125_a_day": {
    concept: "extreme_poverty_percent_people_below_190_a_day",
  },
  // legacy temporary GW indicator
  children_per_woman_temporary_update: {
    concept: "children_per_woman_total_fertility",
    source: "fasttrack",
  },
  // updated ppp year in WDI
  co2_intensity_of_economic_output_kg_co2_per_2005_ppp_of_gdp: {
    concept: "co2_intensity_of_economic_output_kg_co2_per_2011_ppp_of_gdp",
  },
  // removed by World Bank from WDI
  electricity_use_total: { concept: "electricity_use_per_person" },
  // removed by World Bank from WDI
  energy_use_total: { concept: "energy_use_per_person" },
  // updated extreme poverty limit in WDI
  extreme_poverty_percent_people_below_125_a_day: {
    concept: "extreme_poverty_percent_people_below_190_a_day",
  },
  // indicator split in WDI to separate fixed and mobile
  fixed_line_and_mobile_phone_subscribers_per_100_people: {
    concept: "fixed_line_subscribers_per_100_people",
  },
  // updated year in WDI
  gnipercapita_constant_2000_us: { concept: "gnipercapita_constant_2010_us" },
  // Was at some point mistakenly renamed because World Bank renamed indicator id
  internet_users_per_100_people: { concept: "internet_users" },
  // Removed by World Bank from WDI
  internet_users_total_number: { concept: "internet_users" },
  // Legacy GW indicator
  old_version_of_income_per_person_version_3: {
    concept: "income_per_person_gdppercapita_ppp_inflation_adjusted",
  },
  // Legacy GW indicator
  old_version_of_income_per_person_version_8: {
    concept: "income_per_person_gdppercapita_ppp_inflation_adjusted",
  },
  // updated poverty limited by World Bank in WDI
  poverty_percent_people_below_2_a_day: {
    concept: "poverty_percent_people_below_320_a_day",
  },
  // Redundant legacy GW indicator (same data source)
  yearly_co2_emissions_tonnes: { concept: "yearly_co2_emissions_1000_tonnes" },

  // Updated indicators from ILO.org with slightly different definitions that got reflected in concpet names
  aged_55plus_unemployment_rate_percent: {
    concept: "aged_65plus_unemployment_rate_percent",
  },

  agriculture_workers_percent_of_labour_force: {
    concept: "agriculture_workers_percent_of_employment",
  },

  family_workers_percent_of_labour_force: {
    concept: "family_workers_percent_of_employment",
  },

  female_agriculture_workers_percent_of_female_labour_force: {
    concept: "female_agriculture_workers_percent_of_female_employment",
  },

  female_family_workers_percent_of_female_labour_force: {
    concept: "female_family_workers_percent_of_female_employment",
  },

  female_industry_workers_percent_of_female_labour_force: {
    concept: "female_industry_workers_percent_of_female_employment",
  },

  female_salaried_workers_percent_of_female_labour_force: {
    concept:
      "female_salaried_workers_percent_of_non_agricultural_female_employment",
  },

  female_self_employed_percent_of_female_labour_force: {
    concept: "female_self_employed_percent_of_female_employment",
  },

  female_service_workers_percent_of_female_labour_force: {
    concept: "female_service_workers_percent_of_female_employment",
  },

  females_aged_55plus_unemployment_rate_percent: {
    concept: "females_aged_65plus_unemployment_rate_percent",
  },

  hourly_compensation_us: { concept: "hourly_labour_cost_constant_2011_usd" },

  industry_workers_percent_of_labour_force: {
    concept: "industry_workers_percent_of_employment",
  },

  male_agriculture_workers_percent_of_male_labour_force: {
    concept: "male_agriculture_workers_percent_of_male_employment",
  },

  male_family_workers_percent_of_male_labour_force: {
    concept: "male_family_workers_percent_of_male_employment",
  },

  male_industry_workers_percent_of_male_labour_force: {
    concept: "male_industry_workers_percent_of_male_employment",
  },

  male_salaried_workers_percent_of_male_labour_force: {
    concept:
      "male_salaried_workers_percent_of_non_agricultural_male_employment",
  },

  male_self_employed_percent_of_male_labour_force: {
    concept: "male_self_employed_percent_of_male_employment",
  },

  male_service_workers_percent_of_male_labour_force: {
    concept: "male_service_workers_percent_of_male_employment",
  },

  males_aged_55plus_unemployment_rate_percent: {
    concept: "males_aged_65plus_unemployment_rate_percent",
  },

  salaried_workers_percent_of_labour_force: {
    concept: "salaried_workers_percent_of_non_agricultural_employment",
  },

  self_employed_percent_of_labour_force: {
    concept: "self_employed_percent_of_employment",
  },

  service_workers_percent_of_labour_force: {
    concept: "service_workers_percent_of_employment",
  },
  /*
  // Static indicator with latitude of countries, removed
  // Should be replaced by latitude geo property
  how_far_to_the_north:
   { concept: "how_far_to_the_north" },
  // Legacy "year"-proxy indicator
  // Should be replaced by time as property (now indicator)
  year_categorization_1820_2010:
   { concept: "time" },
  // Legacy "year"-proxy indicator
  // Should be replaced by time as property (now indicator)
  year_categorization_1950:
   { concept: "time" },
  // GW color indicator with values 1 and 2 for estimate or projection,
  // should be used with specific IHME u5mr indicator
  // maybe replace with world_4region color property later
  estimate_or_projection_of_under_five_mortality_rate_from_ihme:
   { concept: "under_five_mortality_from_ihme_per_1000_born" },
   */
};
