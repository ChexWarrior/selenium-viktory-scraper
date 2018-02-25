#!/usr/bin/env bash

set -e

OPERATION="$1"

if [[ $OPERATION == start ]]; then
  docker network create --driver bridge selenium-web
  docker container run --rm -dp 4444:4444 --network selenium-web \
                       --name selenium-hub selenium/hub
  docker container run -d --rm --network selenium-web \
                       -e HUB_HOST=selenium-hub --name selenium-firefox \
                       selenium/node-firefox
else
  HUB_CID=$(docker container ls --format "{{.ID}}" --filter=name=selenium-hub)
  FF_CID=$(docker container ls --format "{{.ID}}" --filter=name=selenium-firefox)

  echo "selenium-hub container id: $HUB_CID"
  echo "selenium-firefox container id: $FF_CID"

  docker container stop $HUB_CID $FF_CID
  docker network rm selenium-web
fi