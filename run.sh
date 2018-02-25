#!/usr/bin/env bash

docker container run --rm -v "$PWD":/usr/src/app \
                     --network selenium-web \
                     chexwarrior/headless-ff "$1"