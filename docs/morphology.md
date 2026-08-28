# Morphology Documentation

## Overview

The `morphology` resource provides detailed morphological analysis of Quranic words. It includes exact word forms, root derivations, verb conjugations, and per-chapter word summaries with grammatical analysis. This is a comprehensive resource for Arabic linguistics, Quranic studies, and advanced search features.

## Datasets

| File | Entries | Description |
|------|---------|-------------|
| `exact_words.toon` | 7,034 | Dictionary of every exact word form with occurrence references |
| `word_uthmani_and_roots.toon` | 77,430 | Every word occurrence with Uthmani text and triliteral root |
| `word_verbs.toon` | 41,543 | Verb conjugations (perfect, imperfect, imperative, participles, verbal noun) |
| `words_with_same_root.toon` | 1,652 | Root-based grouping of all word occurrences |
| `word_summaries/{1..114}.toon` | 114 files | Per-chapter grammatical summaries for each word |

## Schema

### `exact_words.toon`
```toon
exact_words:
  بِسۡمِ:["1:1:1", "11:41:4", "27:30:5"]
  ٱللَّهِ:["1:1:2", "2:23:17", ...]
```
Maps each unique word form to all its occurrences as `{surah}:{verse}:{word_index}`.

### `word_uthmani_and_roots.toon`
```toon
word_roots:
  1:1:1:["بِسۡمِ", "سمو"]
  1:1:2:["ٱللَّهِ", "اله"]
```
Every word occurrence mapped to its Uthmani text and 3-letter root.

### `word_verbs.toon`
```toon
word_verbs:
  1:1:1:{"perfect": "سَمّٰى", "imperfect": "يُسَمِّي", "imperative": "سَمِّ", ...}
  1:2:1:{"perfect": "حَمِدَ", "imperfect": "يَحْمَدُ", ...}
```
Verb conjugation data for words derived from verbs.

### `words_with_same_root.toon`
```toon
words_with_same_root:
  ابد:["2:95:3", "4:57:13", ...]
  ابل:["6:144:2", "88:17:4", ...]
```
Groups all word occurrences sharing the same triliteral root.

### `word_summaries/{chapter}.toon`
Per-chapter detailed HTML analysis for each word, including:
- Morphological segments
- Part of speech
- Grammatical case
- Root and English translation

## CDN Usage

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/morphology/{dataset}.toon
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/morphology/word_summaries/{chapter}.toon
```

## Usage Examples

**Find all occurrences of a word:**
```javascript
const data = await fetch('https://cdn.../morphology/exact_words.toon');
const text = await data.text();
const lines = text.split('\n');

// Find the word "رَحِيم"
const entry = lines.find(l => l.startsWith('  رَحِيم:'));
if (entry) {
  const [, refs] = entry.match(/"(.+)"/);
  const occurrences = JSON.parse(refs.replace(/'/g, '"'));
  // occurrences = ["1:1:4", "1:3:2", ...]
}
```

**Look up root for a specific word:**
```javascript
const data = await fetch('https://cdn.../morphology/word_uthmani_and_roots.toon');
const text = await data.text();
const lines = text.split('\n');

// Find word at 1:1:1
const entry = lines.find(l => l.startsWith('  1:1:1:'));
const [, word, root] = entry.match(/"(.+)",\s*"(.+)"/);
console.log(`Word: ${word}, Root: ${root}`);
```

**Get all words sharing a root:**
```javascript
const data = await fetch('https://cdn.../morphology/words_with_same_root.toon');
const text = await data.text();
const lines = text.split('\n');

const rootEntry = lines.find(l => l.startsWith('  رحم:'));
// Find all occurrences of words from root "رحم"
```

## Performance

- **Fixed datasets** — load once and cache for the lifetime of the app.
- **Small footprint** — the largest file (`word_uthmani_and_roots.toon`) is ~1.5MB uncompressed, heavily compressible with gzip.
- **Pre-computed** — all morphological analysis is pre-generated, no server-side computation needed.
