import json

# Data based on standard Madani Mushaf (15 lines)
SURAH_DATA = [
    [1, "الفاتحة", "Al-Fatiha", 1, 1, 7, "Meccan"],
    [2, "البقرة", "Al-Baqarah", 2, 49, 286, "Medinan"],
    [3, "آل عمران", "Ali 'Imran", 50, 76, 200, "Medinan"],
    [4, "النساء", "An-Nisa", 77, 106, 176, "Medinan"],
    [5, "المائدة", "Al-Ma'idah", 106, 127, 120, "Medinan"],
    [6, "الأنعام", "Al-An'am", 128, 150, 165, "Meccan"],
    [7, "الأعراف", "Al-A'raf", 151, 176, 206, "Meccan"],
    [8, "الأنفال", "Al-Anfal", 177, 186, 75, "Medinan"],
    [9, "التوبة", "At-Tawbah", 187, 207, 129, "Medinan"],
    [10, "يونس", "Yunus", 208, 221, 109, "Meccan"],
    [11, "هود", "Hud", 221, 235, 123, "Meccan"],
    [12, "يوسف", "Yusuf", 235, 248, 111, "Meccan"],
    [13, "الرعد", "Ar-Ra'd", 249, 255, 43, "Medinan"],
    [14, "إبراهيم", "Ibrahim", 255, 261, 52, "Meccan"],
    [15, "الحجر", "Al-Hijr", 262, 267, 99, "Meccan"],
    [16, "النحل", "An-Nahl", 267, 281, 128, "Meccan"],
    [17, "الإسراء", "Al-Isra", 282, 293, 111, "Meccan"],
    [18, "الكهف", "Al-Kahf", 293, 304, 110, "Meccan"],
    [19, "مريم", "Maryam", 305, 312, 98, "Meccan"],
    [20, "طه", "Ta-Ha", 312, 321, 135, "Meccan"],
    [21, "الأنبياء", "Al-Anbya", 322, 331, 112, "Meccan"],
    [22, "الحج", "Al-Hajj", 332, 341, 78, "Medinan"],
    [23, "المؤمنون", "Al-Mu'minun", 342, 349, 118, "Meccan"],
    [24, "النور", "An-Nur", 350, 359, 64, "Medinan"],
    [25, "الفرقان", "Al-Furqan", 359, 366, 77, "Meccan"],
    [26, "الشعراء", "Ash-Shu'ara", 367, 376, 227, "Meccan"],
    [27, "النمل", "An-Naml", 377, 385, 93, "Meccan"],
    [28, "القصص", "Al-Qasas", 385, 396, 88, "Meccan"],
    [29, "العنكبوت", "Al-'Ankabut", 396, 404, 69, "Meccan"],
    [30, "الروم", "Ar-Rum", 404, 410, 60, "Meccan"],
    [31, "لقمان", "Luqman", 411, 414, 34, "Meccan"],
    [32, "السجدة", "As-Sajdah", 415, 417, 30, "Meccan"],
    [33, "الأحزاب", "Al-Ahzab", 418, 427, 73, "Medinan"],
    [34, "سبأ", "Saba", 428, 434, 54, "Meccan"],
    [35, "فاطر", "Fatir", 434, 440, 45, "Meccan"],
    [36, "يس", "Ya-Sin", 440, 445, 83, "Meccan"],
    [37, "الصافات", "As-Saffat", 446, 452, 182, "Meccan"],
    [38, "ص", "Sad", 453, 458, 88, "Meccan"],
    [39, "الزمر", "Az-Zumar", 458, 467, 75, "Meccan"],
    [40, "غافر", "Ghafir", 467, 476, 85, "Meccan"],
    [41, "فصلت", "Fussilat", 477, 482, 54, "Meccan"],
    [42, "الشورى", "Ash-Shura", 483, 489, 53, "Meccan"],
    [43, "الزخرف", "Az-Zukhruf", 489, 495, 89, "Meccan"],
    [44, "الدخان", "Ad-Dukhan", 496, 498, 59, "Meccan"],
    [45, "الجاثية", "Al-Jathiyah", 499, 502, 37, "Meccan"],
    [46, "الأحقاف", "Al-Ahqaf", 502, 506, 35, "Meccan"],
    [47, "محمد", "Muhammad", 507, 510, 38, "Medinan"],
    [48, "الفتح", "Al-Fath", 511, 515, 29, "Medinan"],
    [49, "الحجرات", "Al-Hujurat", 515, 517, 18, "Medinan"],
    [50, "ق", "Qaf", 518, 520, 45, "Meccan"],
    [51, "الذاريات", "Ad-Dhariyat", 520, 523, 60, "Meccan"],
    [52, "الطور", "At-Tur", 523, 525, 49, "Meccan"],
    [53, "النجم", "An-Najm", 526, 528, 62, "Meccan"],
    [54, "القمر", "Al-Qamar", 528, 531, 55, "Meccan"],
    [55, "الرحمن", "Ar-Rahman", 531, 534, 78, "Medinan"],
    [56, "الواقعة", "Al-Waqi'ah", 534, 537, 96, "Meccan"],
    [57, "الحديد", "Al-Hadid", 537, 541, 29, "Medinan"],
    [58, "المجادلة", "Al-Mujadila", 542, 544, 22, "Medinan"],
    [59, "الحشر", "Al-Hashr", 545, 548, 24, "Medinan"],
    [60, "الممتحنة", "Al-Mumtahanah", 549, 551, 13, "Medinan"],
    [61, "الصف", "As-Saff", 551, 552, 14, "Medinan"],
    [62, "الجمعة", "Al-Jumu'ah", 553, 554, 11, "Medinan"],
    [63, "المنافقون", "Al-Munafiqun", 554, 555, 11, "Medinan"],
    [64, "التغابن", "At-Taghabun", 556, 557, 18, "Medinan"],
    [65, "الطلاق", "At-Talaq", 558, 559, 12, "Medinan"],
    [66, "التحريم", "At-Tahrim", 560, 561, 12, "Medinan"],
    [67, "الملك", "Al-Mulk", 562, 564, 30, "Meccan"],
    [68, "القلم", "Al-Qalam", 564, 566, 52, "Meccan"],
    [69, "الحاقة", "Al-Haqqah", 566, 568, 52, "Meccan"],
    [70, "المعارج", "Al-Ma'arij", 568, 570, 44, "Meccan"],
    [71, "نوح", "Nuh", 570, 571, 28, "Meccan"],
    [72, "الجن", "Al-Jinn", 572, 573, 28, "Meccan"],
    [73, "المزمل", "Al-Muzzammil", 574, 575, 20, "Meccan"],
    [74, "المدثر", "Al-Muddaththir", 575, 577, 56, "Meccan"],
    [75, "القيامة", "Al-Qiyamah", 577, 578, 40, "Meccan"],
    [76, "الإنسان", "Al-Insan", 578, 580, 31, "Medinan"],
    [77, "المرسلات", "Al-Mursalat", 580, 581, 50, "Meccan"],
    [78, "النبأ", "An-Naba", 582, 583, 40, "Meccan"],
    [79, "النازعات", "An-Nazi'at", 583, 584, 46, "Meccan"],
    [80, "عبس", "Abasa", 585, 585, 42, "Meccan"],
    [81, "التكوير", "At-Takwir", 586, 586, 29, "Meccan"],
    [82, "الانفطار", "Al-Infitar", 587, 587, 19, "Meccan"],
    [83, "المطففين", "Al-Mutaffifin", 587, 589, 36, "Meccan"],
    [84, "الانشقاق", "Al-Inshiqaq", 589, 589, 25, "Meccan"],
    [85, "البروج", "Al-Buruj", 590, 590, 22, "Meccan"],
    [86, "الطارق", "At-Tariq", 591, 591, 17, "Meccan"],
    [87, "الأعلى", "Al-A'la", 591, 592, 19, "Meccan"],
    [88, "الغاشية", "Al-Ghashiyah", 592, 592, 26, "Meccan"],
    [89, "الفجر", "Al-Fajr", 593, 594, 30, "Meccan"],
    [90, "البلد", "Al-Balad", 594, 594, 20, "Meccan"],
    [91, "الشمس", "Ash-Shams", 595, 595, 15, "Meccan"],
    [92, "الليل", "Al-Layl", 595, 596, 21, "Meccan"],
    [93, "الضحى", "Ad-Duhaa", 596, 596, 11, "Meccan"],
    [94, "الشرح", "Ash-Sharh", 596, 596, 8, "Meccan"],
    [95, "التين", "At-Tin", 597, 597, 8, "Meccan"],
    [96, "العلق", "Al-'Alaq", 597, 598, 19, "Meccan"],
    [97, "القدر", "Al-Qadr", 598, 598, 5, "Meccan"],
    [98, "البينة", "Al-Bayyinah", 598, 599, 8, "Medinan"],
    [99, "الزلزلة", "Az-Zalzalah", 599, 599, 8, "Medinan"],
    [100, "العاديات", "Al-'Adiyat", 599, 600, 11, "Meccan"],
    [101, "القارعة", "Al-Qari'ah", 600, 600, 11, "Meccan"],
    [102, "التكاثر", "At-Takathur", 600, 600, 8, "Meccan"],
    [103, "العصر", "Al-'Asr", 601, 601, 3, "Meccan"],
    [104, "الهمزة", "Al-Humazah", 601, 601, 9, "Meccan"],
    [105, "الفيل", "Al-Fil", 601, 601, 5, "Meccan"],
    [106, "قريش", "Quraysh", 602, 602, 4, "Meccan"],
    [107, "الماعون", "Al-Ma'un", 602, 602, 7, "Meccan"],
    [108, "الكوثر", "Al-Kawthar", 602, 602, 3, "Meccan"],
    [109, "الكافرون", "Al-Kafirun", 603, 603, 6, "Meccan"],
    [110, "النصر", "An-Nasr", 603, 603, 3, "Medinan"],
    [111, "المسد", "Al-Masad", 603, 603, 5, "Meccan"],
    [112, "الإخلاص", "Al-Ikhlas", 604, 604, 4, "Meccan"],
    [113, "الفلق", "Al-Falaq", 604, 604, 5, "Meccan"],
    [114, "الناس", "An-Nas", 604, 604, 6, "Meccan"]
]

