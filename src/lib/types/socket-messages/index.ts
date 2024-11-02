type AudioCodecs = 'acc' | 'opus';
type WifiPhysicalNames = `${'wl' | 'wlan'}${string}`;
type EthernetPhysicalNames = `${'eth'}${string}`;
type PyshicalNetworkNames = `${WifiPhysicalNames | EthernetPhysicalNames}${string}`;
type WifiBandNames = 'auto' | 'auto_50' | 'auto_24';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';
type Nullable<T> = T | null;
// Message Specific Types
export type AuthMessage = {
  success: boolean;
  auth_token: string;
};

export type AudioCodecsMessage = {
  [key in AudioCodecs]: string;
};

export type ConfigMessage = {
  asrc: string;
  ssh_pass: string;
  max_br: number;
  acodec: AudioCodecs;
  delay: number;
  pipeline: string;
  srt_latency: number;
  bitrate_overlay: boolean;
  srtla_addr: string;
  srtla_port: number;
  srt_streamid: string;
};

export type NetifMessage = {
  [key: PyshicalNetworkNames]: {
    ip?: string;
    tp: number;
    enabled: boolean;
    error?: string;
  };
};
// TODO improve notifications type
export type NotificationsMessage = {
  show: Array<{
    name: string;
    type: NotificationType;
    msg: string;
    is_dismissable: boolean;
    is_persistent: boolean;
    duration: number;
  }>;
};

export type PipelinesMessage = {
  [key: string]: {
    name: string;
    asrc: boolean;
    acodec: boolean;
  };
};

export type RevisionsMessage = {
  belaUI: string;
  belacoder: string;
  srtla: string;
  'BELABOX image': string;
};

export type SensorsStatusMessage = {
  [key: string]: string;
};

export type StatusMessage = {
  is_streaming: boolean;
  available_updates: {
    package_count: number;
    download_size?: string;
  };
  updating: Nullable<boolean>;
  ssh: {
    user: string;
    user_pass: boolean;
    active: boolean;
  };
  wifi: {
    [key: `${number}`]: {
      ifname: PyshicalNetworkNames;
      conn: string;
      hw: string;
      hotspot?: {
        name: string;
        password: string;
        available_channels: {
          [key in WifiBandNames]: string;
        };
        channel: 'string';
        available: Array<{
          active: boolean;
          ssid: string;
          signal: number;
          security: 'WEP' | 'WPA' | 'WPA2' | 'WPA3';
          freq: number;
        }>;
        saved: {
          [key: string]: string;
        };
        supports_hotspot: boolean;
      };
    };
  };
  modems: unknown; // TODO Define Modems Type
  asrcs: ['Analog in', 'No audio', 'Pipeline default'];
};
