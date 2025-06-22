import { env } from "env";
import * as http from "http";
import { initMediasoupWorker } from "mediasoup/methods/worker";
import { createSocketServer } from "websocket/io";

async function main() {
  await initMediasoupWorker();

  const httpServer = http.createServer();

  createSocketServer(httpServer);

  httpServer.listen(env.BACKEND_PORT, () => {
    console.log(`✅ Server running on ${env.BACKEND_PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal server error:", err);
  process.exit(1);
});
