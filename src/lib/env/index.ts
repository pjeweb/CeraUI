export const ENV_VARIABLES = {
  SOCKET_ENDPOINT: import.meta.env.VITE_SOCKET_ENDPOINT || `ws://${window.location.hostname}`,
  SOCKET_PORT: import.meta.env.VITE_SOCKET_PORT || '80',
};
