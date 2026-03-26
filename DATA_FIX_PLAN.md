# Data Quality Fix Plan

## Summary

Two critical data quality issues identified:

---

## Issue 1: Translation Footnote Format Problems

### Affected: 40 translations with `has_footnotes=true`

### Problems Found:
| Problem | Details |
|---------|---------|
| Ghost footnotes in pages/*.toon | `footnotes:1:1` instead of `footnotes:1:actual content` |
| Header mismatch | pages/*.toon has `{c,v,t,f}`, pages.toon has `{c,v,t}` |
| Format inconsistency | Some inline, some separate-line footnotes |

### Root Cause:
- Individual page files were generated incorrectly
- The footnote content extraction failed, keeping only numeric markers
- `pages.toon` has correct data (source of truth)

### Fix Required:
1. Parse `pages.toon` for correct footnote content
2. Regenerate all `pages/*.toon` files with proper:
   - Header: `quran[N]{c,v,t,f}:`
   - Format: Inline footnotes `footnotes:N:content`
3. Affected translations: english-hilali-khan, english-saheeh-international, and 38 others

---

## Issue 2: Mutradif Data Quality Problems

### Affected: mutradif_en.toon and all translated mutradif files

### Problems Found:
| Problem | Details |
|---------|---------|
| Wrong `hw` (headword) | All entries in a group share same hw regardless of meaning |
| Wrong `a` (Arabic) | Contains "آ", "م" instead of actual Arabic words like "اَسْکَنَ" |
| Untranslated content | English file has Urdu text in h, s, d fields |
| Group mismatch | Translated files don't align with mutradif_arabic_base.toon |
| Missing entries | Non-sequential IDs (1,2,3,4,7,8... missing 5,6) |

### Example - "Merciful" Entry:
```
Expected: "رَحْمَان - رَحِیْم" with detailed explanation
Actual:   "a": "م", "h": "مہربان" (Urdu!), "d": Urdu text
```

### Root Cause:
- Translation process grouped by letter index instead of Arabic word
- Automation duplicated hw values within groups
- Incomplete translation left Urdu content
- Schema mismatch between base and translations

### Fix Required:
1. Map Arabic base entries to translated entries
2. Populate `a` field with actual Arabic words from base
3. Generate correct `hw` per entry
4. Translate untranslated content
5. Re-align groups with base file

---

## Implementation Priority

### High Priority (Immediate):
1. Fix footnote content in translations (40 translations)
2. Fix mutradif `a` and `hw` fields

### Medium Priority:
1. Standardize footnote format across all translations
2. Translate untranslated mutradif content

### Low Priority:
1. Validate all entries against source
2. Add missing entries

---

## Files to Fix

### Translations (40):
- english-hilali-khan
- english-saheeh-international
- urdu-usmani
- urdu-tafheem-ul-quran
- urdu-junagarhi
- (and 35 others with has_footnotes=true)

### Mutradif:
- mutradif/mutradif_en.toon (CRITICAL)
- mutradif/mutradif_ur.toon
- mutradif/mutradif_ar.toon
- All other language mutradif files

---

## Next Steps

1. Create fix script for translation footnotes
2. Create fix script for mutradif data
3. Run fixes
4. Validate results
5. Commit changes
