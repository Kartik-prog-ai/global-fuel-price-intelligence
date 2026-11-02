# Data preparation

From the project root, with Python 3.9 or newer, run:

    python scripts/prepare_data.py --input data/raw/kaggle_download/global_fuel_prices_2020_2026.csv
    python scripts/analyze_data.py
    python scripts/analyze_policy.py
    python scripts/analyze_volatility.py

The preparation script writes `data/processed/fuel_prices_cleaned.csv` and `data/processed/data_quality_report.json`. The analyses write their corresponding JSON and Markdown summaries.

The preparation step reshapes the wide weekly source into one row per date, country, and fuel type. It records a SHA-256 fingerprint of the input, reports missing values and duplicate country-date keys, marks duplicate-key rows in `quality_flag`, and flags negative, zero, or non-numeric fuel prices. It does not impute missing values, drop duplicates, or remove outliers. Review the audit report before using the prepared table.
