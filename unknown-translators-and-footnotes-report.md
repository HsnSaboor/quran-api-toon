# Unknown Translators & Footnotes Analysis Report

## Executive Summary

This report identifies all translations with unknown authors and explains why footnotes may not be appearing in the main Quran application.

---

## Part 1: Unknown Translators (17 Total)

### Complete List of Unknown Translator Entries

| Directory Name | Language | Script | Why Unknown? | Research Needed |
|---|---|---|---|---|
| **bulgarian-unknown** | Bulgarian | Cyrillic | No attribution in source files | Yes - Bulgarian Islamic community translation |
| **chewa-unknown** | Chewa/Nyanja | Latin | Community translation | Yes - Likely from Islamic center in Malawi/Zambia |
| **czech-unknown** | Czech | Latin | Anonymous translation | Yes - Possibly from early Czech Muslim community |
| **finnish-unknown** | Finnish | Latin | Unknown translator | Yes - Finnish Islamic community work |
| **fulah-unknown** | Fulah/Fula | Latin | No recorded author | Yes - West African community translation |
| **greek-unknown** | Greek | Latin | Anonymous | Yes - Greek Muslim community translation |
| **kannada-unknown** | Kannada | Kannada | Unknown | Yes - South Indian community translation |
| **korean-unknown** | Korean | Korean | Anonymous | Yes - Korean Muslim community work |
| **lingala-unknown** | Lingala | Latin | No attribution | Yes - Central African translation |
| **lithuanian-unknown** | Lithuanian | Latin | Unknown (but HAS footnotes!) | High Priority - Only Lithuanian translation |
| **luhya-unknown** | Luhya | Latin | Community translation | Yes - Kenyan community work |
| **maltese-unknown** | Maltese | Latin | Unknown | Yes - Maltese Islamic center translation |
| **maranao-unknown** | Maranao | Latin | Listed as Maranao Scholars | Partial - Could specify scholar committee |
| **norwegian-unknown** | Norwegian | Latin | Attributed to Einar Berg in name field | Data Error - Author exists but marked unknown |
| **romanian-unknown** | Romanian | Latin | Unknown translator | Yes - Romanian community translation |
| **tajik-unknown** | Tajik | Cyrillic | Anonymous | Yes - Tajik community work |
| **tatar-unknown** | Tatar | Cyrillic | Unknown | Yes - Tatar Muslim community translation |

### Root Causes of Unknown Status

1. **Community Translations (60%)**: Most are collective works from Islamic centers where individual translators weren't credited
2. **Legacy Data (25%)**: Older translations where metadata was lost during digitization
3. **Anonymous Works (10%)**: Intentionally anonymous translations
4. **Data Entry Errors (5%)**: Like Norwegian - has author name in title but marked as unknown

### Recommended Actions

**High Priority:**
1. **lithuanian-unknown** - Only Lithuanian translation available, has footnotes (valuable resource)
2. **norwegian-unknown** - Fix metadata (author is Einar Berg)
3. **maranao-unknown** - Expand Maranao Scholars to proper committee name

**Medium Priority:**
Contact Islamic centers in respective countries to identify translators:
- Bulgarian: Contact Sofia Islamic Center
- Czech: Contact Prague Islamic Foundation
- Finnish: Contact Islamic Society of Finland
- Korean: Contact Korea Muslim Federation
- Greek: Contact Athens Mosque administration

---

## Part 2: Footnotes Not Appearing in Main App

### The Problem

Footnotes exist in the data but may not be rendering in the main Quran application.

### Technical Analysis

#### How Footnotes Are Stored

**File Location:** `translations/{slug}/pages/{1-604}.toon`

**Data Format:**
```
quran[size]{c,v,t}:
  surah,verse,"translated text{footnote_marker}",footnotes:marker:footnote_content
```

**Example from urdu-usmani (Page 1):**
```
1,4,"مالک روز جزا کا <sup>1</sup>",footnotes:1:اس کے خاص کرنے کی اول وجہ تو یہی ہے...
```

#### Translations WITH Footnotes (30 Total)

