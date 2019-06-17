#!/bin/bash

# NOTE: The file contains script for starting up Darzee's supporting services.
# NOTE Starting Prometheus in background 
nohup /./prometheus/bin/prometheus --config.file=/prometheus/prometheus/server/prometheus.yml --web.enable-lifecycle 2> prometheus_logs.txt &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start Prometheus service: $status"
  exit $status
fi

# NOTE Starting NodeJS server in background 
nohup node prometheus/prometheus/server/node-server.js 2> server_logs.txt &

while true; do
  ps aux |grep prometheus 2> dev/null &
done

echo "Darzee has started."