# Global Fuel Prices & Taxation Intelligence

Working project for the SkillWallet brief: global weekly fuel prices, taxation, subsidies, regions, and income groups, 2020–2026.

**GitHub repository:** https://github.com/Kartik-prog-ai/global-fuel-price-intelligence

## Dataset and work completed

The source is the [Global Fuel Prices 2020–2026 Kaggle dataset](https://www.kaggle.com/datasets/belbino/global-fuel-prices-20202026), recorded as CC0. It is retained in `data/raw/`; the prepared long table and quality report are in `data/processed/`.

- Original rows: 27,468 across 84 countries and 7 regions.
- Coverage: 2020-01-06 through 2026-04-06; 2026 is partial.
- Prepared rows: 82,404, one per date/country/fuel.
- Audit: no missing source cells, invalid dates, duplicate country-date-region keys, or flagged negative/zero prices.
- Analysis: annual and regional means, tax/subsidy context, and weekly volatility; descriptive only.

## Open the dashboard

1. Open `index.html` in a browser.
2. Choose **Load cleaned CSV** and select `data/processed/fuel_prices_cleaned.csv`.
3. Use the year, region, fuel, income, and subsidy filters. The app reads the file locally in your browser.

The dashboard reports simple means over observed rows, not population- or consumption-weighted averages. 2026 ends April 6. Confirm the source measurement basis for LPG before comparing it directly with petrol and diesel.

## Tableau deliverables

The published Tableau Public workbook is [available here](https://public.tableau.com/app/profile/kartik.rathore6738/viz/GlobalFuelPricesandTaxationTrends-FuelScope/Sheet1). It includes the annual average price trend, Petrol-only regional average view, dashboard, and two-point story. The workbook is also linked from the SkillWallet project page.

## Files

- `DO_AND_DONT.md` — interpretation guardrails for the three stakeholder audiences.
- `DATA_NOTES.md` — source, license, and caveats.
- `DATA_PREPARATION.md` — reproducible ETL instructions.
- `FIELD_DICTIONARY.md` — field definitions and units.
- `data/processed/INITIAL_ANALYSIS.md` — prices by fuel, year, and region.
- `data/processed/POLICY_ANALYSIS.md` — tax, income, subsidy, and correlation summary.
- `data/processed/VOLATILITY_ANALYSIS.md` — country/fuel volatility rankings.

See `PROJECT_STATUS.md` for the current publishing handoff. The published workbook includes the regional view, dashboard, and story. SkillWallet View Demo opens the workbook. Formal testing remains pending.

## Project report

`PROJECT_REPORT.docx` follows the supplied project-report blueprint from Introduction through Appendix. It records the confirmed SkillWallet demo link and leaves formal functional, compatibility, and performance testing pending.


