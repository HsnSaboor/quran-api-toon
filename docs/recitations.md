# Recitations (Timing) Documentation

## Overview
The `recitations` resource does not contain audio files (`.mp3`), but rather the **timing data** (segmentation) required to highlight words as the audio plays. This enables the "Karaoke" effect found in popular Quran apps.

## Structure
Files are located at: `recitations/{id}/pages/{1..604}.toon`

*   `id`: The reciter ID (e.g., `1` for Mishary Rashid Alafasy).
*   See `recitations.toon` in the root for the reciter map.

## Verified Reciters
The following 23 reciters have verified, complete word-level timing data:

| ID | Name | Style | Audio Type |
| :--- | :--- | :--- | :--- |
| 1 | AbdulBaset AbdulSamad | Mujawwad | Ayah |
| 2 | AbdulBaset AbdulSamad | Murattal | Ayah |
| 3 | Abdur-Rahman as-Sudais | Murattal | Ayah |
| 4 | Abu Bakr al-Shatri | Murattal | Ayah |
| 5 | Hani ar-Rifai | Murattal | Ayah |
| 6 | Mahmoud Khalil Al-Husary | Murattal | Ayah |
| 7 | Mishari Rashid al-`Afasy | Murattal | Ayah |
| 8 | Mohamed Siddiq al-Minshawi | Mujawwad | Ayah |
| 9 | Mohamed Siddiq al-Minshawi | Murattal | Ayah |
| 10 | Sa'ud ash-Shuraim | Murattal | Ayah |
| 11 | Mohammad al-Tablawi | Murattal | Ayah |
| 12 | Mahmoud Khalil Al-Husary | Muallim | Ayah |
| 13 | Ahmad Alnufais | Murattal | Ayah |
| 14 | Ahmed ibn Ali al-Ajmy | Murattal | Surah |
| 15 | Maher al-Muaiqly | Murattal | Surah |
| 16 | Bandar Baleela | Murattal | Surah |
| 17 | Yasser Ad Dussary | Murattal | Surah |
| 18 | Abdullah Hamad Abu Sharida | Murattal | Surah |
| 19 | Sa'ad al-Ghamdi | Murattal | Surah |
| 20 | Khalifah Al Tunaiji | Murattal | Surah |
| 21 | Mohamed Siddiq al-Minshawi (Kids) | Kids Repeat | Surah |
| 22 | Hady Toure | Murattal | Surah |
| 23 | Khalid Al-Jalil | Murattal | Surah |

## Schema
This schema is slightly more complex as it involves nested arrays for word-level timing.

```toon
segments[{size}]{c,v,segments,duration_ms,timestamp_from,timestamp_to}:
  {surah},{verse},"[[{word_idx},{start_ms},{end_ms}],...]",{duration},{start_total},{end_total}
```

**Index File (`recitations.toon`) Schema:**
```toon
reciters[{size}]{no,id,name,style,verses,audio_type,audio_base_url}:
  {serial},{id},{name},{style},{verses},{type},{url}
```

*   **segments**: A JSON-stringified array of `[word_index, start_time_ms, end_time_ms]`.
*   **timestamp_from/to**: The absolute timestamp in the audio file where this verse begins and ends.

## Usage Example (Frontend)

Highlighting words during playback:

```javascript
const audio = new Audio('https://.../mishary/001001.mp3');
const timingData = await fetchTiming(reciterId, pageId);

audio.ontimeupdate = () => {
  const currentMs = audio.currentTime * 1000;
  
  // Find current verse
  const activeVerse = timingData.segments.find(s => 
    currentMs >= s.timestamp_from && currentMs <= s.timestamp_to
  );

  if (activeVerse) {
    // Parse the inner segments string: "[[1,200,700],...]"
    const words = JSON.parse(activeVerse.segments);
    
    // Find active word
    const activeWord = words.find(w => 
      currentMs >= (activeVerse.timestamp_from + w[1]) && 
      currentMs <= (activeVerse.timestamp_from + w[2])
    );

    if (activeWord) {
      highlightWord(activeVerse.verse, activeWord[0]);
    }
  }
};
```

## Performance & Savings
*   **77% Reduction**: Storing this data in JSON is extremely verbose (`{"word": 1, "start": 200, "end": 700}, ...`). The Toon format compresses this into a compact array string `[[1,200,700],...]`.
*   **Fast Seek**: Because files are split by page, seeking to Page 200 only requires loading `pages/200.toon`. You don't need to parse a massive timestamp file for the whole Quran.
