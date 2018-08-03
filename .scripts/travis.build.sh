#!/bin/sh
cd $TRAVIS_BUILD_DIR/$PROJECT
npm ci
npm test
npm build
