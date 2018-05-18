export default new Map([
	// legacy temporary GW indicator
	["20120905_extreme_poverty_percent_people_below_125_a_day", 
	 "extreme_poverty_percent_people_below_190_a_day"],
	// legacy temporary GW indicator
	["children_per_woman_temporary_update", 
	 "children_per_woman_total_fertility"],
	// updated ppp year in WDI
	["co2_intensity_of_economic_output_kg_co2_per_2005_ppp_of_gdp", 
	 "co2_intensity_of_economic_output_kg_co2_per_2011_ppp_of_gdp"],
	// removed by World Bank from WDI
	["electricity_use_total", 
	 "electricity_use_per_person"],
	// removed by World Bank from WDI
	["energy_use_total", 
	 "energy_use_per_person"],
	// updated extreme poverty limit in WDI
	["extreme_poverty_percent_people_below_125_a_day", 
	 "extreme_poverty_percent_people_below_190_a_day"],
	// indicator split in WDI to separate fixed and mobile
	["fixed_line_and_mobile_phone_subscribers_per_100_people", 
	 "fixed_line_subscribers_per_100_people"],
	// updated year in WDI
	["gnipercapita_constant_2000_us", 
	 "gnipercapita_constant_2010_us"],
	// Was at some point mistakenly renamed because World Bank renamed indicator id
	["internet_users_per_100_people", 
	 "internet_users"],
	// Removed by World Bank from WDI 
	["internet_users_total_number", 
	 "internet_users"],
	// Legacy GW indicator
	["old_version_of_income_per_person_version_3", 
	 "income_per_person_gdppercapita_ppp_inflation_adjusted"],
	// Legacy GW indicator
	["old_version_of_income_per_person_version_8", 
	 "income_per_person_gdppercapita_ppp_inflation_adjusted"],
	// updated poverty limited by World Bank in WDI
	["poverty_percent_people_below_2_a_day",
	 "poverty_percent_people_below_320_a_day"], 
    // updated poverty limited by World Bank in WDI
	["poverty_percent_people_below_310_a_day",
	 "poverty_percent_people_below_320_a_day"], 
	// Redundant legacy GW indicator (same data source)
	["yearly_co2_emissions_tonnes",
	 "yearly_co2_emissions_1000_tonnes"]
    // Changed defenition of sanitation in WDI
    ["improved_sanitation_overall_access_percent",
     "at_least_basic_sanitation_overall_access_percent"],
    ["improved_sanitation_rural_access_percent",
     "at_least_basic_sanitation_rural_access_percent"],
    ["improved_sanitation_urban_access_percent",
     "at_least_basic_sanitation_urban_access_percent"],
    // Changed defenition of water sources in WDI
    ["improved_water_source_overall_access_percent",
     "at_least_basic_water_source_overall_access_percent"],
    ["improved_water_source_rural_access_percent",
     "at_least_basic_water_source_rural_access_percent"],
    ["improved_water_source_urban_access_percent",
     "at_least_basic_water_source_urban_access_percent"]
	 /*
	// Static indicator with latitude of countries, removed
	// Should be replaced by latitude geo property
	["how_far_to_the_north", 
	 "how_far_to_the_north"],
	// Legacy "year"-proxy indicator
	// Should be replaced by time as property (now indicator)
	["year_categorization_1820_2010",
	 "time"],
	// Legacy "year"-proxy indicator
	// Should be replaced by time as property (now indicator)
	["year_categorization_1950",
	 "time"],
	// GW color indicator with values 1 and 2 for estimate or projection, 
	// should be used with specific IHME u5mr indicator
	// maybe replace with world_4region color property later
	["estimate_or_projection_of_under_five_mortality_rate_from_ihme", 
	 "under_five_mortality_from_ihme_per_1000_born"],
	 */
]);

