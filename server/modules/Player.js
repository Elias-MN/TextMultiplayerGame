export class Player {
    constructor(ws, playerName, lifesMax = 2) {
        this.ws = ws
        this.playerName = playerName;
        this.lifesMax = lifesMax;
        this.lifes = lifesMax;
    }
}
