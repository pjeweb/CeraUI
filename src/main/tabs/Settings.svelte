<script lang="ts">
import { Binary, Volume } from 'lucide-svelte';
import type { PipelinesMessage } from '$lib/types/socket-messages';
import type { Selected } from 'bits-ui';
import * as Card from '$lib/components/ui/card';
import { Label } from '$lib/components/ui/label';
import * as Select from '$lib/components/ui/select';
import {
  type GroupedPipelines,
  type PipelineInfo,
  groupPipelinesByDeviceAndFormat,
  parsePipelineName,
} from '$lib/helpers/PipelineHelper';
import { ConfigMessages, PipelinesMessages } from '$lib/stores/websocket-store';

type SelectInput = Selected<string | null | undefined> | undefined;

let groupedPipelines: GroupedPipelines[keyof GroupedPipelines] | undefined = $state(undefined);
let selectedInputMode: SelectInput = $state();
let selectedFormat: string | undefined = $state();
let selectedMode: string | undefined = $state();
let selectedFramerate: string | undefined = $state();
let unparsedPipelines: PipelinesMessage | undefined = $state();
let selectedPipeline: keyof PipelinesMessage | undefined = $state();
let currentSelectionInfo: PipelineInfo | undefined = $state();

$effect(() => {
  ConfigMessages.subscribe(config => {
    if (config) {
      selectedPipeline = config.pipeline;
    }
  });
});

$effect(() => {
  PipelinesMessages.subscribe(message => {
    if (message) {
      groupedPipelines = groupPipelinesByDeviceAndFormat(message)['rk3588'];
      unparsedPipelines = message;
    }
  });
});

$effect.pre(() => {
  if (selectedPipeline && unparsedPipelines) {
    const parsedPipeline = parsePipelineName(unparsedPipelines[selectedPipeline].name);
    currentSelectionInfo = parsedPipeline;
    selectedInputMode = {
      value: parsedPipeline.format,
      label: parsedPipeline?.format?.split(' ')[0],
    };
  }
});
</script>

<div class=" flex-col md:flex">
  <div class="flex-1 space-y-4 p-8 pt-6">
    <div class="grid gap-4 md:grid-cols-3 lg:grid-cols-2">
      <Card.Root>
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <Card.Title class="text-sm font-medium">Encoder Settings</Card.Title>
          <Binary class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <div>
            <Label class="mb-2">Input mode</Label>
            <Select.Root
              selected={{
                value: currentSelectionInfo?.format,
                label: currentSelectionInfo?.format?.toUpperCase() ?? '',
              }}
              onSelectedChange={value => (selectedInputMode = value)}>
              <Select.Trigger>
                <Select.Value placeholder="Select an output format"></Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#if groupedPipelines !== undefined}
                    {#each Object.entries(groupedPipelines) as [pipelineKey, _groupedPipeline]}
                      {@const label = pipelineKey.toUpperCase().split(' ')[0]}
                      <Select.Item value={pipelineKey} {label}></Select.Item>
                    {/each}
                  {/if}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
          <div>
            <Label class="mb-2">Encoding format</Label>
            <Select.Root
              selected={{
                value: currentSelectionInfo?.encoder,
                label: currentSelectionInfo?.encoder?.toUpperCase() ?? '',
              }}>
              <Select.Trigger>
                <Select.Value placeholder="Select encoding output format"></Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#if selectedInputMode?.value && groupedPipelines?.[selectedInputMode.value]}
                    {#each Object.keys(groupedPipelines?.[selectedInputMode.value]) as encoder}
                      <Select.Item value={encoder} label={encoder.toUpperCase()}></Select.Item>
                    {/each}
                  {/if}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        </Card.Content>
      </Card.Root>
      <Card.Root>
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <Card.Title class="text-sm font-medium">Audio Settings</Card.Title>
          <div class="grid gap-1"></div>

          <Volume class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content></Card.Content>
      </Card.Root>
    </div>
  </div>
</div>
