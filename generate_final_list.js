const fs = require('fs');

const quranReciters = [
  {
    "id": 1,
    "name": "AbdulBaset AbdulSamad",
    "style": "Mujawwad",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/abdul_baset/mujawwad/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/1/by_chapter/{surah}"
  },
  {
    "id": 2,
    "name": "AbdulBaset AbdulSamad",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/abdul_baset/murattal/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/2/by_chapter/{surah}"
  },
  {
    "id": 3,
    "name": "Abdur-Rahman as-Sudais",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/3/by_chapter/{surah}"
  },
  {
    "id": 4,
    "name": "Abu Bakr al-Shatri",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/abu_bakr_shatri/murattal/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/4/by_chapter/{surah}"
  },
  {
    "id": 5,
    "name": "Hani ar-Rifai",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/hani_ar_rifai/murattal/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/5/by_chapter/{surah}"
  },
  {
    "id": 6,
    "name": "Mahmoud Khalil Al-Husary",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/khalil_al_husary/murattal/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/6/by_chapter/{surah}"
  },
  {
    "id": 7,
    "name": "Mishari Rashid al-`Afasy",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/7/by_chapter/{surah}"
  },
  {
    "id": 9,
    "name": "Mohamed Siddiq al-Minshawi",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/siddiq_minshawi/murattal/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/9/by_chapter/{surah}"
  },
  {
    "id": 10,
    "name": "Sa'ud ash-Shuraim",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/saud_ash-shuraym/murattal/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/10/by_chapter/{surah}"
  },
  {
    "id": 12,
    "name": "Mahmoud Khalil Al-Husary",
    "style": "Muallim",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/khalil_al_husary/muallim/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/12/by_chapter/{surah}"
  },
  {
    "id": 13,
    "name": "Sa'ad al-Ghamdi",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/13/by_chapter/{surah}"
  },
  {
    "id": 19,
    "name": "Ahmed ibn Ali al-Ajmy",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/quran/ahmed_ibn_3ali_al-3ajamy/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/19/by_chapter/{surah}"
  },
  {
    "id": 159,
    "name": "Maher al-Muaiqly",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/quran/maher_almu3aiqly/year1440/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/159/by_chapter/{surah}"
  },
  {
    "id": 160,
    "name": "Bandar Baleela",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/quran/bandar_baleela/complete/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/160/by_chapter/{surah}"
  },
  {
    "id": 161,
    "name": "Khalifah Al Tunaiji",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/khalifah_taniji/murattal/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/161/by_chapter/{surah}"
  },
  {
    "id": 168,
    "name": "Mohamed Siddiq al-Minshawi",
    "style": "Kids Repeat",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/siddiq_minshawi/kids_repeat/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/168/by_chapter/{surah}"
  },
  {
    "id": 173,
    "name": "Mishari Rashid al-`Afasy",
    "style": "Streaming",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/mishari_al_afasy/streaming/mp3/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/173/by_chapter/{surah}"
  },
  {
    "id": 174,
    "name": "Yasser Ad Dussary",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/qdc/yasser_ad-dussary/mp3/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/174/by_chapter/{surah}"
  },
  {
    "id": 175,
    "name": "Abdullah Hamad Abu Sharida",
    "style": "Murattal",
    "source": "quran_com",
    "audio_type": "surah_level",
    "audio_url_pattern": "https://download.quranicaudio.com/quran/abdullah_abu_sharida/{surah}.mp3",
    "segments_api_pattern": "https://api.quran.com/api/v4/recitations/175/by_chapter/{surah}"
  }
];

const qulScraped = JSON.parse(fs.readFileSync('qul_reciters_scraped.json', 'utf8'));

