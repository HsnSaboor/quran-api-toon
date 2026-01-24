#!/bin/bash

# --- CONFIGURATION ---
THREADS=6
BATCH_SIZE=20000
BRANCH_NAME="main"
LOG_FILE="push_status.log"

# --- GIT OPTIMIZATION ---
git config core.compression 0
git config pack.window 0
git config pack.depth 0
git config pack.threads $THREADS
git config http.postBuffer 524288000
git config gc.auto 0

log() {
    echo -e "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# --- PIPELINE FUNCTION ---
wait_for_push() {
    if [ -n "$PUSH_PID" ]; then
        log "Waiting for previous background push (PID $PUSH_PID) to finish..."
        wait "$PUSH_PID"
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 0 ]; then
            log "Previous push completed successfully."
        else
            log "Previous push FAILED! Retrying completely..."
            # Simple retry strategy: if async push fails, we must retry it synchronously
            # But since we already amended locally, we just push again.
            git push -u origin $BRANCH_NAME --force
        fi
        PUSH_PID=""
    fi
}

# --- 1. CLEANUP ---
rm -f push_list_* remaining_files.txt

# --- 2. IDENTIFY FILES ---
log "Scanning for files..."
git ls-files --others --exclude-standard > remaining_files.txt
git ls-files --modified >> remaining_files.txt

TOTAL_FILES=$(wc -l < remaining_files.txt)
log "Found $TOTAL_FILES files to upload."

if [ "$TOTAL_FILES" -eq 0 ]; then
    log "No changes found. Force pushing current state..."
    git push -u origin $BRANCH_NAME --force
    exit 0
fi

# --- 3. SPLIT ---
split -l $BATCH_SIZE remaining_files.txt push_list_

# --- 4. PIPELINED LOOP ---
BATCH_NUM=0
PUSH_PID=""

for batch in push_list_*; do
    ((BATCH_NUM++))
    
    # CRITICAL: We MUST wait for the previous push to finish before we start 
    # AMENDING the commit locally. Otherwise, we change the HEAD pointer 
    # while git is trying to read it for the push, which causes corruption/failure.
    wait_for_push

    log "Preparing Batch $BATCH_NUM..."

    # Add files
    cat "$batch" | xargs -d '\n' git add

    # Commit (Amend)
    if git rev-parse --verify HEAD >/dev/null 2>&1; then
        git commit --amend --no-edit --quiet --allow-empty
    else
        log "Initial commit..."
        git commit -m "Fresh start: Quran API Data" --quiet
    fi
    
    log "Batch $BATCH_NUM staged and amended."

    # START BACKGROUND PUSH
    log "Starting background push for Batch $BATCH_NUM..."
    git push -u origin $BRANCH_NAME --force > /dev/null 2>&1 &
    PUSH_PID=$!
    log "Push started in background (PID $PUSH_PID). Moving to next batch..."

    rm "$batch"
done

# --- 5. FINAL WAIT ---
log "All batches processed locally. Waiting for final push..."
wait_for_push
rm -f remaining_files.txt
log "Done. Repository synchronized."
