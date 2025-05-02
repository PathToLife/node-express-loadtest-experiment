#!/bin/bash

BASEURL='http://localhost:3000'
CONCURRENT_REQUESTS=100

# Kills wrt background process on script early exit
trap "exit" INT TERM
trap "kill 0" EXIT

# Usage:
# benchmark.sh worker
# benchmark.sh single
# benchmark.sh --help

# Handle arguments
if [ "$1" == "worker" ]; then
   MODE="worker"
elif [ "$1" == "single" ]; then
  MODE="single"
elif [ "$1" == "--help" ]; then
  echo "Usage:"
  echo "benchmark.sh worker"
  echo "benchmark.sh single"
  echo "benchmark.sh --help"
  exit 0
else
  echo "Invalid argument. Use 'worker', 'single', or '--help'."
  exit 1
fi

# Functions for benchmark tests
parallel_api_call_sim() {
  time curl "${BASEURL}/hello" --max-time 1 --silent --show-error --max-time 1 --fail -o /dev/null
  if [ $? -eq 0 ]; then
      echo "Parallel Curl ${BASEURL}/hello succeeded!"
  else
      echo "Parallel Curl ${BASEURL}/hello failed. This means server has performance issues"
  fi
}

run_worker_test() {
  wrk -t12 "-c${CONCURRENT_REQUESTS}" -d10s "$BASEURL/prime/$MODE" &
  sleep 2s;
  parallel_api_call_sim
}

run_single_test() {
  wrk -t12 "-c${CONCURRENT_REQUESTS}" -d10s "$BASEURL/prime/$MODE" &
  sleep 2s;
  parallel_api_call_sim
}
# Execute the selected test
if [ "$MODE" == "worker" ]; then
  run_worker_test
elif [ "$MODE" == "single" ]; then
  run_single_test
fi

sleep 2s