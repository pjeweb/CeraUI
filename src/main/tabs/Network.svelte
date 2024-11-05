<script lang="ts">
import HotspotConfigurator from '../shared/HotspotConfigurator.svelte';
import Networking from '../shared/Networking.svelte';
import WifiSelector from '../shared/WifiSelector.svelte';
import { EyeIcon, Router, Wifi, WifiOff } from 'lucide-svelte';
import type { StatusMessage } from '$lib/types/socket-messages';
import WifiQuality from '$lib/components/icons/WifiQuality.svelte';
import * as Card from '$lib/components/ui/card';
import SimpleAlertDialog from '$lib/components/ui/simple-alert-dialog.svelte';
import {
  getConnection,
  getWifiBand,
  getWifiStatus,
  networkRename,
  turnHotspotModeOff,
  turnHotspotModeOn,
} from '$lib/helpers/NetworkHelper';
import { StatusMessages } from '$lib/stores/websocket-store';
import { capitalizeFirstLetter } from '$lib/utils.js';

let currentStatus: StatusMessage | undefined = $state();
$effect(() => {
  StatusMessages.subscribe(status => {
    currentStatus = status;
  });
});
</script>

<div class=" flex-col md:flex">
  <div class="flex-1 space-y-4 p-8 pt-6">
    <div class="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
      <div class="col-span-4 grid grid-rows-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
        {#if currentStatus}
          {#each Object.values(currentStatus.wifi) as wifi, deviceId (deviceId)}
            {@const wifiStatus = getWifiStatus(wifi)}
            {@const connection = getConnection(wifi)}
            <Card.Root class="col-span-2 row-span-2 sm:col-span-2">
              <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-sm font-medium">{networkRename(wifi.ifname)}</Card.Title>
                <Wifi class="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div class="text-2xl font-bold">{capitalizeFirstLetter(wifiStatus)}</div>

                {#if wifi.hotspot}
                  <p class="text-xs text-muted-foreground">
                    <b>Name</b>: {wifi.hotspot.name}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    <b>Channel</b>: {wifi.hotspot.channel}
                  </p>
                {:else if connection}
                  <div class="flex grid-cols-12 content-center font-bold text-muted-foreground">
                    <p>Strength:</p>
                    <WifiQuality class="ml-1" signal={connection?.signal} />
                  </div>
                  <p class="text-xs text-muted-foreground">
                    <b>SSID</b>: {connection?.ssid}
                  </p>

                  <p class="text-xs text-muted-foreground">
                    <b>Security</b>: {connection.security}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    <b>Band</b>: {getWifiBand(connection.freq)}
                  </p>
                {/if}
                <div class="pt-2">
                  {#if wifi.hotspot}
                    <HotspotConfigurator {wifi} {deviceId}></HotspotConfigurator>
                    <SimpleAlertDialog confirmButtonText="Close" hiddeCancelButton={true} title="Show hotspot details">
                      {#snippet button()}
                        <EyeIcon></EyeIcon>
                      {/snippet}
                      {#snippet dialogTitle()}
                        Hotspot Details
                      {/snippet}
                      {#snippet description()}
                        <p>Name: <b>{wifi.hotspot?.name}</b></p>
                        <p>Password: <b>{wifi.hotspot?.password}</b></p>
                      {/snippet}
                    </SimpleAlertDialog>
                    <SimpleAlertDialog
                      confirmButtonText="Turn off"
                      extraButtonClasses="bg-yellow-600 hover:bg-yellow-600/90"
                      title="Turn hotspot off"
                      onconfirm={() => turnHotspotModeOff(deviceId)}>
                      {#snippet button()}
                        <WifiOff></WifiOff>
                      {/snippet}
                      {#snippet dialogTitle()}
                        Turn hotspot mode off
                      {/snippet}
                      {#snippet description()}
                        This will immediately disconnect any connected clients and turn the hotspot <b>OFF</b>?
                      {/snippet}
                    </SimpleAlertDialog>
                  {:else}
                    <WifiSelector {wifi} wifiId={deviceId}></WifiSelector>
                    <SimpleAlertDialog
                      confirmButtonText="Turn on"
                      extraButtonClasses="bg-yellow-600 hover:bg-yellow-600/90"
                      title="Turn hotspot on"
                      onconfirm={() => turnHotspotModeOn(deviceId)}>
                      {#snippet button()}
                        <Router></Router>
                      {/snippet}
                      {#snippet dialogTitle()}
                        Turn hotspot mode on
                      {/snippet}
                      {#snippet description()}
                        Are you sure you want to turn the hotspot mode <b>ON</b>? it will allow you sharing your
                        internet with other devices but will disconnect all WiFi connections on this network
                      {/snippet}
                    </SimpleAlertDialog>
                  {/if}
                </div>
              </Card.Content>
            </Card.Root>
          {/each}
        {/if}
      </div>
      <Card.Root class="col-span-4 sm:col-span-4 md:col-span-3">
        <Networking />
      </Card.Root>
    </div>
  </div>
</div>
