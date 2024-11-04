<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Avatar from "$lib/components/ui/avatar/";
    import type {ValueOf} from "$lib/types";
    import type {StatusMessage} from "$lib/types/socket-messages";
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import WifiQuality from "$lib/components/icons/WifiQuality.svelte";
    import {
        connectToNewWifi,
        connectWifi,
        disconnectWifi,
        forgetWifi,
        getWifiUUID,
        networkRename, scanWifi
    } from "$lib/helpers/NetworkHelper.js";
    import {cn} from "$lib/utils";
    import {Button} from "$lib/components/ui/button";
    import {Link, ScanSearch} from "lucide-svelte";
    import SimpleAlertDialog from "$lib/components/ui/simple-alert-dialog.svelte";
    import {Input} from "$lib/components/ui/input";

    let {wifi, wifiId}: { wifi: ValueOf<StatusMessage['wifi']>, wifiId: number } = $props()
    let networkPassword = $state('')
    let open = $state(false)

    $effect(() => {
        let internal: NodeJS.Timeout
        if (open) {
            internal = setInterval(() => {
                console.log('Doing wifi scan')
                scanWifi(wifiId, false)
            },4000)
        }
        return () => clearInterval(internal)
    },)
</script>
<SimpleAlertDialog confirmButtonText="Close" hiddeCancelButton={true} class="max-w-screen-sm" bind:open={open}
                   title="Search WiFi Networks"
                   extraButtonClasses="bg-green-500 hover:bg-green-500/90">
    {#snippet buttonIcon()}
        <ScanSearch></ScanSearch>
    {/snippet}
    {#snippet dialogTitle()}
        Available networks for {networkRename(wifi.ifname)}
    {/snippet}
    <Card.Root class="col-span-3 pr-0">
        <ScrollArea class="h-96 w-100" type="auto">
            <Card.Content class="pt-0">

                <div class="space-y-0">
                    {#each wifi.available as availableNetwork, index }
                        {@const uuid = getWifiUUID(availableNetwork, wifi.saved)}
                        <div class={cn("flex items-center pr-4 p-2",index ?'border-t-2':'mt-2', uuid ? '':  'cursor-pointer')}>
                            <WifiQuality signal={availableNetwork.signal} class="size-8"/>
                            <div class="ml-2 space-y-2 text-left">
                                <p class="text-sm font-medium leading-none pt-0 pb-0">{availableNetwork.ssid}</p>
                                <p class="text-muted-foreground text-sm pt-0 pb-0 mt-0 mb-0">{availableNetwork.security.replaceAll(' ', ', ')}</p>
                            </div>
                            <div class="ml-auto font-medium">
                                {#if uuid}
                                    {#if availableNetwork.active }
                                        <Button variant="secondary"
                                                onclick={()=>disconnectWifi(uuid, availableNetwork)}>Disconnect
                                        </Button>
                                    {:else}
                                        <Button variant="secondary" onclick={()=>connectWifi(uuid, availableNetwork)}>
                                            <span class="hidden md:block">Connect</span>
                                            <span class="sm:hidden"><Link class="w-3"></Link></span>
                                        </Button>
                                    {/if}
                                    <SimpleAlertDialog title="Forget Wifi network" buttonText="Forget"
                                                       confirmButtonText="Forget"
                                                       onconfirm={()=>forgetWifi(uuid, availableNetwork)}>
                                        {#snippet dialogTitle()}
                                            Disconnect from {availableNetwork.ssid}
                                        {/snippet}
                                        {#snippet description()}
                                            Are you sure to forget <b>{availableNetwork.ssid}</b> on
                                            the <b>{networkRename(wifi.ifname)}</b> network?
                                        {/snippet}
                                    </SimpleAlertDialog>
                                {:else}
                                    <SimpleAlertDialog buttonText="Connect"
                                                       extraButtonClasses="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                       confirmButtonText="Connect"
                                                       onconfirm={()=>{
                                                           connectToNewWifi(wifiId, availableNetwork.ssid, networkPassword )
                                                           networkPassword='';
                                                            }}
                                                       oncancel={()=>networkPassword=''}>
                                        {#snippet dialogTitle()}
                                            Connect to {availableNetwork.ssid}
                                        {/snippet}
                                        {#snippet description()}
                                            Please Introduce the network password
                                        {/snippet}
                                        <Input bind:value={networkPassword} id="password" type="password"
                                               placeholder="********"></Input>

                                    </SimpleAlertDialog>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>

            </Card.Content>
        </ScrollArea>
        <Button class="w-[100%] bg-green-600 hover:bg-green-500/90" onclick={()=> scanWifi(wifiId)}>Scan</Button>
    </Card.Root>
</SimpleAlertDialog>
