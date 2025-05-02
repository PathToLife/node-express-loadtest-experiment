import type { PerformanceTimer } from "./utils/performance-timer";

declare global {
  namespace Express {
    export interface Request {
      perfTimer: PerformanceTimer;
    }
  }
}
