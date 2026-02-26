# Tajweed Documentation

## Overview
The `tajweed` resource provides rule-based metadata for coloring Quranic text. Instead of hardcoding colors (which limits theming), it provides the **rule name** and character indices, allowing the frontend to decide the styling.

## Structure
Files are located at: `tajweed/pages/{1..604}.toon`

*   These files map 1-to-1 with the standard Uthmani text.

## Schema
```toon
tajweed[{size}]{c,v,rules}:
  {surah},{verse},"[[{start_char},{end_char},{rule_name}],...]"
```

*   **rules**: A JSON-stringified array of `[start_index, end_index, "rule_id"]`.
*   **Indices**: Zero-based character offsets relative to the verse text string.

## Supported Rules (Common)
*   `ham_wasl` (Hamzatul Wasl)
*   `laam_shamsiyah` (Solar Lam)
*   `madda_normal` (Natural Elongation)
*   `madda_necessary` (Mandatory Elongation)
*   `ghunnah` (Nasal Sound)
*   `idgham_wo_ghunnah` (Merging without Ghunnah)
*   ...and many more.

## Usage Example (Frontend)

Applying colors to text:

```javascript
// 1. Get Text
const textData = await fetch('.../quran/pages/1.toon');
const text = textData.quran[0][2]; // "بِسْمِ ٱللَّهِ..."

// 2. Get Rules
const ruleData = await fetch('.../tajweed/pages/1.toon');
const rules = JSON.parse(ruleData.tajweed[0][2]); // [[7,8,"ham_wasl"],...]

// 3. Render
let html = "";
let lastIdx = 0;

rules.sort((a,b) => a[0] - b[0]).forEach(([start, end, rule]) => {
  // Add plain text before the rule
  html += text.substring(lastIdx, start);
  
  // Add styled text
  const color = getThemeColor(rule); // e.g., "ham_wasl" -> "#888"
  html += `<span class="tajweed-${rule}" style="color:${color}">${text.substring(start, end)}</span>`;
  
  lastIdx = end;
});

// Add remaining text
html += text.substring(lastIdx);
document.getElementById('verse').innerHTML = html;
```

## Performance & Savings
*   **82% Reduction**: Traditional "Tajweed JSON" often embeds HTML spans (`<span class='red'>...</span>`) directly into the text, bloating the size enormously.
*   **Separation of Concerns**: By sending only indices and rule names (`"ghunnah"`), the frontend can dynamically change colors (Dark Mode vs Light Mode) without re-fetching data.
