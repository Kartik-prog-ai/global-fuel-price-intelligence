# Tableau workbook plan

Build one Tableau workbook from data/processed/fuel_prices_cleaned.csv after reviewing the data quality report.

## Source fields and grain

Each prepared record represents one source date, country, and fuel type. Prices are in USD per liter; Brent crude is USD per barrel. Tax percentage and income/subsidy categories are copied from the source row and are not fuel-specific in the provided schema. The source's LPG unit must be verified before comparing LPG with petrol and diesel.

Keep the original source file unchanged. Use the quality_flag field to exclude or separately inspect duplicate source keys and negative or zero prices. Do not use imputed values unless they are added later as a separately documented field.

## Workbook sheets

1. **Global overview:** latest available period, average price by fuel, country and region coverage, and price trend by month or quarter.
2. **Country and region comparison:** filled map for country price by selected fuel and period, plus a ranked comparison bar chart. Check country geocoding manually.
3. **Policy context:** price by tax percentage and subsidy level, split by fuel and income group. Use descriptive language; the source is observational and does not prove that taxes or subsidies caused the observed price differences.
4. **Logistics exposure:** price trend and volatility by country, region, and fuel. Compare selected market patterns; do not forecast unless a separate forecasting method is built and validated.
5. **Research detail:** tax, subsidy, income group, and fuel price comparison with a downloadable data table and coverage notes.

## Global filters

Date range, region, country, fuel type, income group, and subsidy level. Keep filter behavior consistent across sheets; provide a clear reset option.

## Definitions to settle before publishing

- Are source records weekly? What does each date represent: quote date, weekly average, or report date?
- Is tax_percentage a share of pump price, a statutory rate, or another measure?
- How is subsidy_level assigned, and is it time-varying?
- Is LPG actually priced per liter in this source? Avoid direct comparison if it is per kilogram or another unit.
- Is currency conversion based on a consistent exchange-rate date?
- Are averages simple country-observation means or weighted by consumption/population? Label the choice explicitly.

## Quality and review

Before publication, reconcile row counts and coverage against the source, review duplicate keys and price flags, inspect country aliases, and confirm a selected sample against source rows. Check that charts update under every filter and state the data cutoff (the brief's 2026 coverage is partial through April).
