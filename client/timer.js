export class GameTimer {
    constructor(onTick, onTimeout) {
        this.timeLeft = 0;
        this.intervalId = null;
        this.onTick = onTick;
        this.onTimeout = onTimeout;
    }
}

startRandomDuration(min = 15, max = 35) {
        this.stop();
        this.timeLeft = Math.floor(Math.random() * (max - min + 1) + min);

        if (this.onTick) this.onTick(this.timeLeft);

        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    tick() {
        this.timeLeft--;
        if (this.onTick) this.onTick(this.timeLeft);

        if (this.timeLeft <= 0) {
            this.stop();
            if (this.onTimeout) this.onTimeout();
        }
    }