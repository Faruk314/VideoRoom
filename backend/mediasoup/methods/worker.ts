import { createWorker } from "mediasoup";
import { mediasoupState } from "./state";

async function initMediasoupWorker() {
  if (mediasoupState.worker) return mediasoupState;

  const worker = await createWorker({
    rtcMinPort: 40000,
    rtcMaxPort: 49999,
    logLevel: "warn",
  });

  worker.on("died", () => {
    console.error("❌ Mediasoup worker died. Restarting is required.");
    process.exit(1);
  });

  mediasoupState.worker = worker;

  return mediasoupState;
}

export { initMediasoupWorker };
