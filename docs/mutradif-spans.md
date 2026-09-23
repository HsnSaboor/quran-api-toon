# Mutradif Spans (per-ayah, per-edition highlight index)

Page-sharded sidecar to `mutradif_{lang}.toon` (concept store, unchanged).
App fetches the spans page matching the active translation + Mushaf page —
same pattern as `quran/pages` and `translations/{slug}/pages`. Typical page
file is 4–12KB raw (~1–4KB compressed).

## Files

```
mutradif_spans.toon                        # index: 55 rows
mutradif_spans/{slug}/pages/{1..604}.toon  # 55 × 604 page files
```

Index schema:

```toon
mutradif_spans[55]{slug,lang,n_ayah,n_span,method,version}:
  spanish-garcia,es,6236,77429,"wbw-exact+difflib-transfer+proportional",1
```

Per-page schema (header count varies by page, e.g. `spans[7]` on page 1):

```toon
spans[7]{s,a,sp}:
  1,2,"[[1,1,""ٱلۡحَمۡدُ"",0,11,""Segala puji"",199,945],...]"
```

`sp` = JSON array of links `[ar0,ar1,aw,ts,te,tt,mid,wid]`:

| pos | rule |
|---|---|
| `ar0,ar1` | 1-based Arabic word index (inclusive) per `morphology/word_uthmani_and_roots.toon` |
| `aw` | Uthmani surface, verbatim |
| `ts,te` | 0-based end-exclusive char offsets into the edition's own verse text |
| `tt` | must equal `text[ts:te]` exactly |
| `mid,wid` | FK into `mutradif_{lang}.toon` (`mid` = group, `wid` = `id`); `0,0` = aligned, no concept hit |

## Method (no MT, no LLM, stdlib only)

Builder: `mutradif/build_spans.py` (flat per-slug `spans[6236]` intermediates)
then `mutradif/reshard_spans.py` (split into `pages/` via `quran/pages`
ayah→page map; flat files removed after).

1. Canonical edition per lang (same table as `docs/mutradif.md`, except
   hindi canon is `hindi-muhammad-farooq-khan`): anchor each Arabic word to a
   translation token via `wbw_translations/{lang}.json` hints
   (exact-token match, `|`-split + whitespace variants for zh; `\r\n`
   stripped for fa). Unanchored words split the gap proportionally.
2. Non-canonical editions: `difflib` token alignment transfers canonical
   anchors, then same proportional partition.
3. `mid,wid`: ayah-scoped `mutradif_{lang}.toon` rows whose `ay` contains
   `s:a`, matched on normalized root/`w`; global fallback requires full
   root/`w` equality (no short-substring). Else `0,0`.
4. Full coverage: every Arabic word gets exactly one span
   (`len(sp) == morphology word count`), except `hindi-taqi-usmani`
   (partial translation: surahs 1–52:46 only; 1455 ayahs empty `[]`).

## Edge cases

- `spanish-noor-turkish`: meta `lang=turkish` (Spanish text); mapped to `es`.
- Footnote editions (`{1}`, `,1:[...]`): offsets computed on the `t` text
  column only.
- `hindi-taqi-usmani` shards use `(file, seq)` chunk keys with per-surah
  basmalas, one `1:7` split (merged), truncation at 52:46. Resolved by
  positional walk in `_load_hindi_taqi()` — verified end to end.

## Verification

- All 55 × 604 page files: header count matches rows; union = 6236 rows/slug.
- 4.25M links total; `tt == text[ts:te]` holds on all sampled + fully
  scanned editions; `ar` within morphology bounds; no newlines in `tt`.
- `~34%` of links carry `mid,wid > 0`.

## App usage

```javascript
// fetch alongside the visible page (same page number as quran + translation)
const [arabic, translation, spans] = await Promise.all([
  fetch(`${BASE}/quran/pages/${page}.toon`),
  fetch(`${BASE}/translations/${slug}/pages/${page}.toon`),
  fetch(`${BASE}/mutradif_spans/${slug}/pages/${page}.toon`),
]);
// spans file: `spans[N]{s,a,sp}:` — one row per ayah on the page.
// Each link: [ar0,ar1,aw,ts,te,tt,mid,wid]; highlight text.slice(ts,te);
// if mid>0, look up wid in mutradif_{lang}.toon for the definition.
```
