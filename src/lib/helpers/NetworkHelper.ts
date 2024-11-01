import { sendMessage } from '$lib/stores/websocket-store';

export const convertBytesToKbids = (bytes: number) => {
  return Math.round((bytes * 8) / 1024);
};

export const setNetif = (name: string, ip: string | undefined, enabled: boolean) => {
  console.log({ netif: { name: name, ip: ip, enabled: false } });
  sendMessage(JSON.stringify({ netif: { name, ip, enabled } }));
};
