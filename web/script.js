class Canvas {
	#e;
	#ctx;

	constructor(id) {
		this.#e = document.getElementById(id);
		this.#ctx = this.#e.getContext('2d');
	}

	addEventListener(type, listener) {
		this.#e.addEventListener(type, listener);
	}

	get width() {
		return this.#e.width;
	}

	get height() {
		return this.#e.height;
	}

	drawCircle(x, y, color) {
		const r = this.#e.width / 32;
		this.#ctx.beginPath();
		this.#ctx.arc(x, y, r, 0, 2 * Math.PI);
		this.#ctx.fillStyle = color;
		this.#ctx.fill();
		this.#ctx.closePath();
	}

	getBlob() {
		return new Promise(resolve => {
			this.#e.toBlob(blob => resolve(blob), "image/jpeg");
		});
	}

	showObjectPrompt(word) {
		document.getElementById("subtitle").innerHTML = `Draw a ${word}!`;
	}
}

class API {
	#socket;

	onMove;
	onStart;

	constructor() {
		this.#socket = new WebSocket("ws://" + location.host + "/ws")

		this.#socket.addEventListener("open", () => {
			console.log("Socket Opened")
		});

		this.#socket.addEventListener("message", (e) => {
			const data = JSON.parse(e.data);
			if (data.type === "move") {
				this.onMove(data.data);
			} else if (data.type === "startGame") {
				this.onStart(data.data);
			}
		});
	}

	sendDot(data) {
		this.#socket.send(JSON.stringify({
			type: "move",
			data
		}));
	}

}

class GameController {
	constructor(game) {
		canvas.addEventListener("mousedown", () => game.drawing = true)
		canvas.addEventListener("mousemove", (e) => {
			if (e.buttons % 2 === 1) {
				game.pointerX = e.offsetX;
				game.pointerY = e.offsetY;
			}
		});
		canvas.addEventListener("mouseup", () => game.drawing = false);

		window.addEventListener("keydown", (e) => {
			if (e.key === "s") {
				game.save();
			}
		});

		canvas.addEventListener("touchstart", () => game.drawing = true);
	}
}


class Game {
	x = 10;
	y = 10;
	speed = 1;

	pointerX = 0;
	pointerY = 0;
	drawing = false;

	constructor() {
		api.onMove = data => {
			otherCanvas.drawCircle(data.x / (500 / 200), data.y / (500 / 200), 'blue');
		};

		api.onStart = data => {
			this.start(data);
		};

		requestAnimationFrame(this.update.bind(this));
	}

	start(data) {
		canvas.showObjectPrompt(data.word);
	}

	move() {
		const dx = this.pointerX - this.x;
		const dy = this.pointerY - this.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist === 0) return;
		const mx = (dx / dist) * this.speed;
		const my = (dy / dist) * this.speed;
		this.x += mx;
		this.y += my;
		api.sendDot({ x: this.x, y: this.y })
		this.draw();
	}

	update() {
		if (this.x < 0) this.x = 0;
		if (this.x > canvas.width) this.x = canvas.width;
		if (this.y < 0) this.y = 0;
		if (this.y > canvas.height) this.y = canvas.height;
		if (this.drawing) {
			this.move();
		}
		requestAnimationFrame(this.update.bind(this));
	}

	draw() {
		canvas.drawCircle(this.x, this.y, 'red');
	}

	async save() {
		const blob = await canvas.getBlob();
		const file = new File([blob], "file.jpg", { type: "image/jpeg" });
		console.log(file)
		const form = new FormData()
		form.append('file', blob)
		await fetch('/upload', {
			method: 'POST',
			body: form
		})
	}
}


const canvas = new Canvas("canvas");
const otherCanvas = new Canvas("otherCanvas");
const api = new API();
window.game = new Game();
const controller = new GameController(window.game);







