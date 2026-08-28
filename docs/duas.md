# Duas (Hisnul Muslim Supplications) Documentation

## Overview

The `duas` resource provides the complete Hisnul Muslim (Fortress of the Muslim) collection of daily supplications and remembrances. Each category includes the supplication title, associated audio URL, and (in the `duas/` subdirectory) detailed supplication content.

## Statistics

- **Languages**: 16 (ar, bn, bs, en, es, fa, ha, hi, id, pt, so, sw, th, ur, yo, zh)
- **Categories**: 132 supplication categories
- **Audio**: Category-level audio recordings in Opus format

## Structure

```
duas/duas/husn_{lang}.toon     — supplication data files
duas/dua_audio/                 — audio directory
duas/convert_duas_to_toon.py    — conversion scripts
duas/translate_*.py             — translation utilities
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

## Notes

- The `dua_audio/` directory contains `.opus` audio files named by category (e.g., `ar_7esn_AlMoslem_by_Doors_028.opus`).
- Translation scripts in `duas/` can be used to add new languages.
- The supplication content (text of each dua) is embedded in the language-specific files beyond the category listing.
