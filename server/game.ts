

export class Game {
	private player1: WebSocket | null = null;
	private player2: WebSocket | null = null;

	constructor() { }

	canAddPlayer() {
		return this.player1 === null || this.player2 === null;
	}

	addPlayer(player: WebSocket) {
		if (!this.player1) {
			this.player1 = player;
			console.log("Player 1 Connection");
		} else if (!this.player2) {
			this.player2 = player;
			console.log("Player 2 Connection");
		} else {
			console.log("Too many players");
		}
	}

}