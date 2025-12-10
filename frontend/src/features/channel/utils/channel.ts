function extractChannelId(value: string) {
  const channelUrlRegex =
    /^https?:\/\/localhost(?::5173)?\/channel\/([a-zA-Z0-9_-]{8})\/?$/;

  const match = value.match(channelUrlRegex);
  if (match) return match[1];

  const trimmed = value.trim();
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) return trimmed;

  return null;
}

function createStreamFromTracks(
  track: MediaStreamTrack | undefined
): MediaStream | undefined {
  return track ? new MediaStream([track]) : undefined;
}

export { extractChannelId, createStreamFromTracks };
