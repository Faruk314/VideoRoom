import apiClient from "../../../lib/apiClient";

const API_URL = "/api/channel";

async function createChannel() {
  const res = await apiClient.post(`${API_URL}/createChannel`);
  return res.data;
}

async function getChannel(channelId: string) {
  const res = await apiClient.get(`${API_URL}/getChannel/${channelId}`);
  return res.data;
}

export { getChannel, createChannel };
