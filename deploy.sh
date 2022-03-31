#!/bin/bash
date
git fetch
status=$(git status)
touch config/traefik/acme.json
chmod 600 config/traefik/acme.json
if [[ "$status" == *"Your branch is behind"* ]]; then
  git reset --hard
  git pull
  git update-index --assume-unchanged config/traefik/acme.json
  docker-compose up -d --build
fi