async () => {
  const ids = [
    461, 421, 404, 415, 416, 348, 372, 419, 368, 420,
    334, 321, 356, 388, 333, 362, 320, 327, 370, 315,
    335, 371, 317, 331, 389, 316, 336, 346, 395, 405,
    396, 351, 409, 341, 407, 361, 418, 471, 473, 414,
    408, 422, 406, 412, 411, 410, 417, 413, 562, 112,
    104, 107, 103, 108, 109, 118, 110, 115, 116, 106,
    111, 113, 114, 117, 119
  ];

  const results = [];

  // Process in chunks to avoid overwhelming the browser/network
  const chunkSize = 5;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const promises = chunk.map(async (id) => {
      try {
        const response = await fetch(`https://qul.tarteel.ai/resources/recitation/${id}`);
        const text = await response.text();

        // Parse HTML (simple regex to avoid DOMParser overhead/issues in some contexts,
        // but DOMParser is available in browser)
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        const nameEl = doc.querySelector('h1');
        const name = nameEl ? nameEl.innerText.trim() : 'Unknown';

        // Find download link
        // Looking for href containing "/download"
        const link = Array.from(doc.querySelectorAll('a'))
          .find(a => a.href.includes('/download'));

        return {
          id,
          name,
          downloadUrl: link ? link.href : null,
          hasSegments: !!link // If download link exists, we assume it has segments as per user
        };
      } catch (e) {
        return { id, error: e.message };
      }
    });

    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);

    // Small delay
    await new Promise(r => setTimeout(r, 200));
  }

  return results;
}
