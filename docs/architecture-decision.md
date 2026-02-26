# Architecture Decision: Page-Centered Data

## Context

In previous versions of Quran APIs (and indeed most APIs), data was typically served in one of the following granularities:
*   **Surah-level:** `/surah/1` (Good for reading a chapter, bad for large ones like Al-Baqarah)
*   **Ayah-level:** `/ayah/1` (Too many requests for a full page)
*   **Juz-level:** `/juz/1` (Often too large payload)

The physical Mushaf (Quran book), however, is standardized around the **Madani script layout**, which consists of **604 pages**.

## The Problem

1.  **Frontend Complexity:** Developers building Quran apps (Mushaf apps) almost always render the Quran page-by-page. Mapping a "Surah" endpoint to a "Page" view is complex because a page can contain parts of multiple Surahs, or a Surah can span many pages.
2.  **Over-fetching:** Fetching `Surah Al-Baqarah` (286 verses) just to render Page 2 (verses 1-5) is a waste of bandwidth.
3.  **Synchronization:** When playing audio, highlighting words, or showing Tafsir, you need data exactly for the currently visible page. Stitching this together from Surah-based APIs is error-prone.

## The Solution: Page-Centered `.toon` Files

We reorganized **ALL** 6 resources (Quran, Translations, Tafsirs, Tajweed, Recitations, Mutashabihat) into exactly 604 files each, corresponding 1-to-1 with the Madani Mushaf pages.

### Key Advantages

1.  **Zero-Logic Fetching**:
    *   User is on Page 5? Fetch `quran/pages/5.toon`, `translations/en/pages/5.toon`, `tajweed/pages/5.toon`.
    *   No need to calculate "Which verses are on page 5?". The file *is* the page.

2.  **Perfect Caching**:
    *   Pages never change. Once a user downloads `page/5.toon`, it can be cached forever.
    *   Surah files are large and evicted from cache more often.

3.  **Predictable Performance**:
    *   Every file is roughly the same size (1 Mushaf page of content).
    *   No massive spikes when loading long Surahs vs short ones.

4.  **Instant Audio Sync**:
    *   Audio files for pages are often split by page. Having the timing data (`recitations/pages/X.toon`) match the audio file boundaries perfects synchronization.

### Data Savings (Comparison)

| Resource Type | JSON Size (Est.) | Toon Size (Avg) | Reduction |
| :--- | :--- | :--- | :--- |
| **Quran Text** | ~2.4MB | ~1.1MB | **~54%** |
| **Recitation (Timings)** | ~18MB | ~4MB | **~77%** |
| **Tajweed Rules** | ~4.5MB | ~800KB | **~82%** |

*Note: Stats based on repository analysis of raw text vs structured JSON overhead.*
