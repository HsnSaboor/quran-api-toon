#!/bin/bash

# Configuration
BATCH_SIZE=50000

echo "--- STARTING INTERACTIVE PUSH SESSION ---"
echo "Target: Simplified Page-based Structure"

# 1. Performance Tuning
echo "Optimizing Git for large repository..."
git config http.postBuffer 524288000
git config core.preloadindex true
git config core.fscache true
git config gc.auto 0

# 2. Batch Staging and Committing
echo "Identifying changes..."
# Get list of all changed/deleted/untracked files
# This can take a while for 1.6M files
mapfile -t files < <(git ls-files --deleted --modified --others --exclude-standard)

total_files=${#files[@]}
echo "Total changes detected: $total_files"

if [ "$total_files" -gt 0 ]; then
    echo "Starting batch commit process (Batch size: $BATCH_SIZE)..."
    
    for ((i=0; i<total_files; i+=BATCH_SIZE)); do
        batch=("${files[@]:i:BATCH_SIZE}")
        echo "Processing batch $((i/BATCH_SIZE + 1)) (Files $i to $((i + ${#batch[@]})))..."
        
        # Add the specific batch of files
        git add "${batch[@]}"
        
        # Commit the batch
        git commit -m "Refactor batch $((i/BATCH_SIZE + 1)): processing $total_files files" --quiet
        echo "Batch $((i/BATCH_SIZE + 1)) committed."
    done
    echo "All changes committed in batches."
else
    echo "No changes to commit."
fi

# 3. Resumable Pushing Loop
echo "Entering push loop (Automatic retry enabled)..."
while true; do
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main 2>/dev/null || echo "0")

    if [ "$LOCAL" == "$REMOTE" ]; then
        echo "SUCCESS: Remote is up to date with Local."
        break
    fi

    echo "Pushing to GitHub... (Time: $(date '+%H:%M:%S'))"
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "Push completed successfully."
        break
    else
        echo "Push interrupted or timed out. Retrying in 30 seconds..."
        sleep 30
    fi
done

echo "--- SESSION COMPLETE ---"
