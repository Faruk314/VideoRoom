import { create } from "zustand";

interface MediaDeviceState {
  hasAudioPermission: boolean;
  hasVideoPermission: boolean;

  microphones: MediaDeviceInfo[];
  cameras: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];

  selectedMic: MediaDeviceInfo | null;
  selectedCamera: MediaDeviceInfo | null;
  selectedSpeaker: MediaDeviceInfo | null;

  setAudioPermission: (granted: boolean) => void;
  setVideoPermission: (granted: boolean) => void;

  setMicrophones: (devices: MediaDeviceInfo[]) => void;
  setCameras: (devices: MediaDeviceInfo[]) => void;
  setSpeakers: (devices: MediaDeviceInfo[]) => void;

  setSelectedMic: (device: MediaDeviceInfo) => void;
  setSelectedCamera: (device: MediaDeviceInfo) => void;
  setSelectedSpeaker: (device: MediaDeviceInfo) => void;
}

export const useMediaStore = create<MediaDeviceState>((set) => ({
  hasAudioPermission: false,
  hasVideoPermission: false,

  microphones: [],
  cameras: [],
  speakers: [],

  selectedMic: null,
  selectedCamera: null,
  selectedSpeaker: null,

  setAudioPermission: (granted) => set({ hasAudioPermission: granted }),
  setVideoPermission: (granted) => set({ hasVideoPermission: granted }),

  setMicrophones: (devices) => set({ microphones: devices }),
  setCameras: (devices) => set({ cameras: devices }),
  setSpeakers: (devices) => set({ speakers: devices }),

  setSelectedMic: (device) => set({ selectedMic: device }),
  setSelectedCamera: (device) => set({ selectedCamera: device }),
  setSelectedSpeaker: (device) => set({ selectedSpeaker: device }),
}));
