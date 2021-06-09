#! /usr/bin/env sh
set -e


apt-get update && pip install --no-cache-dir matplotlib pandas && \
pip install --no-cache-dir -r lin-reqs.txt