<script lang="ts">
import { Check, X } from 'lucide-svelte';
import { _ } from 'svelte-i18n';
import type { Modem, ModemNetworkType } from '$lib/types/socket-messages';
import { Button } from '$lib/components/ui/button';
import { Input } from '$lib/components/ui/input';
import { Label } from '$lib/components/ui/label';

import * as Select from '$lib/components/ui/select';
import { Toggle } from '$lib/components/ui/toggle';
import { changeModemSettings, renameSupportedModemNetwork, scanModemNetworks } from '$lib/helpers/NetworkHelper';
import { cn } from '$lib/utils';

let { deviceId, modem, modemIsScanning } = $props<{
  deviceId: number | string;
  modem: Modem;
  modemIsScanning: boolean;
}>();
const getSelectedNetwork: () => { value: ModemNetworkType; label: string } = () => {
  return { value: modem.network_type.active, label: renameSupportedModemNetwork(modem.network_type.active) };
};

const defaultRoamingNetwork = { value: '', label: 'network.modem.automaticRoamingNetwork' };
const getCurrentModemConfig = () => {
  return {
    selectedNetwork: getSelectedNetwork(),
    autoconfig: modem.config?.autoconfig || false,
    apn: modem.config?.apn || '',
    username: modem.config?.username || '',
    password: modem.config?.password || '',
    roaming: modem.config?.roaming || '',
    network:
      modem.config?.network === ''
        ? defaultRoamingNetwork
        : { value: modem.config?.network, label: modem.available_networks[modem.config.network].name },
  };
};

const saveModemConfig = () => {
  if (!modemProperties.roaming) {
    modemProperties.network = defaultRoamingNetwork;
  }
  changeModemSettings({
    device: deviceId,
    apn: modemProperties.apn,
    username: modemProperties.username,
    network_type: modemProperties.selectedNetwork.value,
    password: modemProperties.password,
    autoconfig: modemProperties.autoconfig,
    roaming: modemProperties.roaming,
    network: modemProperties.network.value,
  });
};
let modemProperties = $state(getCurrentModemConfig());

// eslint-disable-next-line unused-imports/no-unused-vars
const resetHotSpotProperties = () => {
  modemProperties = getCurrentModemConfig();
};

const checkChanges = () => {
  const defaultValues = getCurrentModemConfig();
  return Object.entries(defaultValues).some(([key, value]) => {
    if (key === 'selectedNetwork' || key === 'network') {
      if (key === 'network' || !modemProperties.roaming) {
        return false;
      }
      return value.value !== modemProperties[key].value;
    }
    return value !== modemProperties[key];
  });
};
</script>

<div class="grid gap-2">
  <div class="mt-1 grid gap-1">
    <Label for="channel" class="mb-2 ml-1">{$_('network.modem.networkType')}</Label>
    <Select.Root
      selected={modemProperties.selectedNetwork}
      onSelectedChange={val => {
        if (val) modemProperties.selectedNetwork = val;
      }}>
      <Select.Trigger>
        <Select.Value></Select.Value>
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
      class={cn(modemProperties.roaming ? 'data-[state=on]:bg-green-600' : 'bg-red-600')}
      title={$_('network.modem.autoapn')}
      bind:pressed={modemProperties.roaming}>
      {#if modemProperties.roaming}
        <Check></Check>
      {:else}
        <X></X>
      {/if}
    </Toggle>
    <div class="ml-4 space-y-1">
      <p class="text-sm text-muted-foreground">
        {$_('network.modem.enableRoaming')}
      </p>
    </div>
  </div>
  <div>
    <div class="relative mt-1 grid gap-1">
      <Label for="channel" class="mb-2 ml-1">{$_('network.modem.roamingNetwork')}</Label>
      <Select.Root
        selected={modemProperties.network.value === ''
          ? { value: modemProperties.network.value, label: $_(modemProperties.network.label) }
          : modemProperties.network}
        onSelectedChange={val => {
          if (val) modemProperties.network = val;
        }}>
        <Select.Trigger>
          <Select.Value></Select.Value>
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value={defaultRoamingNetwork.value} label={$_(defaultRoamingNetwork.label)}></Select.Item>

            {#if modem.available_networks}
              {#each Object.entries(modem.available_networks) as [key, availableNetwork]}
                {#if availableNetwork.availability === 'available'}
                  <Select.Item value={key} label={availableNetwork.name}></Select.Item>
                {/if}
              {/each}
            {/if}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <div class="absolute bottom-0 right-0">
        <Button
          variant="outline"
          class=" rounded-l-none border-l-0 bg-blue-600 hover:bg-blue-700"
          onclick={() => {
            scanModemNetworks(deviceId);
          }}
          disabled={modemIsScanning}>
          {modemIsScanning ? $_('network.modem.scanning') : $_('network.modem.scan')}
        </Button>
      </div>
    </div>
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
      <Label for="apn" class="mb-1">{$_('network.modem.apn')}</Label>
      <Input id="apn" autocapitalize="none" autocomplete="off" autocorrect="off" bind:value={modemProperties.apn} />
    </div>
    <div class="grid gap-1">
      <Label for="username" class="mb-1">{$_('network.modem.username')}</Label>
      <Input
        id="username"
        bind:value={modemProperties.username}
        type="text"
        autocapitalize="none"
        autocomplete="off"
        autocorrect="off" />
    </div>
    <div class="grid gap-1">
      <Label for="Password" class="mb-1">{$_('network.modem.password')}</Label>
      <Input
        id="Password"
        bind:value={modemProperties.password}
        type="text"
        autocapitalize="none"
        autocomplete="off"
        autocorrect="off" />
    </div>
  {/if}

  <Button class="mt-2 w-[100%]" onclick={saveModemConfig} disabled={!checkChanges()}>{$_('network.modem.save')}</Button>
</div>
