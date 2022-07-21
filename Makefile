
api:
	deno run --watch --allow-net --allow-read -r ./server/server.ts


# Sends a file to the model backend for prediction
send-file:
	curl -F 'file=@images/face.jpg' localhost:5000/model_backend/predict