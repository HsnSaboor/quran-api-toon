# Mutradifat al-Quran (Synonym Differentiation) Documentation

## Overview

The `mutradif` resource provides comprehensive, detailed differentiation of near-synonyms (*mutradifat*) in the Holy Quran. It explains subtle semantic, grammatical, and theological distinctions between Arabic words that appear synonymous in conventional dictionaries but carry precise, distinct meanings in their divine Quranic contexts.

Each entry includes:
- The exact Quranic Arabic word (`w`) and its triliteral root (`aw`).
- Conceptual synonym category (`hw`) and group ID (`mid`).
- Detailed linguistic explanation (`d`), enriched with authentic, published Quranic translations and citations.
- Concise summary definition (`s`), embedded with the exact vocabulary (`[word]`) used by published Quran translators.
- All Quranic verse cross-references (`ay`) and occurrence frequency (`ta`).
- **Companion resource**: [Mutradif Spans](mutradif-spans.md) — per-ayah,
  per-edition highlight offsets (`mutradif_spans/{slug}/pages/{page}.toon`,
  55 editions × 604 pages, 9 langs) linking translation substrings back to
  these concept entries via `mid`/`wid`.

---

## Statistics

- **Languages**: 12 (`bn`, `de`, `en`, `es`, `fa`, `fr`, `hi`, `id`, `ru`, `tr`, `ur`, `zh`)
- **Total entries**: Exactly 3,006 rows per language (Sparse IDs up to 3,021)
- **Synonym Groups**: 652 distinct thematic categories
- **Canonical Master**: `mutradif/mutradif_ur.toon`

---

## Canonical Quran Translations Used for Enrichment

| Code | Language | Canonical Translation Edition | Translation Folder Slug |
|------|----------|-------------------------------|-------------------------|
| `ur` | Urdu | Fateh Muhammad Jalandhari | `urdu-jalandhari` |
| `en` | English | Saheeh International | `english-saheeh-international` |
| `fa` | Persian | Naser Makarem Shirazi | `persian-nasermakaremshi` |
| `hi` | Hindi | Muhammad Farooq Khan & Ahmad | `hindi-muhammad-farooq-khan` |
| `bn` | Bengali | Muhiuddin Khan | `bengali-muhiuddin-khan` |
| `tr` | Turkish | Diyanet İşleri Başkanlığı | `turkish-diyanet` |
| `fr` | French | Muhammad Hamidullah | `french-muhammad-hamidullah` |
| `es` | Spanish | Muhammad Isa García | `spanish-garcia` |
| `de` | German | Frank Bubenheim & Nadeem Elyas | `german-frank-bubenheim-and-nadeem` |
| `id` | Indonesian | King Fahd Quran Complex / Sabiq | `indonesian-sabiq` |
| `ru` | Russian | Elmir Kuliev | `russian-kuliev` |
| `zh` | Chinese | Ma Jain (马坚) | `chinese-ma-jain` |

---

## Directory Structure

```
mutradif/
├── mutradif_ar.toon  # Arabic
├── mutradif_bn.toon  # Bengali
├── mutradif_de.toon  # German
├── mutradif_en.toon  # English
├── mutradif_es.toon  # Spanish
├── mutradif_fa.toon  # Persian
├── mutradif_fr.toon  # French
├── mutradif_hi.toon  # Hindi
├── mutradif_id.toon  # Indonesian
├── mutradif_ru.toon  # Russian
├── mutradif_tr.toon  # Turkish
├── mutradif_ur.toon  # Urdu (Master)
└── mutradif_zh.toon  # Chinese
```

---

## File Header & Schema

All files adhere strictly to single-line TOON CSV format with escaped newlines (`\n`):

```toon
mutradif[3006]{id,mid,a,w,d,s,hw,aw,ay,ta}:
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Unique identifier for each synonym entry (1 to 3021, 3,006 total rows) |
| `mid` | Integer | Synonym group ID (1 to 652; entries sharing `mid` belong to the same concept) |
| `a` | String | Alphabetical section letter (e.g. `ا` in Arabic/Urdu/Persian, `A` in Latin/Cyrillic) |
| `w` | String | Main Arabic word in question (identical across all 12 languages) |
| `d` | String | Detailed linguistic differentiation and cited Quranic verses with authentic translations |
| `s` | String | Short summary definition, prefixed with `«w»` and exact translator vocabulary `[term]` |
| `hw` | String | Headword / category concept in target language (e.g., `The moon`, `Planning`, `Deeds`) |
| `aw` | String | Arabic root of the word (e.g. `هلل`, `قمر`, `دبر`) |
| `ay` | String | Hyphen-delimited list of all Quranic verse citations (`surah:ayah-surah:ayah-...`) |
| `ta` | Integer | Total frequency count of occurrences in the Quranic text |

---

## CDN Distribution

Access any language directly via jsDelivr CDN:

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/mutradif/mutradif_{lang}.toon
```

Where `{lang}` is one of: `bn`, `de`, `en`, `es`, `fa`, `fr`, `hi`, `id`, `ru`, `tr`, `ur`, `zh` (12 languages).

---

## JavaScript Usage Example

```javascript
// Fetch English Mutradif data
const res = await fetch('https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/mutradif/mutradif_en.toon');
const text = await res.text();

// Parse TOON lines
const lines = text.trim().split('\n').slice(1);
const entries = lines.map(line => {
  // Parse standard CSV row
  const cols = line.slice(1, -1).split('","');
  return {
    id: cols[0],
    mid: cols[1],
    letter: cols[2],
    word: cols[3],
    details: cols[4].replace(/\\n/g, '\n'),
    summary: cols[5],
    category: cols[6],
    root: cols[7],
    verses: cols[8].split('-'),
    totalOccurrences: parseInt(cols[9])
  };
});

// Group by category (hw)
const categories = {};
for (const item of entries) {
  if (!categories[item.category]) categories[item.category] = [];
  categories[item.category].push(item);
}

// Find synonyms for "The moon"
console.log(categories["The moon"]);
```
