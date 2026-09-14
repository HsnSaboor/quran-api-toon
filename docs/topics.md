# Quranic Topics Index Documentation

## Overview

The `topics` resource provides a categorized index of Quran verses organized by topic. Each entry maps a topic name to all the verses that reference it, making it useful for topical study, sermon preparation, and thematic Quran browsing.

## Statistics

- **Languages**: 13 (ar, bn, de, en, es, fa, fr, hi, id, ru, tr, ur, zh)
- **Topics per Language**: ~4,610–4,665 comprehensive native topics (fully synchronized across all 13 languages, with 100% of all 6,216 verses covered)
- **Format**: JSON within `.toon` files (pure native localized keys, zero English contamination in non-English files)

## Structure

```
topics/topics-{lang}.toon
```

Each file is a `.toon` file containing a JSON object with native topic entries.

## Schema (Pure Native)

```json
{
  "NativeTopicName": {
    "n": "Topic name in native language",
    "v": ["surah:verse", "surah:verse", ...],
    "r": 0
  }
}
```

| Field | Description |
|-------|-------------|
| `Key` | Topic name in native language (e.g. `"الأعلى"` in Arabic, `"اعلیٰ"` in Urdu, `"Patience"` in English) |
| `n` | Topic name in native language (matches key) |
| `v` | Array of verse references (as `"surah:verse"` strings) |
| `r` | Parent topic ID (`0` = root topic) |

## CDN Usage

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/topics/topics-{lang}.toon
```

## Usage Examples

**Find all verses for a topic in Arabic:**
```javascript
const res = await fetch(`https://cdn.../topics/topics-ar.toon`);
const data = await res.json();

const topic = data['الصبر'];
console.log(topic.n); // "الصبر"
console.log(topic.v); // ["2:153", "2:155", "2:177", "3:200", ...]

// Fetch all verses for this topic
const versePromises = topic.v.map(ref => {
  const [s, v] = ref.split(':');
  const page = /* calculate page from s,v using info.toon */;
  return fetch(`.../quran/pages/${page}.toon`);
});
```

**Find all verses for a topic in English:**
```javascript
const res = await fetch(`https://cdn.../topics/topics-en.toon`);
const data = await res.json();

const topic = data['Patience'];
console.log(topic.n); // "Patience"
console.log(topic.v); // ["2:153", "2:155", "2:177", "3:200", ...]
```

**Search topics by native keyword:**
```javascript
const query = 'رحمة';
const results = Object.entries(data)
  .filter(([key, t]) => key.includes(query) || t.n.includes(query));
console.log(results.map(([k]) => k));
```

## Performance

- **Single file per language** — each file is ~850KB-1MB of compact single-line JSON.
- **In-memory lookup** — the entire dataset fits easily in memory for fast search.
- **JSON native format** — no custom `toon` parser needed; use `JSON.parse()` directly.
