# Verified Unified Reciters List (23 Reciters)

This list contains 23 reciters with **verified word-level timestamp data** (segments) available for high-quality audio playback and synchronized word highlighting.

| Norm ID | Internal ID | Reciter Name | Style | Source | Playback | Timestamp Type | Audio Base URL |
|:---:|:---:|:---|:---|:---|:---|:---|:---|
| **1** | 1 | AbdulBaset AbdulSamad | Mujawwad | Quran.com | Ayah | API (QDC) | `https://audio.qurancdn.com/AbdulBaset/Mujawwad/mp3/` |
| **2** | 2 | AbdulBaset AbdulSamad | Murattal | Quran.com | Ayah | API (QDC) | `https://audio.qurancdn.com/AbdulBaset/Murattal/mp3/` |
| **3** | 3 | Abdur-Rahman as-Sudais | Murattal | Quran.com | Ayah | API (QDC) | `https://audio.qurancdn.com/Sudais/mp3/` |
| **4** | 4 | Abu Bakr al-Shatri | Murattal | Quran.com | Ayah | API (QDC) | `https://audio.qurancdn.com/Shatri/mp3/` |
| **5** | 5 | Hani ar-Rifai | Murattal | Quran.com | Ayah | API (QDC) | `https://audio.qurancdn.com/Rifai/mp3/` |
| **6** | 6 | Mahmoud Khalil Al-Husary | Murattal | Quran.com | Ayah | API (QDC) | `https://mirrors.quranicaudio.com/everyayah/Husary_64kbps/` |
| **7** | 7 | Mishari Rashid al-`Afasy | Murattal | Quran.com | Ayah | API (QDC) | `https://audio.qurancdn.com/Alafasy/mp3/` |
| **8** | 8 | Mohamed Siddiq al-Minshawi | Mujawwad | Quran.com | Ayah | API (QDC) | `https://audio.qurancdn.com/Minshawi/Mujawwad/mp3/` |
| **9** | 9 | Mohamed Siddiq al-Minshawi | Murattal | Quran.com | Ayah | API (QDC) | `https://audio.qurancdn.com/Minshawi/Murattal/mp3/` |
| **10** | 10 | Sa'ud ash-Shuraim | Murattal | Quran.com | Ayah | API (QDC) | `https://audio.qurancdn.com/Shuraym/mp3/` |
| **11** | 11 | Mohammad al-Tablawi | Murattal | Quran.com | Ayah | API (QDC) | `https://audio.qurancdn.com/mirrors.quranicaudio.com/everyayah/Mohammad_al_Tablaway_128kbps/` |
| **12** | 12 | Mahmoud Khalil Al-Husary | Muallim | Quran.com | Ayah | API (QDC) | `https://mirrors.quranicaudio.com/everyayah/Husary_Muallim_128kbps/` |
| **13** | qul_471 | Ahmad Alnufais | Murattal | QUL Tarteel | Ayah | API (QUL) | `https://audio-cdn.tarteel.ai/quran/alnufais/` |
| **14** | 19 | Ahmed ibn Ali al-Ajmy (beta) | Murattal | QDC Beta | Surah | API (QDC) | `https://download.quranicaudio.com/quran/ahmed_ibn_3ali_al-3ajamy/` |
| **15** | 159 | Maher al-Muaiqly (beta) | Murattal | QDC Beta | Surah | API (QDC) | `https://download.quranicaudio.com/quran/maher_almu3aiqly/year1440/` |
| **16** | 160 | Bandar Baleela (beta) | Murattal | QDC Beta | Surah | API (QDC) | `https://download.quranicaudio.com/quran/bandar_baleela/complete/` |
| **17** | 174 | Yasser Ad Dussary (beta) | Murattal | QDC Beta | Surah | API (QDC) | `https://download.quranicaudio.com/qdc/yasser_ad-dussary/mp3/` |
| **18** | 175 | Abdullah Hamad Abu Sharida (beta) | Murattal | QDC Beta | Surah | API (QDC) | `https://download.quranicaudio.com/quran/abdullah_abu_sharida/` |
| **19** | 13 | Sa'ad al-Ghamdi | Murattal | Quran.com | Surah | API (QDC) | `https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete/` |
| **20** | 161 | Khalifah Al Tunaiji | Murattal | Quran.com | Surah | API (QDC) | `https://download.quranicaudio.com/qdc/khalifah_taniji/murattal/` |
| **21** | 168 | Mohamed Siddiq al-Minshawi (Kids) | Kids Repeat | Quran.com | Surah | API (QDC) | `https://download.quranicaudio.com/qdc/siddiq_minshawi/kids_repeat/` |
| **22** | qul_421 | Hady Toure | Murattal | QUL Tarteel | Surah | Local JSON | `https://download.quranicaudio.com/qdc/hadi_toure/mp3/` |
| **23** | qul_420 | Khalid Al-Jalil | Murattal | QUL Tarteel | Surah | Local JSON | `https://download.quranicaudio.com/qdc/khalid_jalil/murattal/mp3/` |

---

### 🛠️ Technical Implementation

#### 1. Audio Playback
- **Ayah Level (1-13):** Append `{SSSaaa}.mp3` (e.g., `001001.mp3`) to the Base URL.
- **Surah Level (14-23):** Append `{SSS}.mp3` (e.g., `001.mp3`) to the Base URL.

#### 2. Word-Level Highlighting (Segments)
All sources return segment data in the format: `[word_index, start_ms, end_ms]`.

- **Source: QDC API (Quran.com IDs):**
  - Endpoint: `https://quran.com/api/proxy/content/api/qdc/audio/reciters/{id}/audio_files?chapter={surah}&segments=true`
  - Field: `audio_files[0].verse_timings[].segments`

- **Source: QUL API (ID 13 / Ahmad Alnufais):**
  - Endpoint: `https://qul.tarteel.ai/api/v1/audio/ayah_segments/42?surah={surah}`
  - Internal Tarteel Resource ID is **42** for the Ayah-level recitation.

- **Source: Local JSON (IDs 22, 23):**
  - Path: `qul_reciters/{Internal_ID}/segments.json`
  - Required for Hady Toure and Khalid Al-Jalil as they are not available via public segment APIs.

#### 3. Highlighting Logic
Since segments are relative to the audio file:
- For **Surah-level files**, use the timestamps directly.
- For **Ayah-level files**, word timestamps are usually relative to the start of the Ayah file (0ms). If they are relative to the Surah, subtract the Ayah's `timestamp_from` value.
