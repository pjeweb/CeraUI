import { socket } from '$lib/stores/websocket-store';

export type AudioCodecs = 'acc' | 'opus';

export type Config = {
  pipeline: string;
  acodec: AudioCodecs;
  delay: number;
  max_br: number;
  srt_latency: number;
  bitrate_overlay: boolean;
  srtla_addr: string;
  srtla_port: string;
  srt_streamid: string;
};

const sendCommand = (cmd: string) => {
  socket.send(JSON.stringify({ command: cmd }));
};
export const installSoftwareUpdates = () => {
  sendCommand('update');
};

export const setBitrate = (bitrate: number) => {
  socket.send(JSON.stringify({ bitrate: { max_br: `${bitrate}` } }));
};

export const stopStreaming = () => {
  socket.send(JSON.stringify({ stop: '0' }));
};

export const startStreaming = (config: { [key: string]: string | number }) => {
  socket.send(JSON.stringify({ start: config }));
};

export const updateConfig = (config: { [key: string]: string | number }) => {
  socket.send(JSON.stringify({ config }));
};

export const updateBitrate = (bitrate: number) => {
  socket.send(JSON.stringify({ bitrate: { max_br: bitrate } }));
};
