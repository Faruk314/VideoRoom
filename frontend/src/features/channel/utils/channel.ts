import type { ILocalParticipant, IParticipant } from "../types/channel";

function extractChannelId(value: string) {
  const channelUrlRegex =
    /^https?:\/\/localhost(?::5173)?\/channel\/([a-zA-Z0-9_-]{8})\/?$/;

  const match = value.match(channelUrlRegex);
  if (match) return match[1];

  const trimmed = value.trim();
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) return trimmed;

  return null;
}

function isLocalParticipant(
  p: ILocalParticipant | IParticipant
): p is ILocalParticipant {
  return (p as ILocalParticipant).streams !== undefined;
}

function getVideoStream(
  p: ILocalParticipant | IParticipant,
  isDisplayStream?: boolean
): MediaStream | undefined {
  if (isLocalParticipant(p)) {
    if (isDisplayStream) return p.streams?.screen;

    if (p.camMuted) return undefined;

    return p.streams?.video;
  } else {
    const track = isDisplayStream
      ? p.consumers?.screen?.track
      : p.consumers?.video?.track;

    if (!isDisplayStream && p.camMuted) return undefined;

    return track ? new MediaStream([track]) : undefined;
  }
}

function getAudioStream(p: ILocalParticipant | IParticipant) {
  if (isLocalParticipant(p)) return p.streams?.audio;
  const track = p.consumers?.audio?.track;
  return track ? new MediaStream([track]) : undefined;
}

export { extractChannelId, isLocalParticipant, getVideoStream, getAudioStream };