# Standard JUZ data (start page)
JUZ_STARTS = [
    1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 
    202, 222, 242, 262, 282, 302, 322, 342, 362, 382, 
    402, 422, 442, 462, 482, 502, 522, 542, 562, 582
]

def generate_info_toon():
    output = "surahs[114]{id,name,en_name,start_page,end_page,total_verses,revelation}:\n"
    for s in SURAH_DATA:
        output += f"  {s[0]},\"{s[1]}\",\"{s[2]}\",{s[3]},{s[4]},{s[5]},{s[6]}\n"
    
    output += "\njuzs[30]{id,start_page,end_page}:\n"
    for i, start in enumerate(JUZ_STARTS):
        juz_id = i + 1
        end = JUZ_STARTS[i+1] - 1 if i < 29 else 604
        output += f"  {juz_id},{start},{end}\n"
    
    # Minimal page map (can be expanded if we have exact verse mappings per page)
    # Ideally we'd need a map of Page -> {Juz, Rukus, SurahStart, AyahStart...}
    # For now, we will leave the pages section empty or basic as per the previous incomplete file
    # BUT, to be useful, it should have 604 entries.
    output += "\npages[604]{page,juz}:\n"
    
    # Simple Juz mapping for pages
    for p in range(1, 605):
        # Find Juz
        juz = 30
        for i, start in enumerate(JUZ_STARTS):
            if p < start:
                juz = i 
                break
        output += f"  {p},{juz}\n"

    with open("info.toon", "w") as f:
        f.write(output)
    print("info.toon generated.")

