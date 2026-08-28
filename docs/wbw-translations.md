# Word-by-Word Translations Documentation

## Overview

The `wbw_translations` resource provides word-by-word (WBW) translations of the Quran. Each word in every verse is translated individually, enabling features like word-by-word reading, vocabulary learning, and language study.

## Statistics

- **Languages**: 22
- **Languages included**: bn (Bengali), ce (Chechen), de (German), dv (Divehi), en (English), fa (Persian), fr (French), hi (Hindi), id (Indonesian), ml (Malayalam), ml_lalithasaram (Malayalam Lalithasaram), ru (Russian), sd (Sindhi), sign (Sign Language), sq (Albanian), ta (Tamil), tr (Turkish), ur (Urdu), zh_pinyin (Chinese Pinyin), zh_simplified (Simplified Chinese), zh_traditional (Traditional Chinese), zh_zhuyin (Chinese Zhuyin)

## Structure

```
wbw_translations/{lang}.json
```

All files are JSON format (not `.toon`) for simpler word-level array nesting.

## Schema

```json
{
  "{surah}": {
    "{verse}": [
      ["word1_translation", "word2_translation", ...],
      ["verse2_word1", "verse2_word2", ...]
    ]
  }
}
```

## CDN Usage

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/wbw_translations/{lang}.json
```

## Usage Examples

**Display word-by-word for a verse:**
```javascript
const lang = 'en';
const data = await fetch(`https://cdn.../wbw_translations/${lang}.json`);
const wbw = await data.json();

const surah = 1;
const verse = 1;
const wordTranslations = wbw[surah][verse];

// wordTranslations[0] = ["In (the) name", "(of) Allah", "the Most Gracious", "the Most Merciful"]
wordTranslations[0].forEach((translation, idx) => {
  console.log(`Word ${idx + 1}: ${translation}`);
});
```

**Align with Arabic words for a karaoke reader:**
```javascript
const [arabicPage, wbwData] = await Promise.all([
  fetch('.../quran/pages/1.toon').then(r => r.text()),
  fetch('.../wbw_translations/en.json').then(r => r.json()),
]);

const arabic = parseToon(arabicPage);

// Page 1 has verses from surah 1
arabic.quran.forEach(([c, v, arabicText]) => {
  const words = arabicText.split(' ');
  const translations = wbwData[c]?.[v]?.[0] || [];

  words.forEach((word, idx) => {
    const meaning = translations[idx] || '';
    renderWordWithTooltip(word, meaning);
  });
});
```

## Performance

- **Single file per language** — typically 100-500KB uncompressed.
- **JSON format** chosen for native array support — no custom parser needed.
- Load eagerly for the full dataset or lazy-load verse-by-verse by constructing the lookup path.
