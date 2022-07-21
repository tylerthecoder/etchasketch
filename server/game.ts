import { SocketMessageType, SocketMessage } from "./types.ts"

const possibleObjects = (await Deno.readTextFile("./assets/class_names.txt")).split("\n");


export class Game {
	private player1: WebSocket | null = null;
	private player2: WebSocket | null = null;

	constructor() { }

	canAddPlayer() {
		return this.player1 === null || this.player2 === null;
	}

	addPlayer(player: WebSocket) {
		player.onmessage = (e) => {
			const data = JSON.parse(e.data) as SocketMessage;
			console.log("Got Data", data);
			if (data.type === SocketMessageType.Move) {
				if (player === this.player1) {
					this.player2?.send(JSON.stringify(data.data));
				} else if (player === this.player2) {
					this.player1?.send(JSON.stringify(data.data));
				}
			}
		}

		player.onclose = () => {
			if (player === this.player1) {
				this.player1 = null;
				console.log("Player 1 Disconnected");
			} else if (player === this.player2) {
				this.player2 = null;
				console.log("Player 2 Disconnected");
			}
		}


		if (!this.player1) {
			this.player1 = player;
			console.log("Player 1 Connection");
		} else if (!this.player2) {
			this.player2 = player;
			console.log("Player 2 Connection");
			this.startGame();
		} else {
			console.log("Too many players");
		}
	}

	startGame() {
		console.log("Starting Game");
		// Pick a word and send it to both players
		const word = possibleObjects[Math.floor(Math.random() * possibleObjects.length)];

		// Send both players the word
		this.player1?.send(JSON.stringify({
			type: SocketMessageType.StartGame,
			data: {
				word
			}
		}));

		this.player2?.send(JSON.stringify({
			type: SocketMessageType.StartGame,
			data: {
				word
			}
		}));

	}

	checkImage(image: number) {


	}

}