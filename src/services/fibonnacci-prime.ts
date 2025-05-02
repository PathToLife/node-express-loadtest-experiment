import { workerData, isMainThread, parentPort } from "node:worker_threads";

// Recursion was selected due to similarities to a production workload
export function fibonacciRecursive(n: number): number {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

export type FibonacciWorkerResult = {
  err?: string;
  res: number;
};

function returnResult(res: number) {
  parentPort?.postMessage({
    err: undefined,
    res: res,
  } satisfies FibonacciWorkerResult);
}

function returnError(msg: string) {
  parentPort?.postMessage({
    err: msg,
    res: -1,
  } satisfies FibonacciWorkerResult);
}

function main() {
  if (isMainThread) {
    return;
  }

  const input = workerData;
  if (typeof input !== "number") {
    returnError("input must be typeof number");
    return;
  }

  const result = fibonacciRecursive(input);
  returnResult(result);
}

main();
