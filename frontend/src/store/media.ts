import { create } from "zustand";

interface MediaDeviceState {
  microphones: MediaDeviceInfo[];
  cameras: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];

  selectedMic: MediaDeviceInfo | null;
  selectedCamera: MediaDeviceInfo | null;
  selectedSpeaker: MediaDeviceInfo | null;

  setMicrophones: (devices: MediaDeviceInfo[]) => void;
  setCameras: (devices: MediaDeviceInfo[]) => void;
  setSpeakers: (devices: MediaDeviceInfo[]) => void;

  setSelectedMic: (device: MediaDeviceInfo) => void;
  setSelectedCamera: (device: MediaDeviceInfo) => void;
  setSelectedSpeaker: (device: MediaDeviceInfo) => void;
}

export const useMediaStore = create<MediaDeviceState>((set) => ({
  microphones: [],
  cameras: [],
  speakers: [],

  selectedMic: null,
  selectedCamera: null,
  selectedSpeaker: null,

  setMicrophones: (devices) => set({ microphones: devices }),
  setCameras: (devices) => set({ cameras: devices }),
  setSpeakers: (devices) => set({ speakers: devices }),

  setSelectedMic: (device) => set({ selectedMic: device }),
  setSelectedCamera: (device) => set({ selectedCamera: device }),
  setSelectedSpeaker: (device) => set({ selectedSpeaker: device }),
}));
