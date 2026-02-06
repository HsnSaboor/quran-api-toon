const https = require('https');

const reciters = [
  { name: "Ahmad Alnufais", id: 175 },
  { name: "Hady Toure", id: 172 },
  { name: "Abdullah Ali Jabir", id: 158 },
  { name: "Abdullah Awad al-Juhani", id: 162 },
  { name: "Abdullah Basfar", id: 163 },
  { name: "Mohammad Al-Tablawi", id: 91 },
  { name: "Mahmood Ali Al-Bana", id: 129 },
  { name: "Muhammad Jibreel", id: 169 },
  { name: "Khalid Al-Jalil", id: 170 },
  { name: "Aziz Alili", id: 44 },
  { name: "Nasser Al Qatami", id: 104 },
  { name: "Salah Bukhatir", id: 18 },
  { name: "Salah al-Budair", id: 43 },
  { name: "Mishari w/ Ibrahim Walk", id: 58 },
  { name: "Akram Al-Alaqmi", id: 127 },
  { name: "Ali Hajjaj Alsouasi", id: 128 },
  { name: "Abdullah Basfar w/ Ibrahim Walk", id: 66 },
  { name: "Fares Abbad", id: 14 },
  { name: "Mostafa Ismaeel", id: 88 },
  { name: "Abdullah Matroud", id: 124 },
  { name: "Ahmad Nauina", id: 126 },
  { name: "Sahl Yasin", id: 17 }
];

const surahsToCheck = [1, 18, 114];

function fetchSurahData(reciterId, surah) {
  return new Promise((resolve, reject) => {
    const url = `https://qul.tarteel.ai/api/v1/audio/surah_segments/${reciterId}?surah=${surah}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            resolve({ error: `Status ${res.statusCode}` });
            return;
          }
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve({ error: e.message });
        }
      });
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function verify() {
  console.log("| Reciter | Surah 1 | Surah 18 | Surah 114 | Status |");
  console.log("|---|---|---|---|---|");

  for (const reciter of reciters) {
    const results = [];
    for (const surah of surahsToCheck) {
      const data = await fetchSurahData(reciter.id, surah);
      if (data.error) {
        results.push(`❌ Error`);
      } else if (data.segments && Object.keys(data.segments).length > 0) {
        // Check if segments have actual timing data
        const firstAyahKey = Object.keys(data.segments)[0];
        const hasTimings = data.segments[firstAyahKey].segments && data.segments[firstAyahKey].segments.length > 0;
        results.push(hasTimings ? "✅" : "⚠️ No Timings");
      } else {
        results.push("❌ No Data");
      }
      // Small delay to be nice
      await new Promise(r => setTimeout(r, 200));
    }
    const status = results.every(r => r === "✅") ? "Verified" : "Issues Found";
    console.log(`| ${reciter.name} | ${results[0]} | ${results[1]} | ${results[2]} | ${status} |`);
  }
}

verify();
