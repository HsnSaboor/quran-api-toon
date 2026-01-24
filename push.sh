#!/bin/bash

# --- CONFIGURATION ---
BATCH_SIZE=10000
BRANCH_NAME="main"
LOG_FILE="fresh_migration.log"

# Performance Tuning
git config pack.threads 8
git config http.postBuffer 524288000
git config core.compression 0

# --- COLORS ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    local msg="$1"
    echo -e "$msg"
    echo -e "[$(date '+%H:%M:%S')] $msg" | sed 's/\x1b\[[0-9;]*m//g' >> "$LOG_FILE"
}

# 1. CLEANUP
rm -f batch_fresh_* remaining_files.txt

# 2. SCANNING
log "${YELLOW}Scanning for all files...${NC}"
git ls-files --others --exclude-standard > remaining_files.txt

REMAINING_COUNT=$(wc -l < remaining_files.txt)

if [ "$REMAINING_COUNT" -eq "0" ]; then
    log "${GREEN}No files found. Exiting.${NC}"
    exit 0
fi

log "${GREEN}Found $REMAINING_COUNT files to upload.${NC}"

# 3. SPLIT
split -l $BATCH_SIZE remaining_files.txt batch_fresh_

# 4. PROCESSING LOOP
BATCH_NUM=0
for batch in batch_fresh_*; do
    ((BATCH_NUM++))
    log "${CYAN}Processing Batch $BATCH_NUM${NC}"

    # Add files
    cat "$batch" | xargs -d '\n' git add

    if ! git diff --cached --quiet; then
        git commit -m "Fresh start: Batch $BATCH_NUM" --quiet
        
        log "${YELLOW}Pushing Batch $BATCH_NUM...${NC}"
        if git push -u origin $BRANCH_NAME --force; then
            log "${GREEN}Batch $BATCH_NUM pushed successfully.${NC}"
        else
            log "${RED}Push failed for Batch $BATCH_NUM. Retrying in 30s...${NC}"
            sleep 30
            git push -u origin $BRANCH_NAME --force
        fi
    fi
    rm "$batch"
done

log "${GREEN}All Done. Fresh migration complete.${NC}"
