class Timer {
  constructor(title, delay, stopCount) {
    this.title = title;
    this.delay = delay;
    this.stopCount = stopCount;
    this.intervalId = null;
  }

  start() {
    console.log(`Timer ${this.title} started (delay=${this.delay}, stopCount=${this.stopCount})`);
    this.intervalId = setInterval(() => this.tick(), this.delay);
  }

  tick() {
    console.log(`Timer ${this.title} Tick! | cycles left ${this.stopCount}`);
    this.stopCount--;
    if (this.stopCount === 0) {
      this.stop();
    }
  }

  stop() {
    console.log(`Timer ${this.title} stopped`);
    clearInterval(this.intervalId);
  }
}

function runTimer(title, delay, stopCount) {
  const timer = new Timer(title, delay, stopCount);
  timer.start();
}

/*// Test case
runTimer("Bleep", 1000, 5);
*/