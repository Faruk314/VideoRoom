const sendingResolutions = [
  {
    label: "High resolution (720 p)",
    value: "high",
  },

  {
    label: "Medium resolution (360 p)",
    value: "medium",
  },

  {
    label: "Low resolution (180 p)",
    value: "low",
  },
];

const scaleMap = {
  low: 4,
  medium: 2,
  high: 1,
};

const bitrateMap = {
  low: 150_000,
  medium: 500_000,
  high: 1200_000,
};

export { sendingResolutions, scaleMap, bitrateMap };
