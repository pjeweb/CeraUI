<script lang="ts">
import Network from 'lucide-svelte/icons/arrow-up-down';
import Check from 'lucide-svelte/icons/check';
import X from 'lucide-svelte/icons/x';
import type { NetifMessage } from '$lib/types/socket-messages';
import * as Card from '$lib/components/ui/card';
import { Toggle } from '$lib/components/ui/toggle';
import {
  convertBytesToKbids,
  getAvailableNetworks,
  getTotalBandwidth,
  getUsedNetworks,
  networkRenameWithError,
  setNetif,
} from '$lib/helpers/NetworkHelper.js';
import { NetifMessages } from '$lib/stores/websocket-store';
import { cn } from '$lib/utils';

let totalBandwith: number = $state(0);
let currentNetwoks: NetifMessage = $state({});
NetifMessages.subscribe((networks: NetifMessage) => {
  if (networks) {
    currentNetwoks = networks;
    totalBandwith = getTotalBandwidth(networks);
  }
});
</script>

<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
  <div>
    <Card.Title class="text-primary">Network Information</Card.Title>
    <Card.Description
      >{Object.keys(currentNetwoks).length} Networks, {getAvailableNetworks(currentNetwoks).length} Available, {getUsedNetworks(
        currentNetwoks,
      ).length} used, {totalBandwith} Kbps</Card.Description>
  </div>

  <Network class="text-muted-primary h-4 w-4" />
</Card.Header>
<Card.Content>
  <div class="space-y-8">
    {#each Object.entries(currentNetwoks) as [name, network]}
      <div class="flex items-center">
        <Toggle
          variant="outline"
          class={cn(network.enabled ? 'data-[state=on]:bg-green-600' : 'bg-red-600')}
          title={network.enabled ? 'Disable network' : 'Enable Network'}
          disabled={!!network.error}
          bind:pressed={network.enabled}
          onPressedChange={() => setNetif(name, network.ip, !network.enabled)}>
          {#if network.enabled}
            <Check></Check>
          {:else}
            <X></X>
          {/if}
        </Toggle>

        <div
          class="spac e-y-1
                ml-4">
          <p class="text-sm font-medium leading-none">{`${networkRenameWithError(name, network.error)}`}</p>
          <p class="text-sm text-muted-foreground">IP: {network.ip}</p>
          <p class="text-sm text-muted-foreground">Identifier: {name}</p>
        </div>
        <div class="ml-auto font-medium">{convertBytesToKbids(network.tp)} Kbps</div>
      </div>
    {/each}

    <div class="flex">
      <div class="ml-auto text-2xl font-bold text-primary">{totalBandwith} Kbps</div>
    </div>
  </div>
</Card.Content>
