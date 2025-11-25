export class GameTimer {
    constructor(onTick, onTimeout) {
        this.timeLeft = 0;
        this.intervalId = null;
        this.onTick = onTick;
        this.onTimeout = onTimeout;
    }
}