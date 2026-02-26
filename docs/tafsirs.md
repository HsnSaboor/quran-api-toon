# Tafsirs Documentation

## Overview
The `tafsirs` resource provides exegesis (detailed explanation) of the Quran verses. This includes famous works like Ibn Kathir, Jalalayn, and Tabari.

## Statistics (Verified)
- **Total Tafsirs**: 90
- **RTL (Right-to-Left)**: 64 (Arabic, Urdu, Persian, etc.)
- **LTR (Left-to-Right)**: 26 (English, Turkish, Indonesian, etc.)

## Structure
Files are located at: `tafsirs/{slug}/pages/{1..604}.toon`

*   `slug`: A unique identifier for the tafsir (e.g., `arabic_tafsir_ibn_kathir`, `english_tafsir_jalalayn`).
*   See `tafsirs.toon` in the root for a full list.

## Schema
```toon
tafsir[{size}]{c,v,t}:
  {surah_id},{ayah_num},{tafsir_text_html}
```

**Index File (`tafsirs.toon`) Schema:**
```toon
tafsirs[{size}]{no,id,name,author,lang,dir,path}:
  {serial},{slug},{name},{author},{lang},{direction},{path}
```

*Note: Tafsir text can be very long and now supports rich HTML formatting (headers, bolding, etc.) for better readability.*

## Direction Field (RTL/LTR)

The `dir` field in the index indicates text direction:
- `rtl`: Right-to-left scripts (Arabic, Urdu, Persian/Farsi, etc.)
- `ltr`: Left-to-right scripts (English, Turkish, Indonesian, etc.)

Always check the `dir` field to render tafsir text correctly.

## Usage Example (Frontend)

Displaying Tafsir for a specific verse on click:

```javascript
// User clicks on Verse 2:255 (Ayat al-Kursi) on Page 42
async function showTafsir(surah, verse, page) {
  const slug = 'en-ibn-kathir';
  
  // Check if we already have the page data
  if (!cache[page]) {
    const res = await fetch(`.../tafsirs/${slug}/pages/${page}.toon`);
    cache[page] = parseToon(await res.text());
  }

  // Find the specific verse in the page data
  const tafsirEntry = cache[page].tafsir.find(t => t[0] === surah && t[1] === verse);
  
  if (tafsirEntry) {
    modal.show(tafsirEntry[2]); // Display the text
  }
}
```

## Performance & Savings
*   **Massive Savings**: Tafsir files are text-heavy. Serving them by page ensures users only download the explanations relevant to what they are reading.
*   **Compression Friendly**: The repetitive nature of the keys (Surah/Verse numbers) is handled efficiently by the Toon header format, and the text body compresses well with Gzip/Brotli (handled by CDN).
