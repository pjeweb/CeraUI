<script lang="ts">
import { Binary, Volume } from 'lucide-svelte';
import * as Card from '$lib/components/ui/card';
import * as Select from '$lib/components/ui/select';
import { type GroupedPipelines, groupPipelinesByDeviceAndFormat } from '$lib/helpers/PipelineHelper';
import { PipelinesMessages } from '$lib/stores/websocket-store';

let groupedPipelines: GroupedPipelines[keyof GroupedPipelines] | undefined = $state(undefined);
$effect(() => {
  PipelinesMessages.subscribe(message => {
    if (message) {
      groupedPipelines = groupPipelinesByDeviceAndFormat(message)['rk3588'];
      console.log(groupedPipelines);
    }
  });
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
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Select a channel"></Select.Value>
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#if groupedPipelines !== undefined}
                  {#each Object.entries(groupedPipelines) as [pipelineKey, groupedPipeline]}
                    <Select.Item value={JSON.stringify(pipelineKey)}>
                      {pipelineKey.toUpperCase()}
                    </Select.Item>
                  {/each}
                {/if}
              </Select.Group>
            </Select.Content>
          </Select.Root>
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
