# `.toon` Format Specification

## Overview

The `.toon` format is a custom, compact data format optimized for Quranic data delivery via CDN. It serves as a higher-density alternative to JSON, achieving **50-82% size reduction** by eliminating repetitive key names through a schema header approach.

## Core Concepts

### Schema Header

Instead of repeating field names for every row (as JSON does), `.toon` declares the structure once:

```toon
{name}[{row_count}]{field1,field2,field3}:
  {val1},{val2},"{val3}"
  {val1},{val2},"{val3}"
```

- **`{name}`**: Table/collection name (e.g., `quran`, `tafsir`, `segments`)
- **`[{row_count}]`**: Optional count of rows (for validation)
- **`{field1,field2,field3}`**: Comma-separated field names
- **Data rows**: CSV-like with values following the column order

### Data Type Representation

| Type | Example | Description |
|------|---------|-------------|
| Integer | `1`, `42`, `604` | Unquoted numbers |
| String | `"text here"` | Double-quoted strings |
| Nested array | `"[[1,0,960],[2,970,1420]]"` | JSON-stringified arrays within strings |
| Nested object | `{"perfect": "سَمّٰى", ...}` | JSON-stringified objects within strings |
| Boolean | `true`, `false` | Unquoted boolean values |

### Metadata Blocks

YAML-like metadata at the top of files:

```toon
meta:
  description: "Index of Quran Text Editions"
  type: "recitations"
  format: "word-segments"

info:
  juz: 1
  rukus[{size}]{id,start_ayah}:
    1,1:1
```

## File Structure Patterns

### Flat Table (most common)
```toon
quran[{size}]{c,v,t}:
  1,1,"بِسْمِ ٱللَّهِ..."
  1,2,"ٱلْحَمْدُ لِلَّهِ..."
```

### Index Files (root .toon files)
```toon
translations[{size}]{no,id,name,author,lang,script,dir,path,has_footnotes}:
  1,eng-abdelhaleem,"Abdel Haleem","M.A.S. Abdel Haleem",english,Latin,ltr,"translations/eng-abdelhaleem",false
```

### Mixed Structure (page files)
```toon
info:
  juz: 1
  rukus[{size}]{id,start_ayah}:
    {id},{surah}:{verse}

quran[{size}]{c,v,t}:
  {surah},{verse},"{text}"
```

## Optimizations

### Why Not JSON?

| Aspect | JSON | Toon | Savings |
|--------|------|------|---------|
| Per-row overhead | `{"c":1,"v":1,"t":"text"}` | `1,1,"text"` | ~70% |
| Repeat keys | Every row repeats field names | Once in header | Significant |
| Nested timestamps | `[{"w":1,"s":0,"e":960},...]` | `"[[1,0,960],...]"` | ~77% |
| Tajweed rules | `[{"s":7,"e":8,"r":"ham_wasl"},...]` | `"[[7,8,"ham_wasl"],...]"` | ~82% |

### Compression-Friendly

- Predictable, repetitive structure compresses well with gzip/brotli
- CDN layer handles compression transparently
- Typical page file sizes: 2-10KB compressed

## Parsing Guide

### JavaScript (browser/Node)
```javascript
function parseToon(text) {
  const lines = text.trim().split('\n');
  const result = {};
  let currentTable = null;
  let currentMeta = null;

  for (const line of lines) {
    if (line.startsWith('  ')) {
      // Data row
      if (currentTable) {
        const values = parseValues(line.trim());
        currentTable.data.push(values);
      }
    } else if (line.includes('[') && line.includes('{')) {
      // Schema header
      const match = line.match(/(\w+)\[(\d*)\]\{([^}]+)\}:/);
      if (match) {
        const [, name, count, fields] = match;
        currentTable = {
          name,
          fields: fields.split(',').map(f => f.trim()),
          data: []
        };
        result[name] = currentTable;
      }
    } else if (line.includes(':')) {
      // Metadata
      const [key, ...rest] = line.split(':');
      const val = rest.join(':').trim();
      result[key.trim()] = val;
    }
  }

  return result;
}
```

### Reference Implementation
A production-ready parser is available in the repository. The parsing logic is intentionally simple — split on commas for flat data, parse nested arrays with `JSON.parse()`, and treat the schema header as column definitions.
