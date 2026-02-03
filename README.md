# Quran API (Toon Format)

This repository provides comprehensive Quranic data including text, translations, recitations (word-timing), tafsirs, tajweed, and mutashabihat in the high-performance `.toon` format. Optimized for **Page-Based Fetching** (Mushaf Pages 1-604) and CDN delivery.

## 📚 Documentation

Detailed documentation for each resource type:

*   **[Architecture: Why Page-Centered?](docs/architecture-decision.md)** (Read this first!)
*   **[Quran Text](docs/quran.md)** - Uthmani script & variants.
*   **[Translations](docs/translations.md)** - 40+ languages.
*   **[Tafsirs](docs/tafsirs.md)** - Exegesis & commentary.
*   **[Recitations (Timing)](docs/recitations.md)** - Audio synchronization data for 23 verified reciters.
*   **[Audio & Highlighting Guide](docs/audio_highlighting.md)** - Implementation guide for playback and sync.
*   **[Tajweed Rules](docs/tajweed.md)** - Dynamic text coloring.
*   **[Mutashabihat](docs/mutashabihat.md)** - Similar verse mapping for Hifz.

## 🏗 Project Structure

The data is organized by category, with a global index and individual indices for each category.

### 1. Global Index (`info.toon`)
The entry point for mapping the Quran:
*   **Surah Map:** ID, name, start/end pages, total verses, revelation type.
*   **Juz Map:** ID, start/end pages.
*   **Page Map:** Mapping of pages to Juz, Rukus, and Surah/Verse ranges.

### 2. Categories

| Category | Index File | Content Path | Description |
| :--- | :--- | :--- | :--- |
| **Quran** | `quran.toon` | `quran/pages/{1..604}.toon` | Script variants (e.g., Uthmani, Tajweed Glyphs). |
| **Translations** | `translations.toon` | `translations/{slug}/pages/{1..604}.toon` | 294+ translation editions in various languages. |
| **Tafsirs** | `tafsirs.toon` | `tafsirs/{slug}/pages/{1..604}.toon` | 45+ tafsir editions. |
| **Recitations** | `recitations.toon` | `recitations/{id}/pages/{1..604}.toon` | Word-by-word timing and segment data for 23 verified reciters. |
| **Tajweed** | `tajweed/pages/{1..604}.toon` | Tajweed rules and color coding mapping. |
| **Mutashabihat** | `mutashabihat/index.toon` | `mutashabihat/data.toon` | Similar verses mapping and cross-references. |

---

## 📄 File Schemas

Data files use the `.toon` format, a compact, human-readable structure.

### Quran Text (`quran/pages/{n}.toon`)
```toon
info:
  juz: 1
  rukus[size]{id,start_ayah}:
    ...

quran[size]{c,v,t}:
  1,1,"بِسْمِ ٱللَّهِ..."
```

### Recitation Segments (`recitations/{id}/pages/{n}.toon`)
```toon
segments[size]{c,v,segments,duration_ms,timestamp_from,timestamp_to}:
  1,1,"[[word_id,start,end],...]",2760,300,3060
```

### Tajweed Rules (`tajweed/pages/{n}.toon`)
```toon
tajweed[size]{c,v,rules}:
  1,1,[[rules[n]{s,e,r}:"],[start,end,"rule_name"],...]
```

### Mutashabihat (`mutashabihat/data.toon`)
Contains cross-references for similar verses:
```toon
[size]{id,src,refs}:
  "id","surah:verse:word_range","ref_surah:ref_verse:ref_word_range;..."
```

---

## 🚀 CDN Usage (jsDelivr)

Construct the path to any page content using the following pattern:
`https://cdn.jsdelivr.net/gh/{user}/{repo}@main/{category}/{slug}/pages/{page}.toon`

**Example (Uthmani Text, Page 1):**
`https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/quran/pages/1.toon`

**Example (English Translation, Sahih International, Page 1):**
`https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/translations/eng-abdelhaleem/pages/1.toon`

---

## 🛠 Features of Toon Format
1.  **Human Readable**: Structured and easy to inspect.
2.  **Highly Optimized**: Smaller footprint than JSON for repetitive Quranic data.
3.  **Page-Centric**: Designed for apps that render one Mushaf page at a time.
