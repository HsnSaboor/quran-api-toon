# Duas (Hisnul Muslim Supplications) Documentation

## Overview

The `duas` resource provides the complete Hisnul Muslim (Fortress of the Muslim) collection of daily supplications and remembrances. Each category includes the supplication title, associated audio URL, and (in the `duas/` subdirectory) detailed supplication content.

## Statistics

- **Languages**: 16 (ar, bn, bs, en, es, fa, ha, hi, id, pt, so, sw, th, ur, yo, zh)
- **Categories**: 132 supplication categories
- **Audio**: 397 Opus recordings — 131 category-level + 266 individual-dua files
- **Word timestamps**: 396 `.wbw.json` files (265 individual + 131 category), one per audio file

## Structure

```
duas/duas/husn_{lang}.toon     — supplication data files
duas/dua_audio/                 — audio + word-timing directory
  <stem>.opus                   — audio (individual `<id>.opus`, category `ar_7esn_AlMoslem_by_Doors_*.opus`)
  <stem>.wbw.json               — word-level timestamps for the matching .opus
duas/convert_duas_to_toon.py    — conversion scripts
duas/translate_*.py             — translation utilities
```

## Word Timestamps (`.wbw.json`)

Each `<stem>.wbw.json` sits next to its `<stem>.opus` and holds one record
per word, with `start`/`end` in seconds:

```json
[{ "word": "يَقُولُ", "start": 6.36, "end": 6.72,
   "is_repeat": false, "is_title": false, "low_confidence": false,
   "avg_logprob": -0.40, "min_decision_margin": 3.30,
   "letters": [{ "char": "ي", "start": 6.36, "end": 6.36,
                 "phonemes": [{ "phoneme": "يَ", "start": 6.36, "end": 6.36 }] }] }]
```

| Field | Description |
|-------|-------------|
| `word`/`start`/`end` | Word text and its time span in the audio (seconds) |
| `is_repeat` | Word is a detected repeat of the previous wording |
| `is_title` | Word belongs to a spoken category-title intro, not the dua text |
| `low_confidence` | Alignment confidence below threshold (timing still usable) |
| `letters` | Per-character spans, each with nested per-phoneme timings |

Category files (`ar_7esn_AlMoslem_by_Doors_*.wbw.json`) concatenate their
member duas in file order; unspoken gap leaders between members are
deliberately untranscribed, so word timings skip over those gaps.

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/duas/dua_audio/22.wbw.json
```

## Schema

**Data File (`duas/duas/husn_{lang}.toon`):**
```toon
meta:
  language: "English"

categories[132]{id,title,audio_url}:
  27,"Words of remembrance for morning and evening","https://cdn.jsdelivr.net/gh/.../ar_7esn_AlMoslem_by_Doors_028.opus"
  28,"What to say before sleeping","https://cdn.jsdelivr.net/gh/.../ar_7esn_AlMoslem_by_Doors_029.opus"
```

Each category has:
| Field | Description |
|-------|-------------|
| `id` | Category number (1-132) |
| `title` | Category title in the specified language |
| `audio_url` | URL to the audio recording for this category |

## CDN Usage

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/duas/duas/husn_{lang}.toon
```

## Usage Examples

**Display supplication categories:**
```javascript
const lang = 'en';
const res = await fetch(`https://cdn.../duas/duas/husn_${lang}.toon`);
const data = parseToon(await res.text());

data.categories.forEach(([id, title, audioUrl]) => {
  renderCategory(id, title, audioUrl);
});
```

**Play audio for a supplication:**
```javascript
// Find morning/evening remembrance (category 27)
const morning = data.categories.find(c => c[0] === 27);
const audio = new Audio(morning[2]);
audio.play();
```

**Word-highlighted playback for a dua:**
```javascript
const wbw = await fetch(`https://cdn.../duas/dua_audio/22.wbw.json`).then(r => r.json());
const audio = new Audio('https://cdn.../duas/dua_audio/22.opus');
audio.ontimeupdate = () => {
  const t = audio.currentTime;
  const active = wbw.find(w => t >= w.start && t <= w.end);
  highlight(active);
};
```

## Notes

- The `dua_audio/` directory contains `.opus` audio files: individual duas are named by id (e.g., `22.opus`), categories by Doors number (e.g., `ar_7esn_AlMoslem_by_Doors_028.opus`). Each has a matching `.wbw.json` with word timings.
- Translation scripts in `duas/` can be used to add new languages.
- The supplication content (text of each dua) is embedded in the language-specific files beyond the category listing.
