# Fuel prices and policy context: project story

## 1. A shared baseline

The dataset contains 27,468 weekly country observations across 84 countries and seven regions, from 2020-01-06 to 2026-04-06. Reshaping the three fuel columns produces 82,404 country-date-fuel rows. All summary averages below are simple means across observed rows; countries with more source weeks receive proportionally more rows. These are not population- or consumption-weighted estimates.

In the full-period pooled mean, petrol is $2.282/L, diesel $2.134/L, and LPG $1.711/L. The source describes all three as USD/L; confirm the underlying LPG measurement before treating that as a like-for-like retail comparison.

## 2. Price levels differ sharply by region

Petrol's unweighted regional mean is highest in Europe ($3.702/L) and lowest in the Middle East ($1.226/L), a difference of $2.476/L. Diesel and LPG show a similar broad ordering in this dataset. This comparison is useful for locating price-level differences, but it mixes countries and repeated weeks and does not isolate the reason for those differences.

## 3. Prices changed over time

The pooled petrol mean rose from $1.485/L in 2020 to $2.540/L in 2025 (+71.0%). It fell 10.8% from 2022 ($2.505/L) to 2023 ($2.234/L), then rose to $2.545/L in 2024. The 2026 mean is $2.647/L through April 6 only; show it as a partial-year point and do not compare it as a full-year result.

## 4. Policy categories provide context, not causal proof

Petrol's mean is $3.451/L in the source's Low subsidy category and $0.148/L in the Very High category. Average tax share on petrol rows is 26.77%; the pooled petrol/tax correlation is r=0.522. These are large descriptive differences. They do not show that subsidy levels or taxes caused the prices: categories may differ by country and can be confounded by income, geography, exchange rates, and time.

## 5. Volatility matters for exposure

Compare weekly standard deviation in USD/L for absolute price movement with the coefficient of variation (CV) for movement relative to the mean. For example, Venezuela petrol has a high CV because its mean price is extremely low; absolute variation remains much smaller than in the high-price markets ranked by USD/L standard deviation. Use both measures and add route, volume, supplier, or contract data before estimating supply-chain exposure.

## 6. What to show on the dashboard

1. A time trend with fuel selector and a visible April 6, 2026 cutoff.
2. Regional and income-group price comparisons with the aggregation method printed beside the chart.
3. Tax and subsidy comparisons labelled as descriptive associations.
4. Country-level volatility with both USD/L standard deviation and CV.
5. A data-quality and definition note covering units, repeated weekly observations, and the source's own tax/subsidy definitions.

## Audience takeaway

- **Policy:** use these results to identify differences that warrant investigation, not to claim policy effects.
- **Supply chain:** use price levels and absolute weekly movement to prioritize further exposure analysis; join route and consumption information before estimating cost risk.
- **Research:** report grain, coverage, weighting, and definitions, and control for country and time before making stronger claims.

## Source

[Global Fuel Prices 2020–2026, Kaggle](https://www.kaggle.com/datasets/belbino/global-fuel-prices-20202026). Dataset license is recorded as CC0 in `DATA_NOTES.md`.
