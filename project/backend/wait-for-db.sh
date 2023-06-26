#!/usr/bin/env bash

HOSTPORT=$1
COMMAND=("${@:3}")

wait_for() {
    HOST="${HOSTPORT%:*}"
    PORT="${HOSTPORT#*:}"

    echo "Waiting for $HOST:$PORT to be available..."
    start_ts=$(date +%s)
    while :
    do
        if (echo -n > /dev/tcp/$HOST/$PORT) >/dev/null 2>&1; then
            end_ts=$(date +%s)
            echo "$HOST:$PORT is available after $((end_ts - start_ts)) seconds!"
            break
        fi
        sleep 1
    done
}

wait_for
"${COMMAND[@]}"

# File was heavily inspired by wait-for-it.sh
# https://github.com/vishnubob/wait-for-it/tree/master