const https = require('https');

const qulIds = [
  461, 421, 404, 415, 416, 348, 372, 419, 368, 420,
  334, 321, 356, 388, 333, 362, 320, 327, 370, 315,
  335, 371, 317, 331, 389, 316, 336, 346, 395, 405,
  396, 351, 409, 341, 407, 361, 418, 471, 473, 414,
  408, 422, 406, 412, 411, 410, 417, 413, 562, 112,
  104, 107, 103, 108, 109, 118, 110, 115, 116, 106,
  111, 113, 114, 117, 119
];

function fetchPage(id) {
  return new Promise((resolve) => {
    https.get(`https://qul.tarteel.ai/resources/recitation/${id}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function checkRedirect(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        resolve(res.headers.location);
      } else {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}

async function run() {
  console.log("| ID | Name | Hash ID | Download Link Valid? |");
  console.log("|---|---|---|---|");

  for (const id of qulIds) {
    const html = await fetchPage(id);

    // Extract Name
    const nameMatch = html.match(/<h1[^>]*>\s*(.*?)\s*<\/h1>/);
    const name = nameMatch ? nameMatch[1].trim() : "Unknown";

    // Extract Download Link (Hash ID)
    // Looking for href that contains "/download"
    const downloadMatch = html.match(/href="([^"]*\/resources\/recitation\/([a-f0-9]+)\/download)"/);

    if (downloadMatch) {
      const downloadUrl = downloadMatch[1]; // Full relative or absolute URL? Usually absolute in href if scraped, or relative.
      // The match above assumes it captures the full path if it matches the regex.
      // Let's handle relative paths if needed, but the regex looks for /resources/...

      const fullDownloadUrl = downloadUrl.startsWith('http') ? downloadUrl : `https://qul.tarteel.ai${downloadUrl}`;
      const hashId = downloadMatch[2];

      // Verify the redirect
      const finalUrl = await checkRedirect(fullDownloadUrl);
      const isValid = finalUrl && finalUrl.includes('.zip');

      console.log(`| ${id} | ${name} | ${hashId} | ${isValid ? "✅ ZIP Found" : "❌ Invalid"} |`);
    } else {
      console.log(`| ${id} | ${name} | N/A | ❌ No Download Link |`);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 100));
  }
}

run();
