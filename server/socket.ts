async function handleConn(conn: Deno.Conn) {
	const httpConn = Deno.serveHttp(conn);

	for await (const e of httpConn) {
		e.respondWith(handle(e.request));
	}
}

const games = new Game();

function handle(req: any) {
	if (req.headers.get("upgrade") != "websocket") {
		return new Response("not trying to upgrade as websocket.");
	}

	// Upgrade the incoming HTTP request to a WebSocket connection
	const { socket, response } = Deno.upgradeWebSocket(req);
	socket.onopen = () => console.log("socket opened");
	socket.onmessage = (e) => {
		console.log("socket message:", e.data);
		socket.send(new Date().toString());
	};
	socket.onerror = (e) => console.log("socket errored:", e);
	socket.onclose = () => console.log("socket closed");

	return response;
}

const listener = Deno.listen({ hostname: "localhost", port: 8080 });

for await (const conn of listener) {
	handleConn(conn);
}