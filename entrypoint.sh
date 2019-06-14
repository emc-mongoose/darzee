#!/bin/bash

# NOTE: The file contains script for starting up Darzee's supporting services.
# NOTE Starting Prometheus in background 
nohup .prometheus//prometheus/bin/prometheus --config.file=/prometheus/etc/prometheus/prometheus.yml >>/dev/null 2>>/dev/null &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start Prometheus service: $status"
  exit $status
fi

# NOTE Starting NodeJS server in background 
nohup node prometheus/prometheus/server/node-server.js >>/dev/null 2>>/dev/null &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start NodeJS server: $status"
  exit $status
fi
