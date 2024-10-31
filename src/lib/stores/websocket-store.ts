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

function sendAuthMessage(password: string, isPersistent: boolean): void {
  const auth_req = { auth: { password, persistent_token: isPersistent } };
  sendMessage(JSON.stringify(auth_req));
}

// Connection opened
socket.addEventListener('open', function () {
  console.info('Connected...');
  sendAuthMessage('12345678', true);
});

//   Listen for messages
socket.addEventListener('message', function (event: MessageEvent<string>) {
  console.log(JSON.parse(event.data));
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

const sendMessage = (message: string) => {
  if (socket.readyState <= 1) {
    socket.send(message);
  }
};

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
};
