# Mutashabihat Documentation

## Overview
The `mutashabihat` resource provides a mapping of "Mutashabihat" (similar/resembling verses) in the Quran. This is a valuable tool for Hifz (memorization) students to identify verses that are easily confused with others.

## Structure
*   **Index**: `mutashabihat/index.toon` (Metadata)
*   **Data**: `mutashabihat/data.toon` (The actual mappings)

## Schema (`data.toon`)
```toon
[size]{id,src,refs}:
  {id},"{surah}:{verse}:{word_range}","{ref_surah}:{ref_verse}:{ref_word_range};..."
```

*   **src**: The source location being queried (e.g., `2:5:1-3` meaning Surah 2, Verse 5, words 1 to 3).
*   **refs**: Semicolon-separated list of locations that resemble the source.

## Usage Example (Frontend)

Highlighting similarities while reading:

```javascript
// Load the dataset (it's small enough to load once for advanced apps)
const simData = await fetch('.../mutashabihat/data.toon');
const similarities = parseToon(await simData.text());

// When user renders Surah 2, Verse 5
const matches = similarities.filter(s => s.src.startsWith("2:5:"));

if (matches.length > 0) {
  showTooltip("This verse is similar to Surah 6:12...");
}
```

## Performance & Savings
*   **Compact References**: Uses a concise coordinate system (`S:V:W-W`) instead of repeating full text.
*   **Single File**: Unlike other resources split by page, Mutashabihat data is relational and often requires cross-referencing the whole Quran, so it is provided as a unified dataset (or index) for searchability.
