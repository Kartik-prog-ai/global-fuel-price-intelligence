# Tableau build guide

## Connect the data

1. Open data/processed/fuel_prices_cleaned.csv in Tableau Desktop or Tableau Public.
2. Set date to Date, year to Number (whole), the fuel price/Brent/tax fields to Number (decimal), and country, region, fuel_type, income_group, and subsidy_level to String.
3. Assign Country/Region geographic role to country; review ambiguous and unmatched places.
4. Keep quality_flag in the source. The downloaded version has no flagged rows.

## Useful calculated fields

Price (USD/L)

    [retail_price_usd_per_liter]

Tax share (%)

    [tax_rate_pct]

The source value is already in percent units.

Country-date key

    STR([date]) + " | " + [country]

Review status

    IF CONTAINS([quality_flag], "duplicate_source_key")
    OR CONTAINS([quality_flag], "negative_price")
    OR CONTAINS([quality_flag], "zero_price_review")
    THEN "Review"
    ELSE "Use"
    END

Country average for equal-country regional comparisons

    { FIXED [country], [fuel_type] : AVG([retail_price_usd_per_liter]) }

Place this measure on a view by region/fuel to give each country one value before averaging. For date-specific comparisons, use a country-year LOD instead:

    { FIXED [country], [year], [fuel_type] : AVG([retail_price_usd_per_liter]) }

Name the resulting metric equal-country average so it is not confused with the pooled observation mean.

## Suggested sheets

1. Overview trend: date on Columns (continuous week or month), AVG(Price) on Rows, fuel_type on Color. 2026 is partial through April.
2. Regional comparison: region by AVG(Price), filtered by year/fuel. Add an alternate view using equal-country averages.
3. Country map: country geographic role with AVG(Price) on Color and fuel_type/year filters. Validate geocoding before publication.
4. Policy context: scatter tax_rate_pct vs AVG(Price) for Petrol; use country on Detail, region on Color, income_group and subsidy_level as filters.
5. Affordability: subsidy_level and income_group against Petrol/Diesel/LPG prices. State that observed gaps are descriptive and category definitions come from the source.
6. Logistics exposure: country-level price trend and standard deviation by region/country/fuel; keep weekly volatility separate from annual average.
7. Story: policy comparisons, logistics volatility, and research detail, each with coverage and weighting caveats.

## Dashboard filters

Date range, year, region, country, fuel type, income group, and subsidy level. Apply them consistently to all relevant sheets, and show the date cutoff and average-weighting method in a visible footnote.
