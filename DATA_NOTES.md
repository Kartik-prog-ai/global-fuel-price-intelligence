# Dataset source and provenance

## Primary source

**Dataset:** [Global Fuel Prices 2020–2026 by BELBIN BENO R M](https://www.kaggle.com/datasets/belbino/global-fuel-prices-20202026)  
**License:** CC0: Public Domain (Kaggle metadata)  
**Version retrieved:** 1, initial release, last updated 2026-04-07  
**Download location:** data/raw/kaggle_download/global_fuel_prices_2020_2026.csv  
**SHA-256:** 7e86ddbaab50d7d7f137a033c8c222a995b923120f70a4345abf11db0ca82cfe

The Kaggle record describes 27,468 weekly observations from January 2020 to April 2026, 84 countries, 7 regions, and prices for petrol, diesel, and LPG standardized to USD per liter. Its fields are date, country, region, income_level, subsidy_level, petrol_usd_liter, diesel_usd_liter, lpg_usd_liter, brent_crude_usd, and tax_percentage.

## Local quality audit

The downloaded file was processed without imputation, deduplication, or outlier deletion. The audit found 27,468 source rows, 84 countries, 7 regions, and 82,404 long-format fuel rows. It reported no missing source cells, unparseable dates, duplicate date-country-region keys, or negative/zero/non-numeric fuel prices. Full results are in data/processed/data_quality_report.json.

## Caveats

The Kaggle dataset description says the prices are standardized to USD/L and tax_percentage estimates the percentage of retail price attributed to taxes. These are dataset-owner definitions; the audit checks structure and values, not the validity of the upstream measurements. Treat subsidy_level as a categorical policy classification, not a numeric subsidy amount. Check whether country income/subsidy categories vary over time. A public profile of a similarly named dirty derivative reported quality issues, but that is not this exact primary CSV and is not used here.

IEA End-use Energy Prices and the OECD Carbon Pricing and Energy Taxation database are possible complementary sources, but have different coverage and measures:
- https://www.iea.org/data-and-statistics/data-product/end-use-energy-prices
- https://www.oecd.org/en/data/datasets/carbon-pricing-and-energy-taxation-database.html

Do not merge sources until country codes/names, dates, fuels, units, exchange rates, and measure definitions are reconciled.
