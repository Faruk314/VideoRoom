async function listDevices() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const devices = await navigator.mediaDevices.enumerateDevices();

    const audioInputs = devices.filter((d) => d.kind === "audioinput");
    const audioOutputs = devices.filter((d) => d.kind === "audiooutput");
    const videoInputs = devices.filter((d) => d.kind === "videoinput");

    stream.getTracks().forEach((track) => track.stop());

    return {
      microphones: audioInputs,
      speakers: audioOutputs,
      cameras: videoInputs,
      all: devices,
    };
  } catch {
    throw new Error("Error listing media devices");
  }
}

export { listDevices };
