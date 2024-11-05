<script lang="ts">
import { Bolt } from 'lucide-svelte';
import type { ValueOf } from '$lib/types';
import type { StatusMessage } from '$lib/types/socket-messages';
import { Input } from '$lib/components/ui/input';
import { Label } from '$lib/components/ui/label';
import * as Select from '$lib/components/ui/select';
import SimpleAlertDialog from '$lib/components/ui/simple-alert-dialog.svelte';
import { type WifiBandNames, changeHotspotSettings } from '$lib/helpers/NetworkHelper';

const getSelectedChannel: () => { value: WifiBandNames; label: string } = () => {
  return { value: wifi.hotspot?.channel, label: wifi.hotspot?.available_channels[wifi.hotspot?.channel].name };
};

let { deviceId, wifi }: { deviceId: number; wifi: ValueOf<StatusMessage['wifi']> } = $props();
let hotspotProperties = $state({
  selectedChannel: getSelectedChannel(),
  password: wifi.hotspot?.password,
  deviceId,
  name: wifi.hotspot?.name,
});
const resetHotSpotProperties = () => {
  hotspotProperties = {
    selectedChannel: getSelectedChannel(),
    password: wifi.hotspot?.password,
    deviceId,
    name: wifi.hotspot?.name,
  };
};

$inspect(hotspotProperties).with(console.log);
</script>

<SimpleAlertDialog
  confirmButtonText="Save"
  onOpenChange={open => open && resetHotSpotProperties()}
  title="Config hotspot"
  extraButtonClasses="bg-green-500 hover:bg-green-500/90"
  disabledConfirmButton={!hotspotProperties?.password?.length || !hotspotProperties?.name?.length}
  onconfirm={() =>
    changeHotspotSettings({
      channel: hotspotProperties.selectedChannel.value ?? 'auto',
      deviceId: hotspotProperties.deviceId,
      name: hotspotProperties.name,
      password: hotspotProperties.password,
    })}>
  {#snippet button()}
    <Bolt></Bolt>
  {/snippet}
  {#snippet dialogTitle()}
    Configure your hotspot
  {/snippet}
  {#snippet description()}
    <div class="grid gap-2">
      <div class="grid gap-1">
        <Label for="name" class="mb-1">Name</Label>
        <Input
          bind:value={hotspotProperties.name}
          id="name"
          placeholder="CERABOX"
          autocapitalize="none"
          autocomplete="off"
          autocorrect="off" />
      </div>
      <div class="grid gap-1">
        <Label for="password" class="mb-1">Password</Label>
        <Input
          bind:value={hotspotProperties.password}
          id="password"
          type="password"
          placeholder="********"
          autocapitalize="none"
          autocomplete="off"
          autocorrect="off" />
      </div>
      <div class="grid gap-1">
        <Label for="channel" class="mb-2 ml-1">Channel</Label>
        <Select.Root
          id="channel"
          onSelectedChange={value => {
            hotspotProperties.selectedChannel = value;
          }}
          selected={hotspotProperties.selectedChannel}>
          <Select.Trigger class="w-[180px]">
            <Select.Value placeholder="Select a channel"></Select.Value>
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#if wifi.hotspot?.available_channels}
                {#each Object.entries(wifi.hotspot?.available_channels) as [channelId, channel]}
                  <Select.Item value={channelId}>
                    {channel.name}
                  </Select.Item>
                {/each}
              {/if}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  {/snippet}
</SimpleAlertDialog>
