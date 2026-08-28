# Data Scripts & Tooling Documentation

## Overview

This repository includes a suite of Python scripts for data conversion, cleaning, and maintenance. These scripts transform raw source data into the `.toon` format, fix formatting issues, and regenerate page-aligned files.

## Conversion Scripts

### `convert_tafsir.py`
Generic tafsir format converter. Parses various tafsir source formats (Abdul Salam, Wahiduddin, etc.) and generates page-based `.toon` files organized by Madani Mushaf pages.

### `convert_arabic_tafsirs.py`
Converts Arabic tafsir sources to `.toon` format. Handles multiple classical Arabic tafsirs including those in raw text formats.

### `convert_tibyan_tafsir.py`
Converts Tibyan-ul-Quran (Urdu tafsir) to `.toon` format. Specialized parser for the Tibyan tafsir structure.

### `tibyan_to_toon_converter.py`
Alternative converter for Tibyan tafsir with different parsing logic.

### `convert_hindi_maududi.py`
Converts Tafheem-ul-Quran (Maududi's Urdu tafsir) Hindi translation to page-based `.toon` files.

### `convert_hindi_taqi.py`
Converts Taqi Usmani's Hindi translation to `.toon` format.

### `convert_gojri.py`
Converts Gojri (a language spoken in Kashmir/Punjab) translation to `.toon` format.

### `convert_telugu.py`
Converts Telugu translation to `.toon` format.

### `fix_roshan_kakar.py`
Converts Punjabi Roshan Kakar translation. Parses raw text input, builds verse map lookup, and generates page-aligned `.toon` files.

## Data Fix & Cleaning Scripts

### `fix_recitations.py`
3-step process to fix recitation timing data:
1. Delete old recitation page files
2. Restore files with corrected timestamps from git history
3. Verify consistency

### `fix_recitations_step4.py`
Additional standardization step for recitation folder IDs. Renumbers/moves recitation directories to match canonical IDs.

### `clean_html_toon.py`
Batch HTML cleaner for tafsir `.toon` files. Processes entire tafsir directories to fix malformed HTML, close unclosed tags, and normalize formatting.

### `clean_tafsir_format.py`
Fixes structural issues in individual tafsir `.toon` files — corrects verse ranges, fixes line breaks, and ensures schema consistency.

### `reconvert_tafsirs.py`
Rebuilds tafsir page files from correct page maps. Useful when page boundaries are adjusted or source data is re-processed.

### `regenerate_extracted_translations.py`
Regenerates translation page files from master verse-level layout data. Ensures translations are correctly aligned to page boundaries.

## Duas Scripts

### `duas/convert_duas_to_toon.py`
Converts raw supplication data into `.toon` format for the duas resource.

### `duas/translate_*.py`
Various translation utility scripts for adding new language supplications.

## Development Guide

**Add a new translation:**
1. Prepare the verse-level translation data
2. Run `regenerate_extracted_translations.py` to generate page files
3. Verify the output with a spot-check across pages

**Add a new reciter:**
1. Prepare word-timing JSON data
2. Organize into `recitations/{id}/pages/{1..604}.toon`
3. Update `recitations.toon` index with the reciter metadata

**Fix formatting issues:**
1. Run `clean_html_toon.py` on the affected tafsir directory
2. Run `clean_tafsir_format.py` for individual file fixes
3. Validate with the project's schema expectations
