import express, { RequestHandler } from "express";
import { startTimer } from "./utils/performance-timer";
import { createBenchmarkPrimeController } from "./controllers/benchmark-prime-controller";
const PORT = 3000;

const app = express();
const benchmarkPrimeController = createBenchmarkPrimeController();

app.use((req, res, next) => {
  req.perfTimer = startTimer(req.url);
  next();
});

const benchmarkResponseWrapper =
  <ResponseData = unknown>(
    cb: () => ResponseData | Promise<ResponseData>
  ): RequestHandler =>
  async (req, res) => {
    const responseData = await cb();
    res.json({
      msg: responseData ?? null,
      durationAfterRequestAccept: req.perfTimer.stopAndString(),
    });
  };

app.get(
  "/prime/single",
  benchmarkResponseWrapper(() => benchmarkPrimeController.runEventThread())
);

app.get(
  "/prime/worker",
  benchmarkResponseWrapper(() => benchmarkPrimeController.runWorkerThread())
);

app.get(
  "/hello",
  benchmarkResponseWrapper(() => "hello-world")
);

app.get(
  "/",
  benchmarkResponseWrapper(() => ({
    paths: serverPaths,
  }))
);

const serverPaths: string[] = app.router.stack
  .map((r) => r.route?.path)
  .filter((path) => path != null)
  .sort();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log("Paths:");
  for (const p of serverPaths) {
    console.log("\t" + p);
  }
});
