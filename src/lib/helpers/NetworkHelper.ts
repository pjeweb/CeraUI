import { toast } from 'svelte-sonner';
import type { ValueOf } from '$lib/types';
import type { NetifMessage, StatusMessage } from '$lib/types/socket-messages';
import { sendMessage, socket } from '$lib/stores/websocket-store';

export type WifiBandNames = 'auto' | 'auto_50' | 'auto_24';

const wifiBandLabels: { [key in WifiBandNames]: string } = {
  auto: 'Auto (Any band)',
  auto_24: 'Auto (2.4 GHz)',
  auto_50: 'Auto (5.0 GHz',
};

export const convertBytesToKbids = (bytes: number) => {
  return Math.round((bytes * 8) / 1024);
};

export const setNetif = (name: string, ip: string | undefined, enabled: boolean) => {
  sendMessage(JSON.stringify({ netif: { name, ip, enabled } }));
};

export const networkRenameWithError = (name: string, error?: string) => {
  name = networkRename(name);
  if (error) {
    name += ` (${error})`;
  }
  return name;
};
export const networkRename = (name: string) => {
  name = name.replace('wlan', 'WiFi ').replace('eth', 'Ethernet ');
  const nameValues = name.split(' ');
  return `${nameValues[0]} - ${Number.parseInt(nameValues[1]) + 1}`;
};

export const getAvailableNetworks = (message?: NetifMessage) => {
  if (message) {
    {
      return Object.values(message).filter(network => !network.error);
    }
  }
  return [];
};

export const getUsedNetworks = (message?: NetifMessage) => {
  if (message) {
    {
      return Object.values(message).filter(network => !network.error && network.enabled);
    }
  }
  return [];
};

export const getTotalBandwidth = (message?: NetifMessage) => {
  if (message) {
    let bandwith = 0;
    Object.values(message).forEach(network => {
      bandwith += convertBytesToKbids(network?.tp ?? 0);
    });

    return bandwith;
  } else return 0;
};

export const getWifiStatus = (wifiNetWork: StatusMessage['wifi'][keyof StatusMessage['wifi']]) => {
  if (wifiNetWork.hotspot) {
    return 'hotspot';
  }
  if (wifiNetWork.conn) {
    return 'connected';
  }
  return 'disconnected';
};

export const getConnection = (wifiNetwork: StatusMessage['wifi'][keyof StatusMessage['wifi']]) => {
  if (wifiNetwork.conn && wifiNetwork.available) {
    return wifiNetwork.available.filter(available => available.active)[0];
  } else return undefined;
};

export const getWifiBand = (freq: number) => {
  if (freq > 6000) {
    return '6 Ghz';
  } else if (freq > 5000) {
    return '5 GHz';
  }
  return '2.4 GHz';
};

export const turnHotspotModeOn = (deviceId: number) => {
  socket.send(JSON.stringify({ wifi: { hotspot: { start: { device: `${deviceId}` } } } }));
  console.log(deviceId);
};

export const turnHotspotModeOff = (deviceId: number) => {
  socket.send(JSON.stringify({ wifi: { hotspot: { stop: { device: `${deviceId}` } } } }));
};

export const changeHotspotSettings = ({
  deviceId,
  name,
  password,
  channel,
}: {
  deviceId: string | number;
  name: string;
  password: string;
  channel: string;
}) => {
  socket.send(JSON.stringify({ wifi: { hotspot: { config: { device: `${deviceId}`, name, password, channel } } } }));
};

export const scanWifi = (deviceId: number | string, notification = true) => {
  if (notification) {
    toast.info('Scanning for WiFi networks', {
      description: 'Looking for new wifi networks this may take some seconds',
      duration: 5000,
    });
  }
  socket.send(JSON.stringify({ wifi: { scan: `${deviceId}` } }));
};

export const disconnectWifi = (uuid: string, wifi: ValueOf<StatusMessage['wifi']>['available'][number]) => {
  toast.warning('Disconnecting from WiFi', { description: `Disconnecting from the ${wifi.ssid} network` });
  socket.send(
    JSON.stringify({
      wifi: {
        disconnect: uuid,
      },
    }),
  );
};

export const connectWifi = (uuid: string, wifi: ValueOf<StatusMessage['wifi']>['available'][number]) => {
  toast.info('Connecting to WiFi', { description: `Connecting to the ${wifi.ssid} network`, duration: 12000 });
  socket.send(
    JSON.stringify({
      wifi: {
        connect: uuid,
      },
    }),
  );
};

export const connectToNewWifi = (deviceId: string | number, ssid: string, password: string) => {
  toast.info('Connecting to new Wifi', { description: `Connecting to the ${ssid} network`, duration: 15000 });
  socket.send(
    JSON.stringify({
      wifi: {
        new: {
          device: `${deviceId}`,
          ssid: `${ssid}`,
          password: `${password}`,
        },
      },
    }),
  );
};

export const forgetWifi = (uuid: string, wifi: ValueOf<StatusMessage['wifi']>['available'][number]) => {
  toast.info('Wifi network forgotten', { description: `You have forgotten the ${wifi.ssid} network` });

  socket.send(
    JSON.stringify({
      wifi: {
        forget: uuid,
      },
    }),
  );
};

export const getWifiUUID = (
  wifiNetwork: ValueOf<StatusMessage['wifi']>['available'][number],
  saved: ValueOf<StatusMessage['wifi']>['saved'],
) => {
  const found = Object.keys(saved).find(value => {
    return wifiNetwork.ssid === value;
  });
  if (found) {
    console.log(saved[found]);
    return saved[found];
  }
  return undefined;
};
