# Quran API (Toon Format)

A comprehensive, page-optimized Quran data repository delivering text, translations, tafsirs, recitation timing, tajweed, transliteration, morphology, and more — all split by Madani Mushaf page (1–604) for **zero-overhead fetching** and **perfect CDN caching**.

## Quick Start

```javascript
const BASE = 'https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main';

const info = await fetch(`${BASE}/info.toon`).then(r => r.text());
const page = await fetch(`${BASE}/quran/pages/1.toon`).then(r => r.text());
```

**Interpret the result**: `info.toon` maps surahs, juz, and pages. `quran/pages/1.toon` contains the Arabic text for page 1. See the [Quickstart](docs/quickstart.md) guide for a full walkthrough.

## Documentation

| # | Guide | What You'll Learn |
|---|-------|-------------------|
| 1 | [Quickstart](docs/quickstart.md) | Build your first app in under 30 seconds |
| 2 | [Architecture Decision](docs/architecture-decision.md) | Why page-centered data beats surah/ayah endpoints |
| 3 | [Global Index (`info.toon`)](docs/info-file.md) | Navigate surahs, juz, and pages |
| 4 | [`.toon` Format](docs/toon-format.md) | Understand the compact data format |
| 5 | [CDN Usage](docs/cdn-usage.md) | Patterns, versioning, and best practices |

### Data Resources

| # | Resource | Docs | Description |
|---|----------|------|-------------|
| 6 | **Quran Text** | [Guide](docs/quran.md) | Uthmani script, tajweed glyphs. 1 edition |
| 7 | **Translations** | [Guide](docs/translations.md) | **401 editions** in 100+ languages, 43 with footnotes |
| 8 | **Tafsirs** | [Guide](docs/tafsirs.md) | **176 exegesis editions** with HTML formatting |
| 9 | **Recitations** | [Guide](docs/recitations.md) | **24 reciters** — word-level timing & audio sync |
| 10 | **Reciters List** | [List](docs/reciters.md) | Full reciter table with IDs, styles, audio types |
| 11 | **Audio Highlighting** | [Guide](docs/audio_highlighting.md) | Implement karaoke-style word highlighting |
| 12 | **Surah Info** | [Guide](docs/surah-info.md) | **16 languages** — introductions & background |
| 13 | **Tajweed** | [Guide](docs/tajweed.md) | Rule-based coloring (ham_wasl, ghunnah, madda, etc.) |
| 14 | **Transliteration** | [Guide](docs/transliteration.md) | **4 schemes** — normal, syllables, simple/advanced tajweed |
| 15 | **Word-by-Word** | [Guide](docs/wbw-translations.md) | **22 languages** — per-word translations in JSON |
| 16 | **Morphology** | [Guide](docs/morphology.md) | Roots, verb conjugations, per-chapter analysis |
| 17 | **Mutashabihat** | [Guide](docs/mutashabihat.md) | Similar verses for Hifz memorization |
| 18 | **Mutradif** | [Guide](docs/mutradif.md) | Synonym differentiation (12 languages) |
| 19 | **Mutradif Spans** | [Guide](docs/mutradif-spans.md) | Per-ayah highlight spans, 55 editions × 604 pages (9 langs) |
| 19 | **Topics** | [Guide](docs/topics.md) | Quranic topics index (13 languages) |
| 20 | **Duas** | [Guide](docs/duas.md) | Hisnul Muslim supplications (16 languages, audio) |
| 21 | **Data Scripts** | [Guide](docs/data-scripts.md) | Python tooling for conversion & maintenance |

## Repository Structure

```
info.toon                          # Global index (surahs, juz, pages)
quran.toon                         # Quran editions index
quran/pages/{1..604}.toon          # Uthmani Arabic text
quran/tajweed_glyphs/{1..604}.toon # Tajweed glyph variant

translations.toon                  # Translation editions index
translations/{slug}/pages/{1..604}.toon  # 401 editions × 604 pages

tafsirs.toon                       # Tafsir editions index
tafsirs/{slug}/pages/{1..604}.toon # 176 editions × 604 pages

surah.toon                         # Surah info language index
surah/{lang}.toon                  # 114 surah intros per language

recitations.toon                   # Reciter index (24 reciters)
recitations/{id}/pages/{1..604}.toon   # Word timing data

tajweed/pages/{1..604}.toon        # Tajweed rule mapping

transliteration/{scheme}.toon      # 4 transliteration schemes
wbw_translations/{lang}.json       # 22 word-by-word translations

morphology/                        # 5 datasets + 114 word summaries
mutashabihat/                      # Similar verses index & data
mutradif/                          # Synonym differentiation (12 langs)
mutradif_spans/{slug}/pages/{1..604}.toon  # Per-ayah highlight spans (55 editions, 9 langs)
mutradif_spans.toon                # Spans index
topics/                            # Quranic topics (13 langs)
duas/                              # Hisnul Muslim (16 langs, audio)

info.toon                          # Navigation backbone
```

## Why `.toon`?

The `.toon` format achieves **50–82% smaller payloads** than JSON by declaring a schema once and writing compact CSV-like rows:

| Resource | JSON | Toon | Savings |
|----------|------|------|---------|
| Quran Text | ~2.4 MB | ~1.1 MB | 54% |
| Recitation Timings | ~18 MB | ~4 MB | 77% |
| Tajweed Rules | ~4.5 MB | ~800 KB | 82% |

**Why page-centered?** Every resource is split into exactly 604 files — one per Mushaf page. No over-fetching, no stitching logic, no massive JSON blobs. Fetch what's on screen, nothing more.

## CDN

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/{category}/{...}/pages/{page}.toon
```

Use `@main` for latest or pin to a [release](https://github.com/saboorsohaib/quran-api-toon/releases) for production.

## Integration Examples

- **Web (JS)**: [Quickstart](docs/quickstart.md) — fetch + parse + render
- **Audio Sync**: [Audio Highlighting](docs/audio_highlighting.md) — word-level karaoke
- **Mobile**: Direct CDN fetch + local `.toon` parser (written in ~50 lines)
- **Search**: Load transliteration + morphology for full-text search

## License

Data is provided for educational and reference purposes. Check individual source licenses for translation and tafsir content.
