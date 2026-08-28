# Quickstart Guide

## In 30 Seconds

```javascript
// 1. Load the index
const info = parseToon(await (await fetch(
  'https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/info.toon'
)).text());

// 2. Fetch page 1 (Al-Fatiha) in Arabic + English
const [arabic, english] = await Promise.all(
  ['quran', 'translations/eng-abdelhaleem'].map(cat =>
    fetch(`https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/${cat}/pages/1.toon`)
      .then(r => r.text())
  )
);
```

## Step-by-Step

### 1. Get the navigation index
`info.toon` maps surahs, juz, and pages:
```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/info.toon
```

### 2. Fetch a page of Quran text
Pages are numbered 1-604 matching the Madani Mushaf:
```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/quran/pages/{page}.toon
```

### 3. Add a translation
Find the slug from `translations.toon`, then:
```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/translations/{slug}/pages/{page}.toon
```

### 4. Add audio sync
Find the reciter ID from `recitations.toon`, then:
```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/recitations/{id}/pages/{page}.toon
```

### 5. Add tajweed coloring
```
https://cdn.jsdelivr.net/gh/saboor/quran-api-toon@main/tajweed/pages/{page}.toon
```

## Architecture Decision

**Why page-centered data?**
- Zero-logic fetching: want page 5? Fetch `*/pages/5.toon`
- Perfect caching: pages never change
- Predictable performance: every file is a page-sized chunk
- Audio sync: timing data aligns with audio file boundaries

Read the full rationale: [Architecture Decision](architecture-decision.md)

## Recipes

### Mushaf Reader
```javascript
async function renderPage(pageNum, translationSlug) {
  const paths = [
    `quran/pages/${pageNum}.toon`,
    `translations/${translationSlug}/pages/${pageNum}.toon`,
    `tajweed/pages/${pageNum}.toon`,
  ];

  const [quran, translation, tajweed] = await Promise.all(
    paths.map(p => fetch(`${BASE}/${p}`).then(r => r.text()))
  );

  const quranData = parseToon(quran);
  const transData = parseToon(translation);
  const tajweedData = parseToon(tajweed);

  // Render each verse
  quranData.quran.forEach(([chapter, verseNum, arabicText], i) => {
    const englishText = transData.quran[i]?.[2];
    const rules = JSON.parse(tajweedData.tajweed[i]?.[2] || '[]');
    renderVerse({ chapter, verseNum, arabicText, englishText, tajweedRules: rules });
  });
}
```

### Audio Player with Word Highlighting
```javascript
async function playVerse(surah, verse, reciterId) {
  const reciterInfo = findReciter(reciterId); // from recitations.toon
  const audioUrl = buildAudioUrl(reciterInfo, surah, verse);
  const page = getPageForVerse(surah, verse); // from info.toon
  const timingData = await fetchTiming(reciterId, page);

  const audio = new Audio(audioUrl);
  audio.ontimeupdate = () => highlightActiveWord(audio.currentTime * 1000, timingData);
  audio.play();
}
```

### Search-Friendly Transliteration
```javascript
// Load full transliteration for search
const translit = await fetch(
  'https://cdn.../transliteration/normal.toon'
).then(r => r.text());

const results = translit.split('\n').filter(line =>
  line.toLowerCase().includes('rahman')
);
```

## Need Help?

- **Browse all docs**: start at [README.md](../README.md)
- **Data issues**: check [DATA_FIX_PLAN.md](../DATA_FIX_PLAN.md)
- **Footnotes**: see [FOOTNOTE_ANALYSIS.md](../FOOTNOTE_ANALYSIS.md)
