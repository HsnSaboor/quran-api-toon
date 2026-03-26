# Footnote Analysis Report

## Executive Summary

After analyzing all 40 translations marked with `has_footnotes=true`, I found **critical issues** that need to be fixed:

---

## Issue 1: Ghost Footnote Content in Individual Page Files

### Description
The individual page files (`pages/*.toon`) have **incorrect/generic footnote content** instead of the actual footnote text.

### Example
**File:** `translations/english-hilali-khan/pages/1.toon`
```
  1,2,"...Lord{1}...{2}",footnotes:1:1,footnotes:2:2
```
The footnote content is just `1` and `2` instead of the actual text!

**File:** `translations/english-hilali-khan/pages.toon` (correct)
```
  1,2,"...Lord{1}...{2}",footnotes:1:[ (V.1:2 Lord: The actual word used in the Qur'ân is Rabb...]
```
This has the REAL footnote content.

### Affected Translations (40 total)
All 40 translations with `has_footnotes=true` have this issue in their individual page files.

---

## Issue 2: Header Format Inconsistency

### Description
There's a mismatch between individual page files and combined files:

| File Type | Header Format | f Column |
|-----------|---------------|----------|
| `pages/*.toon` | `quran[N]{c,v,t,f}:` | ✅ Present |
| `pages.toon` | `quran[N]{c,v,t}:` | ❌ Missing |

### Affected: 37 of 40 translations

---

## Issue 3: Footnote Format Inconsistency

### Two Different Formats Found

#### Format A: Inline (used in individual page files)
```
  1,2,"text{1}",footnotes:1:content
```

#### Format B: Separate Line (used in some pages.toon)
```
  1,2,"text{1}."
footnotes:1:content
```

### Translations using Format B (separate line) in pages.toon:
- spanish-garcia
- urdu-junagarhi
- urdu-tafheem-ul-quran
- urdu-usmani
- yoruba-aykyuni
- uzbek-mansour

---

## Root Cause

The individual page files (`pages/*.toon`) were generated from a source that:
1. Lost the actual footnote content
2. Replaced it with generic marker numbers

The `pages.toon` files have the correct data but:
1. Are gitignored (not tracked)
2. Have inconsistent header format (missing `f` column)
3. Some have different footnote format (separate lines)

---

## Proposed Fix Plan

### Option A: Regenerate from pages.toon (Recommended)

1. **Parse pages.toon files** (which have correct footnote content)
2. **Split into individual pages** (1.toon to 604.toon)
3. **Normalize format:**
   - Header: `quran[N]{c,v,t,f}:`
   - Inline footnotes: `footnotes:N:content`
4. **Regenerate all 40 translations**

### Option B: Fix headers only, keep structure

1. Update `pages.toon` headers to include `{c,v,t,f}:`
2. Convert separate-line footnotes to inline format
3. Individual pages are regenerated from corrected pages.toon

---

## Recommended Standard Format

### Header
```
quran[N]{c,v,t,f}:
```

### Verse with footnotes
```
  surah,ayah,"text{1} more text{2}",footnotes:1:First footnote,footnotes:2:Second footnote
```

### Verse without footnotes
```
  surah,ayah,"translation text"
```

---

## Translations Requiring Fix

All 40 translations with `has_footnotes=true`:

1. avar-magomedov
2. english-hilali-khan
3. french-maash
4. french-montada
5. hindi-azizul-haque
6. indonesian-islamic-affairs
7. indonesian-king-fahad
8. italian-piccardo
9. kannada-sheerazi
10. lithuanian-geda
11. macedonian-scholars
12. somali-yacoub
13. spanish-garcia
14. spanish-noor-turkish
15. urdu-junagarhi
16. urdu-tafheem-ul-quran
17. urdu-usmani
18. yoruba-aykyuni
19. uzbek-mansour
20. arabic-asseraj
21. dutch-center
22. english-saheeh-international
23. french-muhammad-hamidullah
24. hausa-gummi
25. indonesian-complex
26. japanese-saeedsato
27. kannada-abdussalam-puthige
28. kannada-hamza
29. lingala-zakaria
30. malayalam-kunhi
31. oromo-ababor
32. romanian-project
33. spanish-montada-latin
34. tagalog-rwwad
35. telugu-abdul-raheem
36. urdu-shaykh-al-hind-mahmud-al-hasan
37. yoruba-mikail
38. english-tafheem-ul-quran-simple
39. russian-awqaf-egypt
40. yao-silika-arabic-script
