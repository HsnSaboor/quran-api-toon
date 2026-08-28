# Mutradifat al-Quran (Synonym Differentiation) Documentation

## Overview

The `mutradif` resource provides detailed differentiation of near-synonyms (mutradifat) in the Quran. It explains subtle semantic differences between Arabic words that may appear synonymous but carry distinct meanings in their Quranic context. Each entry includes the Arabic word, detailed explanation, verse references, and categorization.

## Statistics

- **Languages**: 6 (en, fa, fr, hi, tr, ur)
- **Total entries**: ~3,006 per language
- **Categories**: Populate/Settle, Hereafter, Human Being, Resurrection, and more

## Structure

```
mutradif/mutradif_en.toon
mutradif/mutradif_fa.toon
mutradif/mutradif_fr.toon
mutradif/mutradif_hi.toon
mutradif/mutradif_tr.toon
mutradif/mutradif_ur.toon
```

## Schema

```toon
mutradif[{size}]{id,mid,a,w,d,s,hw,aw,ay,ta}:
  {id},{group_id},"{part_of_speech}","{arabic_word}","{detailed_explanation}","{short_explanation}","{category}","{arabic_root}","{verse_references}",{count}
```

| Field | Description |
|-------|-------------|
| `id` | Unique entry identifier |
| `mid` | Category group ID (entries with same `mid` are related synonyms) |
| `a` | Part of speech: `P` (verb), `N` (noun), `H` (concept) |
| `w` | Arabic word in question |
| `d` | Detailed explanation (English for `_en`, native language for others) |
| `s` | Short/simplified explanation |
| `hw` | Heading word / category name |
| `aw` | Arabic root of the word |
| `ay` | Verse references (semicolon-separated `surah:verse` pairs) |
| `ta` | Total occurrence count in the Quran |

## CDN Usage

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/mutradif/mutradif_{lang}.toon
```

## Usage Examples

**Browse categories:**
```javascript
const data = await fetch('https://cdn.../mutradif/mutradif_en.toon');
const mutradif = parseToon(await data.text());

// Group by category
const categories = {};
mutradif.mutradif.forEach(entry => {
  const cat = entry[6]; // hw field
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(entry);
});

console.log(Object.keys(categories));
// ["Populate / Settle", "Hereafter", "Human Being", ...]
```

**Show word differentiation for a verse:**
```javascript
function getWordDifferentiation(surah, verse) {
  const ref = `${surah}:${verse}`;
  return mutradif.mutradif.filter(e =>
    e[7].split(';').some(r => r.startsWith(ref))
  );
}

// User hovers over verse 2:35
const diffs = getWordDifferentiation(2, 35);
diffs.forEach(d => {
  showTooltip(`
    <strong>${d[3]}</strong> (${d[5]})
    <p>${d[4]}</p>
  `);
});
```

## Performance

- **Single file per language** — ~500KB uncompressed, compresses well with gzip.
- **Load eagerly** — the dataset is small enough to keep in memory for instant lookups.
- **Indexed by group** — entries with the same `mid` are intended to be read together for comparison.
