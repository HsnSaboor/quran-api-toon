# Quran Text Documentation

## Overview
The `quran` resource provides the Arabic text of the Holy Quran. It is optimized for the Uthmani script (Madani) but can support other script variants (e.g., Indopak, Tajweed Glyphs) using the same structure.

## Structure
Files are located at: `quran/pages/{1..604}.toon`

Each file represents exactly one page of the Madani Mushaf.

## Schema
```toon
info:
  juz: {int}                    # The Juz number this page belongs to
  rukus[{size}]{id,start_ayah}: # List of Ruku boundaries on this page
    {id},{surah_id}:{ayah_num}

quran[{size}]{c,v,t}:           # The text content
  {surah_id},{ayah_num},{text}
```

## Usage Example (Frontend)

To render Page 1 (Al-Fatiha):

```javascript
// Fetch the page data
const response = await fetch('https://cdn.../quran/pages/1.toon');
const data = parseToon(await response.text());

// Render verses
data.quran.forEach(verse => {
  const [chapter, verseNum, text] = verse;
  console.log(`${chapter}:${verseNum} - ${text}`);
});

// Check if a new Ruku starts here
if (data.info.rukus.length > 0) {
   showRukuMarker(data.info.rukus[0]);
}
```

## Performance & Savings
*   **JSON vs Toon**: JSON requires repeating key names (`{"chapter": 1, "verse": 1, "text": "..."}`) for every single verse. Toon uses a schema header `quran[{size}]{c,v,t}` and then just raw CSV-like data lines.
*   **Savings**: ~50-60% size reduction compared to verbose JSON.
*   **Parsing**: Faster parsing than JSON because the structure is flat and predictable.
