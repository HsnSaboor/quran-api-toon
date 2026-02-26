# Translations Documentation

## Overview
The `translations` resource provides meaning translations of the Quran in 100+ languages. Like the Quran text, these are segmented by Page (1-604) to allow perfect synchronized scrolling with the Mushaf.

## Statistics (Verified)
- **Total Translations**: 309
- **RTL (Right-to-Left)**: 41 (Arabic, Urdu, Persian, Hebrew, Divehi, Dari, Sindhi, Shahmukhi Panjabi, etc.)
- **LTR (Left-to-Right)**: 268 (English, Turkish, Indonesian, Urdu-Latin, etc.)

## Structure
Files are located at: `translations/{slug}/pages/{1..604}.toon`

*   `slug`: A unique identifier for the translation (e.g., `eng-abdelhaleem`, `urd-jalandhry`).
*   See `translations.toon` in the root for a full list of available translations.

## Schema
```toon
quran[{size}]{c,v,t,f}:
  {surah_id},{ayah_num},{translated_text},{footnote_text}
```

*Note: The `f` (footnote) column is optional and only present in high-quality translations.*

**Index File (`translations.toon`) Schema:**
```toon
translations[{size}]{no,id,name,author,lang,dir,path,has_footnotes}:
  {serial},{slug},{name},{author},{lang},{direction},{path},{has_footnotes_boolean}
```

*Note: The content file structure is identical to the Quran text file, making the parsing logic reusable.*

## Usage Example (Frontend)

To show English translation side-by-side with Arabic:

```javascript
const pageNum = 5;
const translationSlug = 'eng-abdelhaleem';

// Fetch parallel data
const [arabic, english] = await Promise.all([
  fetch(`.../quran/pages/${pageNum}.toon`).then(r => r.text()),
  fetch(`.../translations/${translationSlug}/pages/${pageNum}.toon`).then(r => r.text())
]);

const arabicData = parseToon(arabic);
const englishData = parseToon(english);

// Render combined
arabicData.quran.forEach((verse, index) => {
  // Since both files are page-aligned, index matches perfectly
  const translation = englishData.quran[index]; 
  
  renderVerse({
    arabic: verse[2],
    english: translation[2]
  });
});
```

## Direction Field (RTL/LTR)

The `dir` field in the index indicates text direction:
- `rtl`: Right-to-left scripts (Arabic, Urdu, Persian/Farsi, Hebrew, Divehi/Thaana, Dari, Sindhi, Shahmukhi Panjabi, etc.)
- `ltr`: Left-to-right scripts (English, Turkish, Indonesian, Malay, etc.)

**Note**: Some languages have both RTL and LTR variants:
- `urd-jalandhry` (Urdu in Nastaliq script) → `rtl`
- `urd-transliteration` (Urdu in Latin script) → `ltr`

Always check the `dir` field to render text correctly.

## Performance & Savings
*   **Zero-Overhead**: Since translation text can be long, removing JSON structural overhead (`{...}`) significantly reduces payload size.
*   **Lazy Loading**: You typically only need the translation for the *current page*. Fetching a 5MB "Full Quran Translation" JSON blob just to read 5 verses is inefficient. These files are typically 2-10KB per page.
