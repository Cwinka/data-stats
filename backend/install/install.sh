#! /usr/bin/env sh
set -e


apt-get update && pip install --no-cache-dir matplotlib pandas && \
python -m pip install --upgrade pip
pip install --no-cache-dir -r lin-reqs.txt