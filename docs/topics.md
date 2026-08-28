# Quranic Topics Index Documentation

## Overview

The `topics` resource provides a categorized index of Quran verses organized by topic. Each entry maps a topic name to all the verses that reference it, making it useful for topical study, sermon preparation, and thematic Quran browsing.

## Statistics

- **Languages**: 13 (ar, bn, de, en, es, fa, fr, hi, id, ru, tr, ur, zh)
- **Format**: JSON-like structure within `.toon` files

## Structure

```
topics/topics-{lang}.toon
```

Each file is a `.toon` file containing a JSON object with topic entries.

## Schema

```json
{
  "TopicName": {
    "n": "Native name",
    "e": "English name",
    "v": ["surah:verse", "surah:verse", ...],
    "r": parent_topic_id
  }
}
```

| Field | Description |
|-------|-------------|
| `n` | Topic name in the native language |
| `e` | Topic name in English |
| `v` | Array of verse references (as `"surah:verse"` strings) |
| `r` | Parent topic ID for hierarchical grouping (`0` = root) |

## CDN Usage

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/topics/topics-{lang}.toon
```

## Usage Examples

**Find all verses for a topic:**
```javascript
const lang = 'en';
const res = await fetch(`https://cdn.../topics/topics-${lang}.toon`);

// Topics files are valid JSON within .toon
const data = await res.json();

const topic = data['Patience'];
console.log(topic.n); // "Sabr"
console.log(topic.e); // "Patience"
console.log(topic.v); // ["2:153", "2:155", "2:177", "3:200", ...]

// Fetch all verses for this topic
const versePromises = topic.v.map(ref => {
  const [s, v] = ref.split(':');
  const page = /* calculate page from s,v using info.toon */;
  return fetch(`.../quran/pages/${page}.toon`);
});
```

**Build a topic browser:**
```javascript
const topics = Object.entries(data)
  .filter(([_, t]) => t.r === 0) // root topics only
  .map(([key, t]) => ({
    key,
    name: t.n,
    english: t.e,
    childTopics: Object.entries(data)
      .filter(([_, ct]) => ct.r === key)
      .map(([ck, ct]) => ck)
  }));
```

**Search topics by keyword:**
```javascript
const query = 'mercy';
const results = Object.entries(data)
  .filter(([_, t]) =>
    t.n.toLowerCase().includes(query) ||
    t.e.toLowerCase().includes(query)
  );
console.log(results.map(([k]) => k));
```

## Performance

- **Single file per language** — each file is 100-500KB of compact JSON.
- **In-memory lookup** — the entire dataset fits easily in memory for fast search.
- **JSON native format** — no custom `toon` parser needed; use `JSON.parse()` directly.