def update_toon_file(filename, header_mod, row_mod):
    try:
        with open(filename, 'r') as f:
            lines = f.readlines()
        
        new_lines = []
        is_data = False
        header_processed = False
        
        count = 0
        
        for line in lines:
            line = line.strip()
            if not line:
                new_lines.append("\n")
                continue
                
            if line.startswith("meta:") or (line.startswith("  ") and not is_data):
                new_lines.append(line + "\n")
                continue
                
            if "[" in line and "]{" in line:
                # This is the header line
                is_data = True
                new_lines.append(header_mod(line) + "\n")
                continue
            
            if is_data:
                count += 1
                new_lines.append(row_mod(line, count) + "\n")
        
        with open(filename, 'w') as f:
            f.writelines(new_lines)
        print(f"Updated {filename}")
        
    except FileNotFoundError:
        print(f"File {filename} not found, skipping.")

def add_serial_to_tafsirs():
    def header(h):
        # tafsirs[45]{id,name...} -> tafsirs[45]{no,id,name...}
        return h.replace("{id,", "{no,id,")
    
    def row(r, i):
        return f"  {i},{r.strip()}"
        
    update_toon_file("tafsirs.toon", header, row)

def add_serial_to_translations():
    def header(h):
        return h.replace("{id,", "{no,id,")
    
    def row(r, i):
        return f"  {i},{r.strip()}"
    
    update_toon_file("translations.toon", header, row)

def add_serial_to_recitations():
    # Recitations already has IDs 1, 2, 3... which act as serials.
    # Let's check if we need to make it explicit or if the ID column is sufficient.
    # The user asked to add "serial no column".
    # reciters[21]{id,name...}
    # We can add a 'no' column at the start or assume ID is the serial.
    # Given the request, I'll add a distinct 'no' column to be safe and consistent with others.
    
    def header(h):
        return h.replace("{id,", "{no,id,")
    
    def row(r, i):
        return f"  {i},{r.strip()}"
    
    update_toon_file("recitations.toon", header, row)

if __name__ == "__main__":
    generate_info_toon()
    add_serial_to_tafsirs()
    add_serial_to_translations()
    add_serial_to_recitations()
