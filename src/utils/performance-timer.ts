export class PerformanceTimer {
  private startHrTime: [number, number] | null = null;
  private elapsedMs: number | null = null;

  constructor(public readonly name: string) {
    this.start();
  }

  private start() {
    this.startHrTime = process.hrtime();
  }

  public stopAndString(): string {
    const elapsed = this.stop();
    return `${this.name}: ${elapsed.toFixed(3)}ms`;
  }

  public stop() {
    if (!this.startHrTime) {
      throw Error("timer was not started");
    }
    if (this.elapsedMs) {
      return this.elapsedMs;
    }
    this.elapsedMs = this.getElapsed();
    return this.elapsedMs;
  }

  private hrTimeToMs(hrTime: [number, number]): number {
    return hrTime[0] * 1000 + hrTime[1] / 1000000;
  }

  public getElapsed(): number {
    if (this.elapsedMs) {
      return this.elapsedMs;
    }
    if (!this.startHrTime) {
      throw Error("timer was not started");
    }
    return this.hrTimeToMs(process.hrtime(this.startHrTime));
  }
}

let count = 0;

export function startTimer(name: string): PerformanceTimer {
  count += 1;
  return new PerformanceTimer(`${name}[${count}]`);
}
