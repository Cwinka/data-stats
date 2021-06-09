#! /usr/bin/env sh
set -e

export APP_MODULE="main:app"
export WORKER="uvicorn.workers.UvicornH11Worker"
export NUM_WORKERS=${WORKERS:-"2"}
export HOST=${HOST:-'0.0.0.0'}
export PORT=${PORT:-"5000"}

exec gunicorn -w "$NUM_WORKERS" -k "$WORKER" "$APP_MODULE" -b "$HOST":"$PORT"
