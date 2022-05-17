// Create a server that listens on port 3000
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import multer from "multer";

const upload = multer({ dest: '/tmp/' });

const httpServer = createServer();
const io = new Server(httpServer, {
	// options
	cors: {
		origin: "*",
	}
});

let player1;
let player2;

io.on("connection", (socket) => {

	if (!player1) {
		player1 = socket;
		console.log("Player 1 Connection");
	} else if (!player2) {
		player2 = socket;
		console.log("Player 2 Connection");
	} else {
		console.log("Too many players");
	}

	socket.on("disconnect", async () => {
		if (socket === player1) {
			player1 = null;
			console.log("Player 1 Disconnected");
		} else if (socket === player2) {
			player2 = null;
			console.log("Player 2 Disconnected");
		}
	});


	socket.on("move", (data) => {
		if (socket === player1) {
			player2?.emit("move", data);
		} else if (socket === player2) {
			player1?.emit("move", data);
		}
	});
});


io.on("draw", () => {

})

httpServer.listen(3000);
pp = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.post('/', upload.any(), (req, res) => {
	res.send(req.files);
});
app.listen(3000, () => console.log('Servering Started !'));