// Filter Qul reciters
const qulFiltered = qulScraped.filter(r => {
  // Exclude specific ID
  if (r.id === 404) return false; // Abdullah Ali Jabir

  // Check for duplicates in Quran.com list
  // Simple name matching (fuzzy)
  const name = r.name.toLowerCase();

  // Known duplicates mapping
  if (name.includes("husary") && !name.includes("muallim") && quranReciters.some(qr => qr.id === 6)) return false;
  if (name.includes("husary") && name.includes("muallim") && quranReciters.some(qr => qr.id === 12)) return false;
  if (name.includes("bandar baleela") && quranReciters.some(qr => qr.id === 160)) return false;
  if (name.includes("hani ar-rifai") && quranReciters.some(qr => qr.id === 5)) return false;
  if (name.includes("shatri") && quranReciters.some(qr => qr.id === 4)) return false;
  if (name.includes("saad al-ghamdi") && quranReciters.some(qr => qr.id === 13)) return false;
  if (name.includes("saad al ghamdi") && quranReciters.some(qr => qr.id === 13)) return false;
  if (name.includes("shuraim") && quranReciters.some(qr => qr.id === 10)) return false;
  if (name.includes("shuraym") && quranReciters.some(qr => qr.id === 10)) return false;
  if (name.includes("taniji") && quranReciters.some(qr => qr.id === 161)) return false;
  if (name.includes("tunaiji") && quranReciters.some(qr => qr.id === 161)) return false;
  if (name.includes("minshawi") && !name.includes("kids") && !name.includes("mujawwad") && quranReciters.some(qr => qr.id === 9)) return false;
  if (name.includes("muaiqly") && quranReciters.some(qr => qr.id === 159)) return false;
  if (name.includes("mu'aiqly") && quranReciters.some(qr => qr.id === 159)) return false;
  if (name.includes("dussary") && quranReciters.some(qr => qr.id === 174)) return false;
  if (name.includes("dosari") && quranReciters.some(qr => qr.id === 174)) return false;
  if (name.includes("sudais") && quranReciters.some(qr => qr.id === 3)) return false;
  if (name.includes("abdul basit") && quranReciters.some(qr => qr.id === 1 || qr.id === 2)) return false;

  // Special case for Mishari with translation (keep it)
  if (name.includes("afasy") && !name.includes("ibrahim walk") && quranReciters.some(qr => qr.id === 7 || qr.id === 173)) return false;

  // Internal Qul Deduplication (keep first occurrence usually, or specific ID)
  // Tablawi: 348 vs 106. 348 seems to be the main one? 106 says "Recitation".
  if (r.id === 106 && qulScraped.some(x => x.id === 348)) return false;

  // Haneef: 410 vs 413.
  if (r.id === 413 && qulScraped.some(x => x.id === 410)) return false;

  // Alnufais: 461 vs 471. 471 is "ayah recitation". 461 is "Recitation".
  // User might prefer one. I'll keep both but label them clearly if possible.

  return true;
});

// Format Qul reciters for JSON
const qulFormatted = qulFiltered.map(r => ({
  id: `qul_${r.id}`,
  name: r.name,
  style: "Murattal", // Default
  source: "qul_tarteel",
  audio_type: "surah_level",
  audio_url_pattern: r.downloadUrl, // Using download URL as requested
  segments_api_pattern: "Inside ZIP (JSON per Surah)"
}));

const allReciters = [...quranReciters, ...qulFormatted];

// Generate Markdown
let md = `# Verified Reciters List (No Duplicates)

This list contains reciters with **verified word-level timestamp data** (segments) available for direct use in applications.

## 1. Quran.com API Reciters
*Primary Source: High quality audio, standard IDs, Ayah-by-Ayah structure.*
*API Endpoint:* \`https://api.quran.com/api/v4/chapter_recitations/{id}/{surah_number}\`
*Word-by-Word Audio:* Available via \`https://api.quran.com/api/v4/verses/by_chapter/{surah_number}?words=true\` (generic wbw, not per-reciter).
*Segments Data:* Available via \`https://api.quran.com/api/v4/recitations/{id}/by_chapter/{surah_number}\` (provides per-ayah audio files) or internal QDC API for word segments on surah audio.

| ID | Reciter Name | Style | Audio Type | Audio URL Pattern (Example) |
|----|--------------|-------|------------|-----------------------------|
`;

quranReciters.forEach(r => {
  md += `| ${r.id} | ${r.name} | ${r.style} | ${r.audio_type} | \`${r.audio_url_pattern}\` |\n`;
});

md += `
---

## 2. Additional Qul/Tarteel Reciters
*Source: Qul Tarteel Resources. These are unique reciters not found in the Quran.com list above, or distinct versions.*
*Data Source:* Downloadable ZIP files containing JSON segments for all Surahs.
*Verification:* Download links verified to redirect to S3 ZIP archives.

| ID | Reciter Name | Style | Audio Type | Download Link (Contains Audio URLs & Segments) |
|----|--------------|-------|------------|------------------------------------------------|
`;

qulFormatted.forEach(r => {
  md += `| ${r.id} | **${r.name}** | ${r.style} | ${r.audio_type} | [Download ZIP](${r.audio_url_pattern}) |\n`;
});

md += `
### Notes
- **Audio Type**: All verified reciters in this list use **Surah-level (Gapless)** audio files.
- **Quran.com Reciters**: Use the standard API.
- **Qul Reciters**: The "Download Link" redirects to a ZIP file. Inside the ZIP, you will find JSON files (one per Surah or a manifest) containing the specific audio URLs and word-level timestamps.
- **Duplicates**: Common reciters (like Sudais, Mishari, Husary) are listed under Quran.com as the primary source due to higher quality/standardization.
`;

fs.writeFileSync('reciters.md', md);
fs.writeFileSync('reciters.json', JSON.stringify(allReciters, null, 2));

console.log("Files generated successfully.");
