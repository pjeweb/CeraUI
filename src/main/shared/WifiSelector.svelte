<script lang="ts">
import { Link, ScanSearch, Trash2, Unlink } from 'lucide-svelte';
import { toast } from 'svelte-sonner';
import type { ValueOf } from '$lib/types';
import type { StatusMessage } from '$lib/types/socket-messages';
import WifiQuality from '$lib/components/icons/WifiQuality.svelte';
import { Button } from '$lib/components/ui/button';
import * as Card from '$lib/components/ui/card';
import { Input } from '$lib/components/ui/input';
import { ScrollArea } from '$lib/components/ui/scroll-area';
import SimpleAlertDialog from '$lib/components/ui/simple-alert-dialog.svelte';
import {
  connectToNewWifi,
  connectWifi,
  disconnectWifi,
  forgetWifi,
  getWifiUUID,
  networkRename,
  scanWifi,
} from '$lib/helpers/NetworkHelper.js';
import { WifiMessages } from '$lib/stores/websocket-store';
import { cn } from '$lib/utils';

let { wifi, wifiId }: { wifi: ValueOf<StatusMessage['wifi']>; wifiId: number } = $props();
let networkPassword = $state('');
let open = $state(false);

let connecting: string | undefined = $state();
let scanning = $state(false);

$effect(() => {
  WifiMessages.subscribe(wifiMessage => {
    if (wifiMessage) {
      if (wifiMessage.new?.error) {
        toast.error('WiFi connection error', {
          description:
            'It was not possible to connect to the selected WiFi network, check the password or get closer to it and try again',
        });
      } else {
        connecting = undefined;
      }
    }
  });
});

$effect(() => {
  let internal: NodeJS.Timeout;
  if (open) {
    internal = setInterval(() => {
      console.log('Doing wifi scan');
      scanWifi(wifiId, false);
    }, 22000);
  }
  return () => clearInterval(internal);
});

const handleWifiScan = () => {
  scanWifi(wifiId);
  scanning = true;
  setTimeout(() => {
    scanning = false;
  }, 20000);
};

const handleWifiConnect = (uuid: string, wifi: ValueOf<StatusMessage['wifi']>['available'][number]) => {
  connecting = uuid;
  connectWifi(uuid, wifi);
  networkPassword = '';
};

const handleNewWifiConnect = (ssid: string, password: string) => {
  connecting = ssid;
  connectToNewWifi(wifiId, ssid, password);
};
</script>

<SimpleAlertDialog
  confirmButtonText="Close"
  hiddeCancelButton={true}
  class="max-w-screen-sm"
  bind:open
  title="Search WiFi Networks"
  extraButtonClasses="bg-green-500 hover:bg-green-500/90">
  {#snippet button()}
    <ScanSearch></ScanSearch>
  {/snippet}
  {#snippet dialogTitle()}
    Available networks for {networkRename(wifi.ifname)}
  {/snippet}
  <Card.Root class="col-span-3 pr-0">
    <ScrollArea class="w-100 h-96" type="auto">
      <Card.Content class="pt-0">
        <div class="space-y-0">
          {#each wifi.available as availableNetwork, index}
            {@const uuid = getWifiUUID(availableNetwork, wifi.saved)}
            {@const isConnecting =
              connecting !== undefined && (connecting === uuid || connecting === availableNetwork.ssid)}
            <div class={cn('flex items-center p-2 pr-4', index ? 'border-t-2' : 'mt-2', uuid ? '' : 'cursor-pointer')}>
              <WifiQuality signal={availableNetwork.signal} class="size-8" />
              <div class="ml-2 space-y-2 text-left">
                <p class="pb-0 pt-0 text-sm font-medium leading-none">{availableNetwork.ssid}</p>
                <p class="mb-0 mt-0 pb-0 pt-0 text-sm text-muted-foreground">
                  {availableNetwork.security.replaceAll(' ', ', ')}
                </p>
              </div>
              <div class="ml-auto font-medium">
                {#if isConnecting}
                  <span class="loading w-[25%] text-left"> Connecting </span>
                {:else if uuid}
                  {#if availableNetwork.active}
                    <Button variant="secondary" onclick={() => disconnectWifi(uuid, availableNetwork)}>
                      <span class="hidden md:block">Disconnect</span>
                      <span class="sm:hidden"><Unlink class="w-4"></Unlink></span>
                    </Button>
                  {:else}
                    <Button variant="secondary" onclick={() => handleWifiConnect(uuid, availableNetwork)}>
                      <span class="hidden md:block">Connect</span>
                      <span class="sm:hidden"><Link class="w-4"></Link></span>
                    </Button>
                  {/if}
                  <SimpleAlertDialog
                    title="Forget Wifi network"
                    confirmButtonText="Forget"
                    onconfirm={() => forgetWifi(uuid, availableNetwork)}>
                    {#snippet dialogTitle()}
                      Disconnect from {availableNetwork.ssid}
                    {/snippet}
                    {#snippet button()}
                      <span class="hidden sm:block">Forget</span>
                      <Trash2 class="w-4 sm:block md:hidden"></Trash2>
                    {/snippet}
                    {#snippet description()}
                      Are you sure to forget <b>{availableNetwork.ssid}</b> on the <b>{networkRename(wifi.ifname)}</b> network?
                    {/snippet}
                  </SimpleAlertDialog>
                {:else}
                  <SimpleAlertDialog
                    confirmButtonText="Connect"
                    extraButtonClasses="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    onconfirm={() => {
                      handleNewWifiConnect(availableNetwork.ssid, networkPassword);
                    }}
                    oncancel={() => (networkPassword = '')}>
                    {#snippet dialogTitle()}
                      Connect to {availableNetwork.ssid}
                    {/snippet}
                    {#snippet button()}
                      <span class="hidden sm:block">Connect</span>
                      <Link class="w-4 sm:block md:hidden"></Link>
                    {/snippet}
                    {#snippet description()}
                      Please Introduce the network password
                    {/snippet}
                    <Input bind:value={networkPassword} id="password" type="password" placeholder="********"></Input>
                  </SimpleAlertDialog>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </Card.Content>
    </ScrollArea>
    <Button disabled={scanning} class="w-[100%] bg-green-600 hover:bg-green-500/90" onclick={handleWifiScan}>
      <span class={scanning ? 'loading' : ''}>{scanning ? 'Scanning' : 'Scan'}</span></Button>
  </Card.Root>
</SimpleAlertDialog>
