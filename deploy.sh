#!/bin/bash
git fetch
status=$(git status)
if [[ "$status" == *"Your branch is behind"* ]]; then
  git pull
  docker-compose up -d --build
fi