#!/bin/bash

# NOTE Starting Prometheus in background 
nohup ./prometheus/bin/prometheus --config.file=/prometheus/etc/prometheus/prometheus.yml >>/dev/null 2>>/dev/null &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start Prometheus service: $status"
  exit $status
fi

# NOTE Starting NodeJS server in background 
nohup node node-server.js >>/dev/null 2>>/dev/null &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start NodeJS server: $status"
  exit $status
fi

while sleep 60; do
  # NOTE: Finding Prometheus service 
  ps aux |grep prometheus |grep -q -v grep
  PROMETHEUS_STATUS=$?
  # NOTE: Finding NodeJS service
  ps aux |grep nodejs |grep -q -v grep
  NODEJS_STATUS=$?
  # NOTE: Status 0 - something has been found (process has been launched);
  # If both statuses doesn't equal to 0, then something is wrong.
  if [ $PROMETHEUS_STATUS -ne 0 -o $NODEJS_STATUS -ne 0 ]; then
    echo "One of the services has terminated."
    exit 1
  fi
done
