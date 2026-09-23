# CDN Usage Guide

## Overview

All data in this repository is designed for direct consumption via CDN. The recommended CDN is [jsDelivr](https://www.jsdelivr.com/), which provides global edge caching, automatic compression, and version pinning.

## Base URL Pattern

```
https://cdn.jsdelivr.net/gh/{user}/{repo}@{version}/{path}
```

For this repository:

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/{path}
```

## Version Strategies

### `@main` (Always Latest)
```http
GET /gh/saboor/quran-api-toon@main/info.toon
```
Use during development. Data reflects the latest commit on the main branch. Note: CDN propagation may take a few minutes after a commit.

### `@commit-hash` (Pinned)
```http
GET /gh/saboor/quran-api-toon@a1b2c3d4e5/info.toon
```
Pin to a specific commit for production. Ensures deterministic behavior.

### `@release-tag`
```http
GET /gh/saboor/quran-api-toon@v1.0.0/info.toon
```
Use tagged releases. Check the [releases page](https://github.com/saboorsohaib/quran-api-toon/releases) for available tags.

## Category Paths

| Resource | Path Pattern | Index File |
|----------|-------------|------------|
| **Info** | `info.toon` | — |
| **Quran Text** | `quran/pages/{page}.toon` | `quran.toon` |
| **Translations** | `translations/{slug}/pages/{page}.toon` | `translations.toon` |
| **Tafsirs** | `tafsirs/{slug}/pages/{page}.toon` | `tafsirs.toon` |
| **Recitations** | `recitations/{id}/pages/{page}.toon` | `recitations.toon` |
| **Surah Info** | `surah/{lang}.toon` | `surah.toon` |
| **Tajweed** | `tajweed/pages/{page}.toon` | — |
| **Mutashabihat** | `mutashabihat/{index,data}.toon` | — |
| **Transliteration** | `transliteration/{scheme}.toon` | — |
| **WBW Translations** | `wbw_translations/{lang}.json` | — |
| **Morphology** | `morphology/{dataset}.toon` | — |
| **Mutradif** | `mutradif/mutradif_{lang}.toon` | — |
| **Mutradif Spans** | `mutradif_spans/{slug}/pages/{page}.toon` | `mutradif_spans.toon` |
| **Topics** | `topics/topics-{lang}.toon` | — |
| **Duas** | `duas/duas/husn_{lang}.toon` | — |

## Usage Examples

### Fetch Quran text, translation, and mutradif spans for page 1
```javascript
const [arabic, translation, spans] = await Promise.all([
  fetch('https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/quran/pages/1.toon'),
  fetch('https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/translations/spanish-garcia/pages/1.toon'),
  fetch('https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/mutradif_spans/spanish-garcia/pages/1.toon'),
]);
// spans file: `spans[N]{s,a,sp}:` — one row per ayah on the page.
// Each link: [ar0,ar1,aw,ts,te,tt,mid,wid]; highlight text.slice(ts,te);
// if mid>0, look up wid in mutradif_{lang}.toon for the definition.
```

### Fetch recitation timing and audio
```javascript
const timing = await fetch(
  'https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/recitations/1/pages/1.toon'
);

const audioUrl = 'https://cdn.jsdelivr.net/gh/zaibihsn/recitation-all@abdul-basit-abdul-samad-mujawwad-hafs-949/001001.opus';
```

## Compression

jsDelivr applies **gzip/brotli compression** automatically based on the `Accept-Encoding` header. The `.toon` format's repetitive structure compresses exceptionally well:

| Resource | Raw Size | Compressed (est.) |
|----------|----------|-------------------|
| Quran page | ~5KB | ~1.5KB |
| Translation page | ~8KB | ~2.5KB |
| Tafsir page | ~12KB | ~3KB |
| Recitation page | ~7KB | ~2KB |

## Best Practices

1. **Load info.toon once** at app startup — it's the navigation backbone.
2. **Lazy-load page data** — fetch `quran/pages/{n}.toon` only when the user navigates to page `n`.
3. **Use `Promise.all`** for parallel fetches (e.g., Arabic + translation + tajweed for the same page).
4. **Cache aggressively** — page data is immutable; set `Cache-Control: max-age=31536000`.
5. **Pin in production** — use a specific commit hash or release tag to prevent breaking changes.
6. **Batch index files** — load index files (`translations.toon`, `tafsirs.toon`) once and cache.
