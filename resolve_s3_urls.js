async () => {
  const reciters = [
    { id: "qul_461", url: "https://qul.tarteel.ai/resources/recitation/d27f7e67d7a126c71325ed4ade33d89c/download" },
    { id: "qul_421", url: "https://qul.tarteel.ai/resources/recitation/d3b993ddc04474d193613be858e13a52/download" },
    { id: "qul_415", url: "https://qul.tarteel.ai/resources/recitation/cd6bb3decf17335d83778cc8f39ea920/download" },
    { id: "qul_416", url: "https://qul.tarteel.ai/resources/recitation/16382b702ae47fb89b067d0757396729/download" },
    { id: "qul_348", url: "https://qul.tarteel.ai/resources/recitation/fbaabcdc954c77427764779526ad7441/download" },
    { id: "qul_372", url: "https://qul.tarteel.ai/resources/recitation/07f0d6551bebd0292ebc189c68355e56/download" },
    { id: "qul_419", url: "https://qul.tarteel.ai/resources/recitation/dbac817a417b6fa2fb25b82f9f741110/download" },
    { id: "qul_420", url: "https://qul.tarteel.ai/resources/recitation/d538d408e1f1465616b8297eb22dde9c/download" },
    { id: "qul_321", url: "https://qul.tarteel.ai/resources/recitation/e128d999f74948c41d0f27c377e515df/download" },
    { id: "qul_356", url: "https://qul.tarteel.ai/resources/recitation/75e5fde741825ed0e4080074b02efd8b/download" },
    { id: "qul_362", url: "https://qul.tarteel.ai/resources/recitation/e8fee39b132b693be78699bb8d37d291/download" },
    { id: "qul_320", url: "https://qul.tarteel.ai/resources/recitation/8637d08b60558dd26f7a6e99f4387247/download" },
    { id: "qul_327", url: "https://qul.tarteel.ai/resources/recitation/b0a49f38ccb31f81ada90f5811a00616/download" },
    { id: "qul_370", url: "https://qul.tarteel.ai/resources/recitation/9d2255d6cc795ed4d74d144a3a86c27e/download" },
    { id: "qul_371", url: "https://qul.tarteel.ai/resources/recitation/8dcfcc553ea79eac638b1c80a293087b/download" },
    { id: "qul_331", url: "https://qul.tarteel.ai/resources/recitation/f176731758a99c3e5a8374747c629cf0/download" },
    { id: "qul_336", url: "https://qul.tarteel.ai/resources/recitation/1ab867de3b6e3dcfaebca5626b0b42e3/download" },
    { id: "qul_346", url: "https://qul.tarteel.ai/resources/recitation/5584379d83109cf4e7a463f7fcaa47ca/download" },
    { id: "qul_409", url: "https://qul.tarteel.ai/resources/recitation/e03d1bf8f703365c378e97f0e25f54a7/download" },
    { id: "qul_341", url: "https://qul.tarteel.ai/resources/recitation/76d9736249fcbae311775c6c856685b3/download" },
    { id: "qul_361", url: "https://qul.tarteel.ai/resources/recitation/5a7f893dff577cb54e65a3f1105a9176/download" },
    { id: "qul_418", url: "https://qul.tarteel.ai/resources/recitation/f44a11bd2eeedf3b0c5c0801bb0115fc/download" },
    { id: "qul_471", url: "https://qul.tarteel.ai/resources/recitation/2a9cfa1ec23503f5282642a4c37b9eab/download" },
    { id: "qul_473", url: "https://qul.tarteel.ai/resources/recitation/6b889aa5bd2ed5b1355a3ea98dbf6067/download" },
    { id: "qul_410", url: "https://qul.tarteel.ai/resources/recitation/f065a240022ac1a26a9f881b82ec7589/download" },
    { id: "qul_417", url: "https://qul.tarteel.ai/resources/recitation/f09200851dcd1cfbf406496aa4154f42/download" }
  ];

  const results = [];
  const chunkSize = 3; // Small chunk size to be safe

  for (let i = 0; i < reciters.length; i += chunkSize) {
    const chunk = reciters.slice(i, i + chunkSize);
    const promises = chunk.map(async (r) => {
      try {
        const res = await fetch(r.url, { method: 'HEAD' }); // HEAD might be enough if it follows redirects?
        // Actually fetch follows redirects by default.
        // But if it's a download, we might not want to download the whole thing in browser memory.
        // However, we just want the URL.
        // Let's try a GET but abort it? Or just let it start and check response.url

        // Wait, fetch in browser follows redirects transparently.
        // response.url will be the final URL.
        // If it's a large file, we should probably abort the body reading.

        const controller = new AbortController();
        const signal = controller.signal;

        const response = await fetch(r.url, { signal });
        const finalUrl = response.url;
        controller.abort(); // Stop downloading

        return { id: r.id, s3Url: finalUrl };
      } catch (e) {
        return { id: r.id, error: e.message };
      }
    });

    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);

    // Delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}
