# Reciters

This API provides access to 23 verified reciters with audio playback support.

## Reciters List

| ID | Name | Style | Audio Type | Source |
|:---:|:---|:---|:---|:---|
| 1 | AbdulBaset AbdulSamad | Mujawwad | ayah | qdc |
| 2 | AbdulBaset AbdulSamad | Murattal | ayah | qdc |
| 3 | Abdur-Rahman as-Sudais | Murattal | ayah | qdc |
| 4 | Abu Bakr al-Shatri | Murattal | ayah | qdc |
| 5 | Hani ar-Rifai | Murattal | ayah | qdc |
| 6 | Mahmoud Khalil Al-Husary | Murattal | ayah | qdc |
| 7 | Mishari Rashid al-`Afasy | Murattal | ayah | qdc |
| 8 | Mohamed Siddiq al-Minshawi | Mujawwad | ayah | qdc |
| 9 | Mohamed Siddiq al-Minshawi | Murattal | ayah | qdc |
| 10 | Sa'ud ash-Shuraim | Murattal | ayah | qdc |
| 11 | Mohammad al-Tablawi | Murattal | ayah | qdc |
| 12 | Mahmoud Khalil Al-Husary | Muallim | ayah | qdc |
| 13 | Ahmad Alnufais | Murattal | ayah | qul |
| 14 | Ahmed ibn Ali al-Ajmy | Murattal | surah | qdc |
| 15 | Maher al-Muaiqly | Murattal | surah | qdc |
| 16 | Bandar Baleela | Murattal | surah | qdc |
| 17 | Yasser Ad Dussary | Murattal | surah | qdc |
| 18 | Abdullah Hamad Abu Sharida | Murattal | surah | qdc |
| 19 | Sa'ad al-Ghamdi | Murattal | surah | qdc |
| 20 | Khalifah Al Tunaiji | Murattal | surah | qdc |
| 21 | Mohamed Siddiq al-Minshawi (Kids) | Kids Repeat | surah | qdc |
| 22 | Hady Toure | Murattal | surah | local |
| 23 | Khalid Al-Jalil | Murattal | surah | local |

## Audio Patterns

- **Ayah-level (IDs 1-13):** `{S3}{A3}.mp3` → e.g., `001001.mp3`
- **Surah-level (IDs 14-23):** `{S3}.mp3` or `{S}.mp3` → e.g., `001.mp3`

## Sources

- **qdc:** Quran.com API
- **qul:** QUL/Tarteel API
- **local:** Local JSON segments

Fetch reciter list from: `recitations.toon` or API endpoint.
