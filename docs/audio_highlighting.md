# Audio Playback & Word Highlighting Guide

This guide explains how to implement "Karaoke-style" word highlighting using the `recitations` data from this API. The logic differs slightly depending on whether the reciter uses **Ayah-level** or **Surah-level** audio files.

## 1. Understanding the Data

### The Index (`recitations.toon`)
First, check the `audio_type` for your chosen reciter:
```toon
reciters[...]{id,name,audio_type,audio_base_url,audio_pattern}:
  1,"AbdulBaset","ayah","https://...","{S3}{A3}.mp3"
  14,"Al-Ajmy","surah","https://...","{S3}.mp3"
```
*   **`ayah`**: Each verse is a separate MP3 file (e.g., `001001.mp3`).
*   **`surah`**: Each chapter is a single MP3 file (e.g., `001.mp3`).

### The Segments (`recitations/{id}/pages/{n}.toon`)
```toon
segments[...]{c,v,segments,duration_ms,timestamp_from,timestamp_to}:
  1,1,"[[1,0,500],[2,500,1200]]",5000,0,5000
```
*   **`segments`**: JSON array of `[word_index, start_ms, end_ms]`.
    *   **Important**: These timestamps are relative to the **start of the verse**.
*   **`timestamp_from` / `timestamp_to`**: The start and end time of this verse within the audio file.

---

## 2. Implementation Logic

### Scenario A: Ayah-Level Audio (e.g., Mishary, Husary)
In this mode, you play a separate file for each verse.

1.  **Construct URL**: Use the `audio_pattern` (e.g., `001001.mp3`).
2.  **Play Audio**: Start the audio file from `0`.
3.  **Sync Logic**:
    *   Current Audio Time (`t`) = `audio.currentTime * 1000` (ms).
    *   Active Word: Find word where `t >= word.start_ms` AND `t <= word.end_ms`.

### Scenario B: Surah-Level Audio (e.g., Al-Ajmy, Sudais)
In this mode, you play one long file for the whole Surah.

1.  **Construct URL**: Use the `audio_pattern` (e.g., `001.mp3`).
2.  **Play Audio**: You might need to seek to `timestamp_from` if the user clicks a specific verse.
3.  **Sync Logic**:
    *   Current Audio Time (`t`) = `audio.currentTime * 1000` (ms).
    *   **Relative Time** (`rel_t`) = `t - verse.timestamp_from`.
    *   Active Word: Find word where `rel_t >= word.start_ms` AND `rel_t <= word.end_ms`.

---

## 3. Code Example (JavaScript)

Here is a robust function to handle both cases.

```javascript
/**
 * Determines the active word based on current playback time.
 *
 * @param {number} currentAudioTimeMs - Current playback position in milliseconds.
 * @param {string} audioType - 'ayah' or 'surah' (from reciter info).
 * @param {object} verseData - The segment object for the current verse.
 * @returns {number|null} - The active word index (1-based), or null.
 */
function getActiveWord(currentAudioTimeMs, audioType, verseData) {
  // 1. Check if we are within the verse boundaries
  if (audioType === 'surah') {
    if (currentAudioTimeMs < verseData.timestamp_from || currentAudioTimeMs > verseData.timestamp_to) {
      return null; // Not in this verse
    }
  }

  // 2. Calculate relative time
  let relativeTime = currentAudioTimeMs;
  if (audioType === 'surah') {
    relativeTime = currentAudioTimeMs - verseData.timestamp_from;
  }

  // 3. Parse segments (if string)
  const segments = typeof verseData.segments === 'string'
    ? JSON.parse(verseData.segments)
    : verseData.segments;

  // 4. Find the matching word
  // Segment format: [word_index, start_ms, end_ms]
  const match = segments.find(seg =>
    relativeTime >= seg[1] && relativeTime <= seg[2]
  );

  return match ? match[0] : null;
}
```

### Usage Example

```javascript
// Assume we have loaded:
// 1. reciterInfo (from recitations.toon)
// 2. pageData (from recitations/1/pages/1.toon)

const audio = new Audio(audioUrl);

audio.ontimeupdate = () => {
  const timeMs = audio.currentTime * 1000;

  // For Surah-level, we first need to find which verse we are in
  let currentVerse = pageData.segments.find(v =>
    timeMs >= v.timestamp_from && timeMs <= v.timestamp_to
  );

  // For Ayah-level, currentVerse is just the one currently playing

  if (currentVerse) {
    const wordIdx = getActiveWord(timeMs, reciterInfo.audio_type, currentVerse);
    if (wordIdx) {
      highlightWord(currentVerse.c, currentVerse.v, wordIdx);
    }
  }
};
```

## 4. Handling Edge Cases

1.  **Offset/Latency**: Browsers may have slight audio latency. You might need to add a small offset (e.g., `+100ms`) to `timeMs` if highlighting feels late.
2.  **Empty Segments**: Some verses might have empty segments (e.g., `[]`). Handle this gracefully.
3.  **Basmalah**: In Surah-level audio, the Basmalah (Verse 1) is usually included at the start of every Surah (except Tawbah). Ensure your logic accounts for the `timestamp_from` of Verse 1 starting at 0.
