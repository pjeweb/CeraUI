<script lang="ts">
import { Check, X } from 'lucide-svelte';
import { _ } from 'svelte-i18n';
import type { Modem, ModemNetworkType } from '$lib/types/socket-messages';
import { Button } from '$lib/components/ui/button';
import { Input } from '$lib/components/ui/input';
import { Label } from '$lib/components/ui/label';

import * as Select from '$lib/components/ui/select';
import { Toggle } from '$lib/components/ui/toggle';
import { changeModemSettings, renameSupportedModemNetwork } from '$lib/helpers/NetworkHelper';
import { cn } from '$lib/utils';

let { deviceId, modem } = $props<{ deviceId: number | string; modem: Modem }>();

const getSelectedNetwork: () => { value: ModemNetworkType; label: string } = () => {
  return { value: modem.network_type.active, label: renameSupportedModemNetwork(modem.network_type.active) };
};

const getCurrentModemConfig = () => {
  return {
    selectedNetwork: getSelectedNetwork(),
    apn: modem.config.apn as string,
    username: modem.config.username as string,
    password: modem.config.password as string,
    autoconfig: modem.config.autoconfig as boolean,
  };
};

const saveModemConfig = () => {
  changeModemSettings({
    device: deviceId,
    apn: modemProperties.apn,
    username: modemProperties.username,
    network_type: modemProperties.selectedNetwork.value,
    password: modemProperties.password,
    autoconfig: modemProperties.autoconfig,
  });
};
let modemProperties = $state(getCurrentModemConfig());

const resetHotSpotProperties = () => {
  modemProperties = getCurrentModemConfig();
};
// TODO Enable roaming
const checkChanges = () => {
  const defaultValues = getCurrentModemConfig();
  return Object.entries(defaultValues).some(([key, value]) => {
    if (key === 'selectedNetwork') {
      return value.value !== modemProperties[key].value;
    }
    return value !== modemProperties[key];
  });
};
</script>

<div class="grid gap-2">
  <div class="mt-3 grid gap-1">
    <Label for="channel" class="mb-2 ml-1">Network Type</Label>
    <Select.Root selected={modemProperties.selectedNetwork}>
      <Select.Trigger class="w-[180px]">
        <Select.Value placeholder="Select Network Type"></Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          {#each modem.network_type.supported as networkType}
            <Select.Item value={networkType}>{renameSupportedModemNetwork(networkType)}</Select.Item>
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  </div>
  <div class="flex items-center">
    <Toggle
      variant="outline"
      class={cn(modemProperties.autoconfig ? 'data-[state=on]:bg-green-600' : 'bg-red-600')}
      title={$_('network.modem.autoapn')}
      bind:pressed={modemProperties.autoconfig}>
      {#if modemProperties.autoconfig}
        <Check></Check>
      {:else}
        <X></X>
      {/if}
    </Toggle>

    <div class="ml-4 space-y-1">
      <p class="text-sm text-muted-foreground">
        {$_('network.modem.autoapn')}
      </p>
    </div>
  </div>
  {#if !modemProperties.autoconfig}
    <div class="grid gap-1">
      <Label for="apn" class="mb-1">APN</Label>
      <Input id="apn" autocapitalize="none" autocomplete="off" autocorrect="off" bind:value={modemProperties.apn} />
    </div>
    <div class="grid gap-1">
      <Label for="username" class="mb-1">Username</Label>
      <Input
        id="username"
        bind:value={modemProperties.username}
        type="text"
        autocapitalize="none"
        autocomplete="off"
        autocorrect="off" />
    </div>
    <div class="grid gap-1">
      <Label for="Password" class="mb-1">Password</Label>
      <Input
        id="Password"
        bind:value={modemProperties.password}
        type="text"
        autocapitalize="none"
        autocomplete="off"
        autocorrect="off" />
    </div>
  {/if}

  <Button class="w-[100%]" onclick={saveModemConfig} disabled={!checkChanges()}>{$_('network.modem.save')}</Button>
</div>
