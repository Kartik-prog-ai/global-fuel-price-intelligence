# Project guardrails: what to do and what to avoid

## Do
- Keep the downloaded source CSV unchanged; work from the prepared long-format file.
- Label the metric as a simple mean across observed country-week rows. It is not weighted by population, fuel consumption, or market size.
- Put the date coverage on every dashboard: 2020-01-06 to 2026-04-06. Mark 2026 as partial.
- Use one row per date, country, and fuel. Keep fuel type as a dimension and price as the measure.
- Show both price-level volatility (USD/L standard deviation) and relative volatility (coefficient of variation, CV) for logistics comparisons.
- Explain that CV can look very large when the average price is near zero; pair it with the standard deviation and mean.
- Describe tax and subsidy comparisons as associations in this dataset, not policy effects.
- Verify the LPG price unit and source definitions before putting LPG, petrol, and diesel on a directly comparable scale.
- Keep the data-quality report and source attribution with the workbook.

## Avoid
- Do not call 2026 a full-year result or compare it as one against complete years.
- Do not imply that higher tax causes higher fuel prices, or that subsidies caused lower prices, from these descriptive comparisons.
- Do not call the average a global, population-weighted, or consumption-weighted price.
- Do not rank countries on CV alone; extreme CVs in very-low-price markets can overstate practical absolute movement.
- Do not forecast, estimate route costs, or make procurement recommendations from this historical table alone.
- Do not silently remove records, replace missing data, or overwrite source values. Record any future exclusions and derived fields.
- Do not publish until you verify the original source's definitions for weekly dates, taxes, subsidy categories, currency conversion, and LPG units.

## Suggested audience-specific use
- **Government policy consultant:** show tax/subsidy category comparisons with the observational caveat visible beside the chart.
- **Supply-chain manager:** compare actual USD/L changes and standard deviation by relevant country/fuel; use CV only as context. Add route, volume, and supplier data before estimating exposure.
- **Researcher:** make the grain, time cutoff, units, source definitions, and unweighted aggregation explicit; avoid causal claims without a stronger design.
