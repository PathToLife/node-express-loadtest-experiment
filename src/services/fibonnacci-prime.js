var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/fibonnacci-prime.ts
var fibonnacci_prime_exports = {};
__export(fibonnacci_prime_exports, {
  fibonacciRecursive: () => fibonacciRecursive
});
module.exports = __toCommonJS(fibonnacci_prime_exports);
var import_node_worker_threads = require("node:worker_threads");
function fibonacciRecursive(n) {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}
function returnResult(res) {
  import_node_worker_threads.parentPort?.postMessage({
    err: void 0,
    res
  });
}
function returnError(msg) {
  import_node_worker_threads.parentPort?.postMessage({
    err: msg,
    res: -1
  });
}
function main() {
  if (import_node_worker_threads.isMainThread) {
    return;
  }
  const input = import_node_worker_threads.workerData;
  if (typeof input !== "number") {
    returnError("input must be typeof number");
    return;
  }
  const result = fibonacciRecursive(input);
  returnResult(result);
}
main();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fibonacciRecursive
});
