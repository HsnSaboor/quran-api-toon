# Transliteration Documentation

## Overview

The `transliteration` resource provides 4 distinct transliteration schemes covering all 6,236 verses of the Quran. Each scheme uses `|` as a word separator within the verse text. No index file is needed — the data files live directly in the directory.

## The 4 Schemes

| File | Style | Example (1:1) | Use Case |
|------|-------|---------------|----------|
| `normal.toon` | Standard phonetic | `bis'mi\|al-lahi\|al-rahmani\|al-rahimi` | General reading, search |
| `syllables.toon` | Syllable breakdown | `Bis-mil-\|la-hir-\|Rah-maa-nir-\|Ra-heem` | Recitation learning |
| `simple_tajweed.toon` | Tajweed-friendly | `Bismil\|laahir\|Rahmaanir\|Raheem` | Beginners |
| `advance_tajweed.toon` | Full tajweed with diacritics | `Bismil\|lahir\|Rahmaanir\|Ra-heem` | Advanced learners |

## Structure

```
transliteration/normal.toon
transliteration/syllables.toon
transliteration/simple_tajweed.toon
transliteration/advance_tajweed.toon
```

## Schema

All schemes share the same flat structure — CSV lines with `{chapter},{verse},"{text}"`:

```toon
{chapter},{verse},"{word1}|{word2}|{word3}|..."
```

There is no schema header line; the format is implicitly `{c},{v},{transliteration}`.

## CDN Usage

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/transliteration/{scheme}.toon
```

## Usage Examples

**Search across transliteration:**
```javascript
const data = await fetch('https://cdn.../transliteration/normal.toon');
const text = await data.text();

// Split lines, find verses containing "rahman"
const lines = text.trim().split('\n');
const matches = lines.filter(l => l.includes('rahman'));
```

**Render side-by-side with Arabic:**
```javascript
const [arabicPage, translitData] = await Promise.all([
  fetch('.../quran/pages/1.toon').then(r => r.text()),
  fetch('.../transliteration/advance_tajweed.toon').then(r => r.text()),
]);

const arabic = parseToon(arabicPage);
const translitLines = translitData.trim().split('\n');

arabic.quran.forEach((verse, i) => {
  const [c, v, arabicText] = verse;
  const tLine = translitLines.find(l => l.startsWith(`${c},${v},`));
  const [, , translit] = tLine.match(/^(\d+,\d+),"(.+)"$/);
  renderBilingual(arabicText, translit);
});
```

## Notes

- **Word boundaries** are marked with `|` — split on this character for word-level rendering.
- **Some schemes use special Unicode characters** (e.g., `ʻ`, `̣`, `̃`) for precise phonetics.
- The files are **6236 lines each** (one per verse), making them suitable for full in-memory loading (~300KB per scheme).
