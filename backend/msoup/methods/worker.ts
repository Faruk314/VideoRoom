import { createWorker } from "mediasoup";
import { mediasoupState } from "./state";
import { webRtcServerOptions } from "msoup/config";

async function initMediasoupWorker() {
  if (mediasoupState.worker) return mediasoupState;

  const worker = await createWorker(webRtcServerOptions);

  worker.on("died", () => {
    console.error("❌ Mediasoup worker died. Restarting is required.");
    process.exit(1);
  });

  mediasoupState.worker = worker;

  return mediasoupState;
}

export { initMediasoupWorker };
