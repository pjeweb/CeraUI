<script lang="ts">
    import {NetifMessages} from "$lib/stores/websocket-store";
    import type {NetifMessage} from "$lib/types/socket-messages";
    import * as Card from "$lib/components/ui/card";
    import {convertBytesToKbids, setNetif} from "$lib/helpers/NetworkHelper.js";
    import Network from "lucide-svelte/icons/arrow-up-down";
    import {Toggle} from "$lib/components/ui/toggle";
    import X from "lucide-svelte/icons/x";
    import Check from "lucide-svelte/icons/check";
    import {cn} from "$lib/utils";

    let totalBandwith: number = $state(0)
    let currentNetwoks: NetifMessage = $state({})
    $effect(() => {
        NetifMessages.subscribe((networks: NetifMessage) => {
            if (networks) {
                let bandwith = 0;
                currentNetwoks = networks
                Object.values(networks).forEach((network) => {
                    bandwith += convertBytesToKbids(network?.tp ?? 0)
                })
                totalBandwith = bandwith;
            }
        })
    });
</script>
<Card.Header
        class="flex flex-row items-center justify-between space-y-0 pb-2"
>
    <div>
        <Card.Title class="text-primary">Network Information</Card.Title>
        <Card.Description>{Object.keys(currentNetwoks).length} Networks, {Object.values(currentNetwoks).filter((network)=> !network.error).length} used, {totalBandwith} Kbps</Card.Description>
    </div>

    <Network class="text-muted-primary h-4 w-4"/>

</Card.Header>
<Card.Content>
    <div class="space-y-8">
        {#each Object.entries(currentNetwoks) as [name, network] }
            <div class="flex items-center">
                <Toggle variant="outline" class={cn(network.enabled ? 'bg-green-600' : 'bg-red-600')} title={network.enabled ? 'Disable network' : 'Enable Network'}
                        disabled={!!network.error} bind:pressed={network.enabled}
                        onPressedChange={()=>setNetif(name,network.ip, !network.enabled)}>
                    {#if network.enabled}
                        <Check></Check>
                    {:else}
                        <X></X>
                    {/if}
                </Toggle>

                <div class="ml-4 spac
                e-y-1">
                    <p class="text-sm font-medium leading-none">{network.error ? `${name} ( ${network.error} )` : name  }</p>
                    <p class="text-muted-foreground text-sm">IP: {network.ip}</p>
                </div>
                <div class="ml-auto font-medium">{convertBytesToKbids(network.tp)} Kbps</div>
            </div>
        {/each}

        <div class="flex">
            <div class="ml-auto font-bold  text-2xl text-primary">{totalBandwith} Kbps</div>
        </div>
    </div>
</Card.Content>
