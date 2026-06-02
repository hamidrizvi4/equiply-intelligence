# 🏥 Equiply Asset Intelligence Dashboard

[![Watch the Demo](https://img.shields.io/badge/Watch_Video_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://drive.google.com/drive/folders/1GtMtYanCg6fBusDjvAkYHbdCA0rG3TpG?usp=sharing)

> **Equiply Hiring Tournament - Optimal Tier Submission**  
> A React-powered Enterprise Asset Management (EAM) dashboard that transforms raw, unformatted hospital equipment CSVs into actionable, real-time lifecycle intelligence.

## 🚀 The Challenge vs. The Solution

**The Problem:** Hospitals frequently struggle with "dirty" or incomplete data. For this challenge, we were provided a CSV with basic equipment records (Manufacturer, Model, Serial Number) and asked to enrich it with `manufactured_date` and `device_type`. 

**The Solution:** Rather than just outputting a new CSV, we built a comprehensive, privacy-first (100% client-side) data pipeline and dashboard. Because no external API was provided, we engineered a custom heuristic extraction engine to derive the missing data points directly from embedded manufacturer patterns.

## ✨ Enterprise Features

* **Heuristic Data Extraction Pipeline:** 
  * **Regex Date Parsing:** Automatically extracts embedded YYYY/MM dates hidden within proprietary serial number formats across 50+ medical brands.
  * **Domain Classification:** Uses a custom medical dictionary to instantly map generic models (e.g., "ZOLL RSERIES") to standard EAM categories (e.g., "Defibrillator").
* **Predictive Lifecycle Engine:** Calculates the age of every asset and flags equipment as 🟢 Good, 🟡 Warning, or 🔴 Critical based on specific device-type lifespans.
* **Data Confidence Scoring:** Automatically flags rows that require manual auditing if serial number extraction falls back to default logic.
* **Interactive EAM Dashboard:** Built with Tailwind CSS and hand-crafted SVG visualizations (zero charting dependencies). Includes advanced filtering, search, and real-time KPI generation (Total Assets, Data Health, Critical Replacements).
* **One-Click Export:** Strips application-specific UI metadata and exports a clean, enriched CSV perfectly formatted for the "Minimum Submission" tier requirements.

## 🧠 How the Data Pipeline Works (The Logic)

Because we could not rely on external databases, we built a robust pattern-matching engine in `dataPipeline.js`:

1. **Direct Numeric Decoding:** Identifies serials like `130402317` and extracts Year (`13` -> 2013) and Month (`04`).
2. **Prefix Block Decoding:** Strips leading factory codes (e.g., `RTS1402...` or `CS1704F`) to isolate the YYMM manufacturing block.
3. **Graceful Degradation:** If a serial number is completely unreadable, the pipeline assigns a placeholder date to prevent application crashes, but drops the row's `confidenceScore` to 30%, visually flagging it on the dashboard for human review.

## 🛠️ Tech Stack

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS (Custom Light Mode Theme)
* **Data Parsing:** PapaParse (Fast, in-browser CSV processing)
* **Data Visualization:** Custom SVG charts (no external charting library)
* **Icons:** Lucide-React

## 💻 Running the Project Locally

To run this dashboard on your local machine:

1. **Clone the repository:**
```bash
   git clone https://github.com/YOUR-USERNAME/equiply-asset-intelligence.git
   cd equiply-asset-intelligence
```
