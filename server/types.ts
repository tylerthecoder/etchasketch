
export enum SocketMessageType {
	Move = "move",
	StartGame = "startGame",
}

export interface SocketData {
	[SocketMessageType.Move]: {
		x: number,
		y: number
	}
	[SocketMessageType.StartGame]: {
		word: string
	}
}

export type SocketMessage<T extends SocketMessageType = SocketMessageType.Move> = {
	type: SocketMessageType,
	data: SocketData[T]
}


export type ImageGuess = {
	name: string,
	score: number,
}

export type ImageScore = [];

