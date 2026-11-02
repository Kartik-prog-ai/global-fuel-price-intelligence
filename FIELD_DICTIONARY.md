# Field dictionary

## Dataset grain

The raw file has one row per date-country observation (27,468 rows). The prepared file has three possible rows per source observation: one each for Petrol, Diesel, and LPG (82,404 rows total). The tax, income, subsidy, and Brent fields are copied from the same source observation to each fuel row. Do not sum those repeated fields.

| Prepared field | Type | Meaning / handling |
|---|---|---|
| date | Date | Weekly source observation date; 2020-01-06 through 2026-04-06 |
| year | Integer | Year derived from date |
| country | String | Source country or territory name; use for Tableau geographic role after checking geocoding |
| region | String | Seven source-defined regions |
| fuel_type | String | Petrol, Diesel, LPG |
| retail_price_usd_per_liter | Decimal | Source pump price standardized to USD/L |
| tax_rate_pct | Decimal | Source estimated tax share of retail price, percent units (e.g. 26.7 means 26.7%) |
| income_group | String | Source economic category: High, Middle, Low |
| subsidy_level | String | Source policy category: Low, Medium, High, Very High |
| brent_crude_usd_per_barrel | Decimal | Brent crude benchmark, USD/barrel |
| source_row | Integer | Row number in source CSV, including header offset |
| source_file | String | Source CSV filename |
| quality_flag | String | Empty for clean rows; may include duplicate_source_key, negative_price, or zero_price_review |

## Important field caveats

The Kaggle listing defines price fields in USD/L and tax_percentage as an estimated percentage of retail price attributed to taxes. These are source-owner definitions, not independently audited measurement methodology. subsidy_level is categorical, not a subsidy amount. The source description treats LPG as USD/L; confirm the underlying physical basis before comparing LPG directly with liquid road fuels.

quality_flag is blank for the downloaded source after preparation. If a future source version has flagged rows, exclude or review them explicitly rather than deleting them without a record.
