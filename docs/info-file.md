# Global Index (`info.toon`) Documentation

## Overview

`info.toon` is the entry point for navigating the entire Quran dataset. It provides three essential mappings that allow applications to translate between surah numbers, juz numbers, page numbers, and verse references without any server-side computation.

## Structure

**Location**: `info.toon` (root of repository)

## Schema

### Surahs Map (`surahs[114]`)

```toon
surahs[114]{id,name,en_name,start_page,end_page,total_verses,revelation}:
  1,"الفاتحة","Al-Fatiha",1,1,7,Meccan
  2,"البقرة","Al-Baqarah",2,49,286,Medinan
  ...
```

| Field | Description |
|-------|-------------|
| `id` | Surah number (1-114) |
| `name` | Arabic name |
| `en_name` | English transliteration |
| `start_page` | First Madani Mushaf page of this surah |
| `end_page` | Last Madani Mushaf page of this surah |
| `total_verses` | Total verses in the surah |
| `revelation` | `Meccan` or `Medinan` |

### Juz Map (`juzs[30]`)

```toon
juzs[30]{id,start_page,end_page}:
  1,1,21
  2,22,41
  ...
```

| Field | Description |
|-------|-------------|
| `id` | Juz number (1-30) |
| `start_page` | First page of this juz |
| `end_page` | Last page of this juz |

### Pages Map (`pages[604]`)

```toon
pages[604]{page,juz}:
  1,1
  2,1
  ...
```

| Field | Description |
|-------|-------------|
| `page` | Page number (1-604) |
| `juz` | Juz number this page belongs to |

## CDN Usage

```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/info.toon
```

## Usage Examples

### Lookup: Which page is Surah Yaseen on?
```javascript
const info = parseToon(await fetch('https://cdn.../info.toon'));
const yaseen = info.surahs.find(s => s[0] === 36);
// yaseen = [36, "يس", "Ya-Sin", 440, 445, 83, "Meccan"]
const pages = Array.from(
  { length: yaseen[4] - yaseen[3] + 1 },
  (_, i) => yaseen[3] + i
); // [440, 441, 442, 443, 444, 445]
```

### Lookup: Which juz is page 50 on?
```javascript
const pageInfo = info.pages.find(p => p[0] === 50);
// pageInfo = [50, 3]
const juzNum = pageInfo[1]; // 3
const juzInfo = info.juzs.find(j => j[0] === juzNum);
// juzInfo = [3, 42, 61]
```

### Lookup: Which surahs are on page 15?
```javascript
const surahsOnPage = info.surahs.filter(s =>
  s[3] <= 15 && s[4] >= 15
); // Surah 1 (Al-Fatiha, pages 1-1) and Surah 2 (Al-Baqarah, pages 2-49)
```

### Navigate to a specific verse
```javascript
function getPageForVerse(surah, verse) {
  // This is a simplified approximation; actual page boundaries
  // are stored in the surah information
  const surahInfo = info.surahs.find(s => s[0] === surah);
  if (!surahInfo) return null;

  const [, , , startPage, endPage, totalVerses] = surahInfo;
  const approxPage = startPage + Math.floor(
    (verse / totalVerses) * (endPage - startPage)
  );
  return Math.min(approxPage, endPage);
}
```

## Performance

- **Single small file** — ~8KB uncompressed, loads instantly.
- **Load on app startup** — cache permanently; this file never changes.
- **Navigation backbone** — every page, surah, juz, and verse lookup derives from this index.
