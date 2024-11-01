import { get, readonly, writable } from 'svelte/store';
import { ENV_VARIABLES } from '../env';
import type {
  AuthMessage,
  NetifMessage,
  ConfigMessage,
  PipelinesMessage,
  AudioCodecsMessage,
  StatusMessage,
  NotificationsMessage,
  RevisionsMessage,
  SensorsStatusMessage,
} from '../types/socket-messages';
import { toast } from 'svelte-sonner';

const AuthStore = writable<AuthMessage>();
const AudioCodecsStore = writable<AudioCodecsMessage>();
const ConfigStore = writable<ConfigMessage>();
const NetifStore = writable<NetifMessage>();
const NotificationsStore = writable<NotificationsMessage>();
const PipelinesStore = writable<PipelinesMessage>();
const RevisionsStore = writable<RevisionsMessage>();
const SensorsStatusStore = writable<SensorsStatusMessage>();
const StatusStore = writable<StatusMessage>();

const connectionUrl = `${ENV_VARIABLES.SOCKET_ENDPOINT}:${ENV_VARIABLES.SOCKET_PORT}`;
const socket = new WebSocket(connectionUrl);

// Connection opened
socket.addEventListener('open', function () {
  toast.info('Connection', { duration: 5000, description: 'The connection with the device has been stablished.' });
  setInterval(function () {
    if (socket) {
      socket.send(JSON.stringify({ keepalive: null }));
    }
  }, 10000);
});

socket.addEventListener('error', function () {
  toast.error('Connection', {
    duration: 5000,
    description: 'It has not been able to communicate with the devices, trying to reconnect as soon as possible',
  });
});

function sendAuthMessage(password: string, isPersistent: boolean, onError: (() => unknown) | undefined = undefined) {
  const auth_req = { auth: { password, persistent_token: isPersistent } };
  sendMessage(JSON.stringify(auth_req), () => {
    toast.error('Authentication failed', {
      duration: 5000,
      description: 'The connection with the server could not be stablished',
    });
    onError?.();
  });
}

//   Listen for messages
socket.addEventListener('message', function (event: MessageEvent<string>) {
  assignMessage(event.data);
});

const assignMessage = (message: string) => {
  const parseMessage = JSON.parse(message);
  switch (Object.keys(parseMessage)[0]) {
    case 'auth':
      AuthStore.set(parseMessage.auth);
      break;
    case 'acodecs':
      AudioCodecsStore.set(parseMessage.acodecs);
      break;
    case 'config':
      ConfigStore.set(parseMessage.config);
      break;
    case 'netif':
      NetifStore.set(parseMessage.netif);
      break;
    case 'notification':
      console.log(parseMessage.notification);
      NotificationsStore.set(parseMessage.notification);
      break;
    case 'pipelines':
      PipelinesStore.set(parseMessage.pipelines);
      break;
    case 'revisions':
      RevisionsStore.set(parseMessage.revisions);
      break;
    case 'sensors':
      SensorsStatusStore.set(parseMessage.sensors);
      break;
    case 'status':
      StatusStore.set({ ...get(StatusStore), ...parseMessage.status });
      break;
  }
};

const sendMessage = (message: string, onTimeout: (() => unknown) | undefined = undefined) => {
  waitForSocketConnection(
    socket,
    50,
    () => {
      socket.send(message);
    },
    10000,
    onTimeout,
  );
};

// Make the function wait until the connection is made...
function waitForSocketConnection(
  socket: WebSocket,
  checkTime: number,
  callback: () => unknown,
  maxWaitingTime: number = 10000,
  onTimeout: undefined | (() => unknown) = undefined,
  executionTime = 0,
) {
  setTimeout(() => {
    if (socket.readyState === 1) {
      if (callback != null) {
        callback();
      }
    } else {
      executionTime += checkTime;
      if (executionTime >= maxWaitingTime) {
        console.warn('Timeout Reached awaiting for socket connection.');
        onTimeout?.();
      } else {
        console.log('wait for connection...');
        waitForSocketConnection(socket, checkTime, callback, maxWaitingTime, onTimeout, executionTime);
      }
    }
  }, checkTime);
}

const AuthMessages = readonly(AuthStore);
const AudioCodesMessage = readonly(AudioCodecsStore);
const NetifMessages = readonly(NetifStore);
const NotificationsMessages = readonly(NotificationsStore);
const ConfigMessages = readonly(ConfigStore);
const PipelinesMessages = readonly(PipelinesStore);
const RevisionsMessages = readonly(RevisionsStore);
const SensorsStatusMessages = readonly(SensorsStatusStore);
const StatusMessages = readonly(StatusStore);

export {
  AuthMessages,
  AudioCodesMessage,
  ConfigMessages,
  NetifMessages,
  NotificationsMessages,
  PipelinesMessages,
  RevisionsMessages,
  SensorsStatusMessages,
  StatusMessages,
  sendMessage,
  sendAuthMessage,
};
