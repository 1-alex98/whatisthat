#!/bin/bash
cd app
npm install
npm run-script build
cd ..
cp -r app/build src/main/resources/app
./gradlew installDist
docker build -t what-is-that .
