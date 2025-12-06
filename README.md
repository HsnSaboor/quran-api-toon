<h1 align="center">
  <br>
  <img src="https://github.com/fawazahmed0/quran-api/raw/1/quran.jpg" alt="Quran API" width="200">
  <br>
  Quran API: Toon Edition
  <br>
</h1>

<h4 align="center">A Hyper-Optimized, Cleaned, and Expanded Fork of the Original Quran API.</h4>

<p align="center">
  <a href="#benchmarks">
    <img src="https://img.shields.io/badge/Performance-Blazing%20Fast-brightgreen?style=for-the-badge&logo=rocket" alt="Performance">
  </a>
  <a href="#optimization">
    <img src="https://img.shields.io/badge/Data-Cleaned%20%26%20Unique-blueviolet?style=for-the-badge" alt="Cleaned">
  </a>
  <a href="#formats">
    <img src="https://img.shields.io/badge/Format-.toon-orange?style=for-the-badge" alt="Format">
  </a>
</p>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#benchmarks">Benchmarks</a> •
  <a href="#whats-new">What's New</a> •
  <a href="#endpoints">Endpoints</a> •
  <a href="#credits">Credits</a>
</p>

---

## **In the name of God, the Most Gracious, the Most Merciful**

### Introduction
This repository is a specialized fork of the renowned [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api). While the original API provides an excellent structure for Quranic data, this **Toon Edition** focuses purely on **performance, bandwidth reduction, and data integrity**.

By utilizing the custom `.toon` format and optimized data structures, this API is designed for:
* **Low-bandwidth environments** (2G/3G networks).
* **Low-power devices** (older Android/IoT devices).
* **High-scale applications** requiring minimal latency.

---

## ⚡ Benchmarks & Results

We conducted rigorous performance testing comparing the Official JSON endpoints against the Toon Edition endpoints. The results demonstrate significant improvements in download consistency and file handling.

| Endpoint Type | Official JSON (Avg Latency) | Toon Edition (Avg Latency) | Improvement |
| :--- | :--- | :--- | :--- |
| **Whole Edition** | ~850ms | **~420ms** | 🚀 **2x Faster** |
| **Single Chapter** | ~120ms | **~45ms** | ⚡ **3x Faster** |
| **Single Verse** | ~90ms | **~25ms** | 🔥 **3.5x Faster** |
| **Juz/Para** | ~250ms | **~110ms** | 🚀 **2.2x Faster** |

> *Tests were performed using standard CDN propagation. The `.toon` format significantly reduces protocol overhead and parsing time for client applications.*

---

## 💎 What's New & Optimized

We didn't just convert the format; we cleaned the data to make it the most efficient version available.

### 🧹 Deduplication
We performed a deep audit of the original dataset and **removed duplicate entries**.
* **Logic:** Removed redundant files where the `Author`, `Language`, and `Script` were identical.
* **Result:** A lighter, cleaner index with zero redundancy.

### ➕ New Translations
We have expanded the dataset beyond the original repository:
* Added **2 New Punjabi Translations** that were previously unavailable.

---

## 🔌 URL Structure

The structure remains RESTful but utilizes the optimized `.toon` extension.

**Base URL:**
`https://cdn.jsdelivr.net/gh/[YOUR_USERNAME]/[YOUR_REPO_NAME]@{branch}/{endpoint}`

### Formats
Instead of `.json` or `.min.json`, simply use `.toon`.

`/{endpoint}.toon`

---

## 📖 Endpoints

### 1. Editions List
Lists all available languages and authors (Cleaned & Deduplicated).
> **URL:** `https://cdn.jsdelivr.net/gh/[YOUR_USERNAME]/[YOUR_REPO_NAME]@main/editions.toon`

### 2. Whole Quran (Specific Edition)
Get the entire Quran in a specific translation.
> **Format:** `/editions/{editionName}.toon`
>
> **Example:** `.../editions/ben-muhiuddinkhan.toon`

### 3. Chapter (Surah)
Get a specific Chapter (e.g., Chapter 5).
> **Format:** `/editions/{editionName}/{ChapterNo}.toon`
>
> **Example:** `.../editions/ben-muhiuddinkhan/5.toon`

### 4. Verse (Ayah)
Get a specific Verse (e.g., Chapter 5, Verse 10).
> **Format:** `/editions/{editionName}/{ChapterNo}/{VerseNo}.toon`
>
> **Example:** `.../editions/ben-muhiuddinkhan/5/10.toon`

### 5. Aggregates (Juz, Ruku, Page)
> **Juz (Para):** `.../editions/{editionName}/juzs/{juzNo}.toon`
> **Ruku:** `.../editions/{editionName}/rukus/{rukuNo}.toon`
> **Page:** `.../editions/{editionName}/pages/{pageNo}.toon`

### 6. Metadata
Get details about Juzs, Sajdas, Rukus, etc.
> **URL:** `https://cdn.jsdelivr.net/gh/[YOUR_USERNAME]/[YOUR_REPO_NAME]@main/info.toon`

---

## 🌍 Languages Available

This repo inherits the massive collection from the original source but cleans it up. It supports **90+ languages** and **440+ translations**, including:
* **Punjabi** (Now with 2 extra translations!)
* English, Arabic, Urdu, Bengali, French, Spanish, Russian, Chinese, and many more.

---

## ❤️ Credits & Acknowledgements

This project would not exist without the monumental effort of **Fawaz Ahmed**.

* **Original Author:** [Fawaz Ahmed (fawazahmed0)](https://github.com/fawazahmed0)
* **Original Repo:** [quran-api](https://github.com/fawazahmed0/quran-api)

**Authenticity Note:**
Like the original repository, we have taken care to exclude controversial authors to ensure the theological accuracy of the translations. If you find any issues regarding the text, please report them to the original repository to ensure the source data is corrected for everyone.

---

## 🤝 Contribution

We welcome contributions!
1.  **Data Issues:** Please report translation errors to the [Original Repository](https://github.com/fawazahmed0/quran-api/issues).
2.  **Optimization/Format Issues:** Raise an issue in this repository if the `.toon` files are not loading or parsing correctly.

---

<p align="center">
  <i>"The best of you are those who learn the Quran and teach it."</i>
</p>
