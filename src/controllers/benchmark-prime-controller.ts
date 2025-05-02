import { fibonacciRecursive } from "../services/fibonnacci-prime";
import { Worker } from "node:worker_threads";
import path from "node:path";

class BenchmarkPrimeController {
  // this needs to be updated / dynamically resolved -
  // if the server is to be run in distribution format
  readonly workerFilepath: string = path.join(
    __dirname,
    "../services/fibonnacci-prime.js"
  );

  public async runEventThread() {
    return fibonacciRecursive(30);
  }

  public async runWorkerThread() {
    return new Promise((resolve, reject) => {
      const worker = new Worker(this.workerFilepath, {
        workerData: 30,
      });
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  }
}

export const createBenchmarkPrimeController = () =>
  new BenchmarkPrimeController();
