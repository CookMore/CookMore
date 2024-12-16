#!/bin/bash

# Get current branch name
current_branch=$(git branch --show-current)

echo "Currently on branch: $current_branch"

# Reset any local changes
echo "Resetting local changes..."
git reset --hard HEAD

# Pull updates from remote
echo "Pulling updates from remote..."
git pull origin $current_branch

echo "Done!" 