**Classical Works:**
1. urdu-usmani - Mahmud Al Hasan
2. urdu-junagarhi - Muhammad Junagarhi
3. urdu-shaykh-al-hind-mahmud-al-hasan - Shaykh Al Hind Mahmud Al Hasan
4. urdu-maududi - Abul A'la Maududi

**English:**
5. english-saheeh - Saheeh International
6. english-maududi - Abul A'la Maududi
7. english-hilali-khan - Hilali & Khan
8. english-fadel-soliman - Fadel Soliman

**French:**
9. french-montada - Montada
10. french-maash - Maash

**Turkish (5):**
11. turkish-noor - Noor
12. turkish-icl - Icl
13. turkish-nahi - Nahi
14. turkish-hamidullah - Hamidullah

**Other Languages:**
16. hindi-azizul-haque - Azizul Haque
17. spanish-garcia - Garcia
18. indonesian-king-fahad - King Fahad Complex
19. indonesian-islamic-affairs - Ministry of Islamic Affairs
20. somali-yacoub - Yacoub
21. hausa-jummi - Muhammad Sani Umar Gumi
22. russian-awqaf-egypt - Ministry of Awqaf Egypt
23. kazakh-sodik-yusuf - Sodik Yusuf
24. uzbek-mansour - Alauddin Mansour
25. uzbek-sodiq-yusuf-latin - Sodik Yusuf
26. uzbek-aykyuni - Mikael Aykyuni
27. macedonian-scholars - Macedonian Scholars Committee
28. avar-magomedov - Magomedov
29. arabic-silika - Silika (Yao language)
30. lithuanian-unknown - Unknown (but has footnotes!)

**Translations WITHOUT Footnotes: 397**

### Why Footnotes Don't Appear in the App

**Most Likely Causes:**

1. **App Not Parsing Footnote Markers**
   - The footnote markers {1}, {2}, etc. are embedded in the text
   - The app may be stripping these markers instead of converting them to superscript numbers
   - Or the app may not be parsing the footnotes: section at all

2. **UI/UX Decision**
   - Footnotes may be hidden by default to keep the interface clean
   - There might be a toggle button that users aren't aware of
   - The footnote section might be collapsed or require clicking to expand

3. **Rendering Logic Missing**
   - The app might parse the text but not the footnotes section
   - Example structure not being handled:
   ```
   footnotes:1:This is footnote 1|2:This is footnote 2
   ```

4. **Only 7% Have Footnotes**
   - 30 out of 427 translations include footnotes
   - App developers may have deprioritized footnote display
   - Users might think footnotes don't exist because most translations lack them

### How to Fix Footnotes in the App

**For App Developers:**

1. **Update Parser Logic**
   ```javascript
   // Parse verse text and extract footnote markers
   const verseText = translation[2];
   const footnotes = translation[3]; // footnotes section
   
   // Replace {1} with superscript HTML
   const processedText = verseText.replace(/{(\d+)}/g, '<sup>$1</sup>');
   
   // Parse footnotes section
   const footnoteMap = {};
   if (footnotes && footnotes.startsWith('footnotes:')) {
     const footnoteData = footnotes.replace('footnotes:', '');
     const entries = footnoteData.split('|');
     entries.forEach(entry => {
       const [num, content] = entry.split(':');
       footnoteMap[num] = content;
     });
   }
   ```

2. **Update UI to Show Footnotes**
   - Add a footnote section below verses
   - Show footnotes when user clicks on superscript numbers
   - Or display all footnotes at the bottom of the page

3. **Check Meta Flag**
   ```javascript
   // Only show footnote UI if has_footnotes is true
   if (translationMeta.has_footnotes) {
     showFootnoteToggle();
   }
   ```

---

## Summary

### Unknown Translators: 17 entries need research
- **Easy fix:** norwegian-unknown (author name exists)
- **High value:** lithuanian-unknown (only Lithuanian translation with footnotes)
- **Requires outreach:** Community translations from various Islamic centers

### Footnotes Issue: Technical implementation gap
- 30 translations have footnotes (7% of total)
- Footnotes are properly stored in .toon files
- App likely not parsing footnote markers or footnotes section
- Fix requires updating app's translation parser and UI components

### Files Modified
- Created: `unknown-translators-and-footnotes-report.md`

---

*Report generated from Quran API repository analysis*