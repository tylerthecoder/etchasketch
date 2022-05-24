import { Game } from "./game.ts"
import { Application, Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";

const app = new Application();
const games = new Game();
const router = new Router();

router
	.get("/ws", async (ctx) => {
		console.log("WS connection");
		const socket = await ctx.upgrade();
		socket.onopen = () => {
			console.log("socket opened");
			games.addPlayer(socket);
		}
	})
	.post(
		'/upload',
		async (ctx) => {
			const body = await ctx.request.body({ type: 'form-data' })
			const data = await body.value.read()
			console.log(data)
		})

app.use(router.routes());
app.use(router.allowedMethods());

// Send static content
app.use(async (context) => {
	await context.send({
		root: `${Deno.cwd()}/web`,
		index: "index.html",
	});
});

await app.listen({
	port: 3000
})
