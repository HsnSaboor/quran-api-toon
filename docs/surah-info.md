# Surah Info Documentation

## Overview

The `surah` resource provides detailed introductions and background information for each of the 114 surahs (chapters) of the Quran. Each entry includes the historical context, period of revelation, naming reason, and central theme. Content is HTML-formatted for rich rendering.

## Statistics

- **Languages**: 16 (ar, bn, de, en, es, fa, fr, hi, id, it, ml, ru, ta, tr, ur, zh)
- **Surahs per language**: 114
- **Fields per surah**: `id`, `text` (long HTML intro), `short_text` (abbreviated description)

## Structure

- **Index**: `surah.toon` — lists available languages and UI labels
- **Data**: `surah/{lang}.toon` — one file per language

## Schema

**Index File (`surah.toon`):**
```toon
languages[16]{id,name}:
  "en","English"
  "ar","Arabic"
  ...

labels[4]{key,bn}:
  "go-to-surah","সূরায় যান"
  "makkah","মক্কা"
```

**Data File (`surah/{lang}.toon`):**
```toon
surah_info[114]{id,text,short_text}:
  1,"<h2>Name</h2><p>This Surah is named Al-Fatihah...</p>","Short summary..."
  2,"<h2>Name</h2><p>Al-Baqarah (The Cow)...</p>","Short summary..."
```

## CDN Usage

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/surah/{lang}.toon
```

## Usage Examples

**Fetch surah introductions for a chapter:**
```javascript
const lang = 'en';
const res = await fetch(`https://cdn.../surah/${lang}.toon`);
const data = parseToon(await res.text());

// Get intro for Surah Al-Fatihah (id: 1)
const fatihah = data.surah_info.find(s => s[0] === 1);
document.getElementById('surah-intro').innerHTML = fatihah[1];
```

**Use with page-based navigation:**
```javascript
const info = parseToon(await fetch('info.toon'));

// User is on page 5 → find which surah
const surahOnPage = info.surahs.find(s =>
  pageNum >= s.start_page && pageNum <= s.end_page
);

// Load the corresponding surah intro
const surahData = parseToon(await fetch(`.../surah/en.toon`));
const intro = surahData.surah_info.find(s => s[0] === surahOnPage.id);
```

## Performance

- **Single file per language** — the entire dataset for all 114 surahs is at most ~300KB (compressed ~50KB).
- **Cache-friendly** — surah intros change rarely. Cache aggressively.
- **HTML-formatted** — render directly without additional markup processing.
