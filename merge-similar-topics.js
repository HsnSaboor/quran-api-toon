const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./topics/topics-ur.toon', 'utf8'));

function similarity(s1, s2) {
  const words1 = s1.toLowerCase().split(/\s+/);
  const words2 = s2.toLowerCase().split(/\s+/);
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  const intersection = [...set1].filter(w => set2.has(w));
  const union = new Set([...set1, ...set2]);
  return intersection.length / union.size;
}

function normalizeName(name) {
  return name
    .replace(/\(ﷺ\)/g, '')
    .replace(/\([^)]+\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const entries = Object.entries(data);
const merged = {};
const processed = new Set();
const mergeLog = [];

for (let i = 0; i < entries.length; i++) {
  const [key1, val1] = entries[i];
  if (processed.has(key1)) continue;
  
  let mergedEntry = { ...val1, mergedFrom: [key1] };
  const key1Norm = normalizeName(key1);
  
  for (let j = i + 1; j < entries.length; j++) {
    const [key2, val2] = entries[j];
    if (processed.has(key2)) continue;
    
    const key2Norm = normalizeName(key2);
    const sim = similarity(key1Norm, key2Norm);
    
    if (sim >= 0.6 || key1Norm === key2Norm) {
      const allRefs = [...new Set([...mergedEntry.v, ...val2.v])].sort((a, b) => {
        const [s1, v1] = a.split(':').map(Number);
        const [s2, v2] = b.split(':').map(Number);
        return s1 !== s2 ? s1 - s2 : v1 - v2;
      });
      
      mergedEntry.v = allRefs;
      mergedEntry.mergedFrom.push(key2);
      processed.add(key2);
      
      mergeLog.push({
        primary: key1,
        merged: key2,
        similarity: sim,
        refsBefore: val1.v.length + val2.v.length,
        refsAfter: allRefs.length,
        hadOverlap: allRefs.length < val1.v.length + val2.v.length
      });
    }
  }
  
  const bestKey = mergedEntry.mergedFrom.sort((a, b) => {
    const aHasUrdu = data[a].n && data[a].n !== a;
    const bHasUrdu = data[b].n && data[b].n !== b;
    if (aHasUrdu && !bHasUrdu) return -1;
    if (!aHasUrdu && bHasUrdu) return 1;
    return a.length - b.length;
  })[0];
  
  merged[bestKey] = {
    n: mergedEntry.n,
    e: mergedEntry.e,
    v: mergedEntry.v,
    r: mergedEntry.r
  };
  
  processed.add(key1);
}

console.log('=== Merge Summary ===');
console.log(`Original entries: ${entries.length}`);
console.log(`Merged entries: ${Object.keys(merged).length}`);
console.log(`Merges performed: ${mergeLog.length}`);
console.log('\n=== Sample Merges (first 20) ===');
mergeLog.slice(0, 20).forEach(m => {
  console.log(`"${m.primary}" + "${m.merged}" (sim: ${m.similarity.toFixed(2)}, overlap: ${m.hadOverlap})`);
});

fs.writeFileSync('./topics/topics-ur-merged.toon', JSON.stringify(merged, null, 2));
fs.writeFileSync('./merge-log.json', JSON.stringify(mergeLog, null, 2));

console.log('\nWritten: topics-ur-merged.toon');
console.log('Written: merge-log.json');
