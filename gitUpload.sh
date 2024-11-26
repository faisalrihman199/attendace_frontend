#!/bin/bash

# Check if a commit message is provided
if [ -z "$1" ]; then
    echo "Error: Commit message is required."
    echo "Usage: ./uploadGit.sh \"Your commit message\""
    exit 1
fi

# Add all changes to staging
git add .

# Commit with the provided message
git commit -m "$1"

# Push changes to the main branch
git push origin main

echo "Changes pushed to GitHub with commit message: '$1'"
