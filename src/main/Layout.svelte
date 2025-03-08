<script lang="ts">
import Auth from './Auth.svelte';
import Main from './MainView.svelte';
import { setupLocale } from '../i18n';
import { toast } from 'svelte-sonner';
import type { NotificationType, StatusMessage } from '$lib/types/socket-messages';
import { Toaster } from '$lib/components/ui/sonner';
import UpdatingOverlay from '$lib/components/updating-overlay.svelte';
import { authStatusStore } from '$lib/stores/auth-status';
import { AuthMessages, NotificationsMessages, StatusMessages, sendAuthMessage } from '$lib/stores/websocket-store';

let authStatus = $state(false);
let isCheckingAuthStatus = $state(true);
let updatingStatus: StatusMessage['updating'] = $state(false);
const setupLocaleResult = setupLocale();
StatusMessages.subscribe(status => {
  updatingStatus = status?.updating && typeof status.updating !== 'boolean' && status.updating.result !== 0;
});
const auth = localStorage.getItem('auth');
if (auth) {
  sendAuthMessage(auth, true, () => {
    isCheckingAuthStatus = false;
  });
} else {
  isCheckingAuthStatus = false;
}

AuthMessages.subscribe(message => {
  if (message?.success) {
    isCheckingAuthStatus = false;
    toast.success('AUTH', {
      duration: 5000,
      description: 'Successfully authenticated',
    });
    authStatusStore.set(true);
  }

  authStatusStore.subscribe(status => {
    authStatus = status;
  });
});
NotificationsMessages.subscribe(notifications => {
  notifications?.show?.forEach(notification => {
    toast[notification.type as NotificationType](notification.name.toUpperCase(), {
      description: notification.msg,
      duration: notification.is_persistent ? Infinity : notification.duration * 2500,
      dismissable: !notification.is_dismissable,
    });
  });
});
</script>

{#await setupLocaleResult}
  <div></div>
{:then _locateResult}
  {#if authStatus}
    {#if updatingStatus && typeof updatingStatus !== 'boolean'}
      <UpdatingOverlay details={updatingStatus}></UpdatingOverlay>
    {/if}
    <Main></Main>
  {:else if !isCheckingAuthStatus}
    <Auth></Auth>
  {/if}
{/await}

<Toaster richColors></Toaster>
