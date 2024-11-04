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

function getConfig(): Config {
  const maxBr = $('#bitrateSlider').slider('value');

  const config = {};
  config.pipeline = document.getElementById('pipelines').value;
  if (pipelines[config.pipeline].asrc) {
    config.asrc = document.getElementById('audioSource').value;
  }
  if (pipelines[config.pipeline].acodec) {
    config.acodec = document.getElementById('audioCodec').value;
  }
  config.delay = $('#delaySlider').slider('value');
  config.max_br = maxBr;
  config.srt_latency = $('#srtLatencySlider').slider('value');
  config.bitrate_overlay = $('#bitrateOverlay').prop('checked');

  const relayServer = $('#relayServer').val();
  if (relayServer !== 'manual') {
    config.relay_server = relayServer;
  } else {
    config.srtla_addr = $('#srtlaAddr').val();
    config.srtla_port = $('#srtlaPort').val();
  }

  const relayAccount = $('#relayAccount').val();
  if (relayServer !== 'manual' && relayAccount !== 'manual') {
    config.relay_account = relayAccount;
  } else {
    config.srt_streamid = $('#srtStreamid').val();
  }

  return config;
}

export const setBitrate = (bitrate: number) => {
  socket.send(JSON.stringify({ bitrate: { max_br: `${bitrate}` } }));
};

export const stopStreaming = () => {
  socket.send(JSON.stringify({ stop: '0' }));
};

export const startStreaming = () => {
  socket.send(JSON.stringify({ start: getConfig() }));
};

export const updateConfig = () => {
  socket.send(JSON.stringify({ config: {} }));
};
