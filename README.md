# Load Testing NodeJS. Worker Threads Experiment

A benchmark script stresses the server (using [wrk](https://formulae.brew.sh/formula/wrk)) and runs a parallel curl to see if a standard api call returns.

The server calculates fibonacci n=30 on every api call to `GET /prime/<single|worker>`.

## Results

API routes will timeout if we try to calculate fibonacci too much on the main event loop (100 concurrent requests). Use worker threads for computationally expensive operations. The startup cost of worker threads does add an overhead, so consider experimenting with worker pools.

```
$ ./benchmark.sh single 

Running 10s test @ http://localhost:3000/prime/single
  12 threads and 100 connections
curl: (28) Operation timed out after 1004 milliseconds with 0 bytes received

real    0m1.014s
user    0m0.003s
sys     0m0.003s
Parallel Curl http://localhost:3000/hello failed. This means server has performance issues
```

```
$ ./benchmark.sh worker

Running 10s test @ http://localhost:3000/prime/worker
  12 threads and 100 connections

real    0m0.023s
user    0m0.004s
sys     0m0.004s
Parallel Curl http://localhost:3000/hello succeeded!
```

## Install

1. Use linux
2. Install https://github.com/wg/wrk (If using benchmark.sh)
3. pnpm install
4. pnpm run start
5. ./benchmark.sh

Please reduce `CONCURRENT_REQUESTS` in `benchmark.sh` if `worker` mode is timing out.
If `single` mode is not timing out, please try increasing `CONCURRENT_REQUESTS` instead.

##  API

### GET /hello

Returns hello world. Load the server and try this route in parallel. It should return.

### GET /prime/worker

Running in a worker thread has a slower single shot return, however server **will not timeout** for other api requests

```json
{
  "msg": {
    "res": 832040
  },
  "durationAfterRequestAccept": "/prime/worker[9956]: 80.308ms"
}
```

### GET /prime/single

Running in the main thread has a faster single shot return, however **will timeout** server if underload.

```json
{
  "msg": 832040,
  "durationAfterRequestAccept": "/prime/single[9958]: 10.911ms"
}
```
