import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

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

	drawCircle(x, y, r, color) {
		this.#ctx.beginPath();
		this.#ctx.arc(x, y, r, 0, 2 * Math.PI);
		this.#ctx.fillStyle = color;
		this.#ctx.fill();
		this.#ctx.closePath();
	}

	getBlob() {
		return this.#e.toDataURL();
	}
}

class API {
	#socket;
	constructor() {
		this.socket = io(location.hostname + ":3000");
	}

	sendDot(data) {
		this.socket.emit("move", data);
	}

	onData(func) {
		this.socket.on("move", func);
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

		this.window.addEventListener("keydown", (e) => {
			if (e.key === "s") {
				this.game.save();
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
		api.onData((data) => {
			otherCanvas.drawCircle(data.x / (500 / 200), data.y / (500 / 200), 1, 'blue');
		});

		requestAnimationFrame(this.update.bind(this));
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
		canvas.drawCircle(this.x, this.y, 1, 'red');
	}

	save() {
		const blob = canvas.getBlob();



	}
}


const canvas = new Canvas("canvas");
const otherCanvas = new Canvas("otherCanvas");
const api = new API();
window.game = new Game();
const controller = new GameController(window.game);







