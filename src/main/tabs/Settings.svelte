<script lang="ts">
import { Binary, ServerIcon, Volume } from 'lucide-svelte';
import { _ } from 'svelte-i18n';
import type { AudioCodecsMessage, PipelinesMessage } from '$lib/types/socket-messages';
import type { Selected } from 'bits-ui';
import { Button } from '$lib/components/ui/button';
import * as Card from '$lib/components/ui/card';
import { Input } from '$lib/components/ui/input';
import { Label } from '$lib/components/ui/label';
import * as Select from '$lib/components/ui/select';
import { Slider } from '$lib/components/ui/slider';

import { type GroupedPipelines, groupPipelinesByDeviceAndFormat, parsePipelineName } from '$lib/helpers/PipelineHelper';
import { type AudioCodecs, startStreaming, stopStreaming, updateBitrate } from '$lib/helpers/SystemHelper';
import { AudioCodecsMessages, ConfigMessages, PipelinesMessages, StatusMessages } from '$lib/stores/websocket-store';

type SelectInputString = Selected<string | null | undefined> | undefined;
type SelectInputNumberOrString = Selected<number | string | null | undefined> | undefined;

// State variables
let groupedPipelines: GroupedPipelines[keyof GroupedPipelines] | undefined = $state(undefined);
let selectedInputMode: SelectInputString = $state();

// Encoder Section
let selectedEncoder: SelectInputString = $state();
let selectedResolution: SelectInputString = $state();
let selectedFramerate: SelectInputNumberOrString = $state();
let unparsedPipelines: PipelinesMessage | undefined = $state();
let selectedPipeline: keyof PipelinesMessage | undefined = $state();
let initialSelectedPipeline: keyof PipelinesMessage | undefined = $state();

let selectedBitrate: number = $state(0);
let areThereChanges: boolean = $state(false);
let initialSelectedBitrate: number | undefined = $state();
let isStreaming: boolean | undefined = $state();

// Audio Section
let audioSources: Array<string> = $state([]);
let initialSelectedAudioSource: string | undefined = $state();
let selectedAudioSource: SelectInputString = $state();
let audioCodecs: AudioCodecsMessage | undefined = $state();

let initialSelectedAudioCodec: AudioCodecs | undefined = $state();
let selectedAudioCodec: SelectInputString = $state();
let initialSelectedAudioDelay: number | undefined = $state();
let selectedAudioDelay: number = $state(0);

// SRTLA Config
let srtlaServerAddress: string | undefined = $state();
let srtlaServerPort: number | undefined = $state();
let srtStreamId: string | undefined = $state();
let srtLatency: number | undefined = $state();

AudioCodecsMessages.subscribe(audioCodecsMessage => {
  if (audioCodecsMessage && !audioCodecs) {
    audioCodecs = audioCodecsMessage;
  }
});
StatusMessages.subscribe(status => {
  if (status) {
    isStreaming = status.is_streaming;
    if (audioCodecs && initialSelectedAudioCodec && !selectedAudioCodec) {
      selectedAudioCodec = {
        value: initialSelectedAudioCodec,
        label: audioCodecs[initialSelectedAudioCodec],
      };
    }

    if (status.asrcs.length !== audioSources?.length) {
      audioSources = status.asrcs;
      if (selectedAudioSource && audioSources) {
        if (!audioSources.includes(`${selectedAudioSource.value}`)) {
          selectedAudioSource.label = `${selectedAudioSource.value} (Not Available)`;
        } else {
          selectedAudioSource.label = selectedAudioSource?.value ?? undefined;
        }
      }
    }
  }
});
// Subscribe to configuration messages
ConfigMessages.subscribe(config => {
  if (config) {
    if (srtLatency === undefined) {
      srtLatency = config.srt_latency ?? 2000;
    }

    if (!srtlaServerPort && config.srtla_port) {
      srtlaServerPort = config.srtla_port;
    }

    if (!srtStreamId && config.srt_streamid) {
      srtStreamId = config.srt_streamid;
    }

    if (!srtlaServerAddress && config.srtla_addr) {
      srtlaServerAddress = config.srtla_addr;
    }

    if (initialSelectedAudioDelay === undefined) {
      initialSelectedAudioDelay = config.delay ?? 0;
      selectedAudioDelay = config.delay ?? 0;
    }
    if (!initialSelectedPipeline) {
      initialSelectedPipeline = config.pipeline;
      selectedPipeline = config.pipeline;
    }
    if (!initialSelectedBitrate) {
      initialSelectedBitrate = config?.max_br ?? 5000;
      selectedBitrate = config?.max_br ?? 5000;
    }
    if (!initialSelectedAudioSource) {
      initialSelectedAudioSource = config?.asrc ?? '';
      selectedAudioSource = { value: config?.asrc, label: config?.asrc };
    }
    if (!initialSelectedAudioCodec) {
      initialSelectedAudioCodec = config.acodec;
    }
  }
});

// Subscribe to pipeline messages
PipelinesMessages.subscribe(message => {
  if (message) {
    if (!unparsedPipelines) {
      groupedPipelines = groupPipelinesByDeviceAndFormat(message)['rk3588'];
      unparsedPipelines = message;
    }
  }
});

$effect.pre(() => {
  if (selectedPipeline && unparsedPipelines) {
    const parsedPipeline = parsePipelineName(unparsedPipelines[selectedPipeline].name);
    selectedInputMode = {
      value: parsedPipeline.format,
      label: parsedPipeline.format?.split(' ')[0].toUpperCase(),
    };

    selectedEncoder = {
      value: parsedPipeline.encoder,
      label: parsedPipeline.encoder?.toUpperCase(),
    };

    selectedResolution = {
      value: parsedPipeline.resolution,
      label: parsedPipeline.resolution ?? undefined,
    };

    selectedFramerate = {
      value: parsedPipeline.fps,
      label: parsedPipeline.fps?.toString() ?? undefined,
    };
  }
});

$effect(() => {
  if (
    groupedPipelines &&
    selectedInputMode?.value &&
    selectedEncoder?.value &&
    selectedResolution?.value &&
    selectedFramerate?.value
  ) {
    selectedPipeline = groupedPipelines[selectedInputMode.value][selectedEncoder.value][selectedResolution.value]?.find(
      pipeline => {
        return pipeline.extraction.fps === selectedFramerate?.value;
      },
    )?.identifier;
    areThereChanges =
      selectedPipeline !== undefined &&
      (initialSelectedPipeline !== selectedPipeline || initialSelectedBitrate !== selectedBitrate);
  } else {
    areThereChanges = false;
    selectedPipeline = undefined;
  }
});

// const savePipelineConfig = () => {
//   if (selectedPipeline) {
//     updateConfig({ pipeline: selectedPipeline });
//   }
// };
const updateMaxBitrate = () => {
  updateBitrate(selectedBitrate);
};

const startStreamingWithCurrentConfig = () => {
  let config: { [key: string]: string | number } = {};
  if (selectedPipeline) {
    config.pipeline = selectedPipeline;
  }
  const pipelineData = unparsedPipelines![selectedPipeline!]!;
  if (pipelineData.asrc) {
    config.asrc = selectedAudioSource!.value!;
  }
  if (pipelineData.acodec) {
    config.acodec = selectedAudioCodec!.value!;
  }
  if (srtlaServerAddress) {
    config.srtla_addr = srtlaServerAddress;
  }
  if (srtLatency !== undefined) {
    config.srt_latency = srtLatency;
  }

  if (srtlaServerPort !== undefined) {
    config.srtla_port = srtlaServerPort;
  }

  config.srt_streamid = srtStreamId ?? '';

  config.delay = selectedAudioDelay;
  config.max_br = selectedBitrate!;
  startStreaming(config);
};
</script>

<div class="flex-col md:flex">
  <div class="flex-1 space-y-4 p-8 pt-6">
    {#if isStreaming}
      <Button class="w-[100%] bg-yellow-600 hover:bg-yellow-600/80" onclick={stopStreaming}
        >{$_('settings.stopStreaming')}</Button>
    {:else}
      <Button class="w-[100%]" onclick={startStreamingWithCurrentConfig}>{$_('settings.startStreaming')}</Button>
    {/if}

    <div class="grid grid-rows-2 gap-4 md:grid-cols-3 lg:grid-cols-2">
      <Card.Root class="row-span-2">
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <Card.Title class="text-sm font-medium">{$_('settings.encoderSettings')}</Card.Title>
          <Binary class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <!-- Input Mode Selection -->
          <div>
            <Label class="mb-2">{$_('settings.inputMode')}</Label>
            <Select.Root
              disabled={isStreaming}
              selected={selectedInputMode}
              onSelectedChange={value => {
                selectedResolution = { value: undefined, label: undefined };
                selectedFramerate = { value: undefined, label: undefined };
                selectedInputMode = value;
              }}>
              <Select.Trigger>
                <Select.Value placeholder={$_('settings.selectOutputFormat')}></Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#if groupedPipelines}
                    {#each Object.entries(groupedPipelines) as [pipelineKey, _]}
                      {@const label = pipelineKey.toUpperCase().split(' ')[0]}
                      <Select.Item value={pipelineKey} {label}></Select.Item>
                    {/each}
                  {/if}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <!-- Encoding Format Selection -->
          <div>
            <Label class="mb-2">{$_('settings.encodingFormat')}</Label>
            <Select.Root
              disabled={isStreaming}
              selected={selectedEncoder}
              onSelectedChange={value => (selectedEncoder = value)}>
              <Select.Trigger>
                <Select.Value placeholder={$_('settings.selectEncodingOutputFormat')}></Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#if selectedInputMode?.value && groupedPipelines?.[selectedInputMode.value]}
                    {#each Object.keys(groupedPipelines[selectedInputMode.value]) as encoder}
                      <Select.Item value={encoder} label={encoder.toUpperCase()}></Select.Item>
                    {/each}
                  {/if}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <!-- Encoding Resolution Selection -->
          <div>
            <Label class="mb-2">{$_('settings.encodingResolution')}</Label>
            <Select.Root
              disabled={isStreaming}
              selected={selectedResolution}
              onSelectedChange={value => {
                selectedFramerate = { value: undefined, label: undefined };
                selectedResolution = value;
              }}>
              <Select.Trigger>
                <Select.Value placeholder={$_('settings.selectEncodingResolution')}></Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#if selectedEncoder?.value && selectedInputMode?.value && groupedPipelines?.[selectedInputMode.value]?.[selectedEncoder.value]}
                    {@const resolutions = Object.keys(groupedPipelines[selectedInputMode.value][selectedEncoder.value])}
                    {#each resolutions as resolution}
                      <Select.Item value={resolution} label={resolution}></Select.Item>
                    {/each}
                  {/if}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <!-- Framerate Selection -->
          <div>
            <Label class="mb-2">{$_('settings.framerate')}</Label>
            <Select.Root
              disabled={isStreaming}
              selected={selectedFramerate}
              onSelectedChange={value => (selectedFramerate = value)}>
              <Select.Trigger>
                <Select.Value placeholder={$_('settings.selectFramerate')}></Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#if selectedEncoder?.value && selectedInputMode?.value && selectedResolution?.value && groupedPipelines?.[selectedInputMode.value]?.[selectedEncoder.value][selectedResolution.value]}
                    {@const framerates =
                      groupedPipelines[selectedInputMode.value][selectedEncoder.value][selectedResolution.value]}
                    {#each framerates as framerate}
                      <Select.Item value={framerate.extraction.fps} label={framerate.extraction.fps?.toString()}
                      ></Select.Item>
                    {/each}
                  {/if}
                </Select.Group>
              </Select.Content>
            </Select.Root>
            <div>
              <Label>{$_('settings.bitrate')}</Label>
              <Slider
                class="mb-2 mt-2"
                value={[selectedBitrate]}
                max={12000}
                min={500}
                step={50}
                onValueChange={value => {
                  selectedBitrate = value[0];
                  updateMaxBitrate();
                }} />
              <Input bind:value={selectedBitrate} type="number" step="1" min="500" max="12000"></Input>
              {#if isStreaming}
                <p class="text-xs">{$_('settings.changeBitrateNotice')}</p>
              {/if}
            </div>
          </div>
        </Card.Content>
      </Card.Root>

      <Card.Root class="row-span-1">
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <Card.Title class="text-sm font-medium">{$_('settings.audioSettings')}</Card.Title>
          <Volume class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          {#if audioCodecs && unparsedPipelines && selectedPipeline && unparsedPipelines[selectedPipeline].asrc}
            <Label class="mb-2">{$_('settings.audioSource')}</Label>
            <Select.Root
              disabled={isStreaming}
              selected={selectedAudioSource}
              onSelectedChange={value => (selectedAudioSource = value)}>
              <Select.Trigger>
                <Select.Value placeholder={$_('settings.selectAudioSource')}></Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#if audioSources}
                    {#each audioSources as audioSource}
                      <Select.Item value={audioSource} label={audioSource}></Select.Item>
                    {/each}
                  {/if}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          {/if}

          {#if audioCodecs && unparsedPipelines && selectedPipeline && unparsedPipelines[selectedPipeline].acodec}
            <Label class="mb-2">{$_('settings.audioCodec')}</Label>
            <Select.Root
              disabled={isStreaming}
              selected={selectedAudioCodec}
              onSelectedChange={value => (selectedAudioCodec = value)}>
              <Select.Trigger>
                <Select.Value placeholder={$_('settings.selectAudioCodec')}></Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#each Object.entries(audioCodecs) as [codec, label]}
                    <Select.Item value={codec} {label}></Select.Item>
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
            <div>
              <Label>{$_('settings.audioDelay')}</Label>
              <Slider
                class="mb-2 mt-2"
                disabled={isStreaming}
                value={[selectedAudioDelay]}
                max={2000}
                min={-2000}
                step={5}
                onValueChange={value => (selectedAudioDelay = value[0])} />
              <Input bind:value={selectedAudioDelay} type="number" step="5" min="-2000" max="2000"></Input>
            </div>
          {/if}

          {#if audioCodecs && unparsedPipelines && selectedPipeline && !unparsedPipelines[selectedPipeline].acodec && !unparsedPipelines[selectedPipeline].asrc}
            <h3>{$_('settings.noAudioSettingSupport')}</h3>
          {/if}

          {#if audioCodecs && unparsedPipelines && !selectedPipeline}
            <h3>{$_('settings.audioSettingsMessage')}</h3>
          {/if}
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <Card.Title class="text-sm font-medium">{$_('settings.receiverServer')}</Card.Title>
          <ServerIcon class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <Label>{$_('settings.srtlaServerAddress')}</Label>
          <Input bind:value={srtlaServerAddress}></Input>
          <Label>{$_('settings.srtlaServerPort')}</Label>
          <Input type="number" bind:value={srtlaServerPort}></Input>
          <Label>{$_('settings.srtStreamId')}</Label>
          <Input bind:value={srtStreamId}></Input>
          {#if srtLatency !== undefined}
            <Label>{$_('settings.srtLatency')}</Label>
            <Input type="number" bind:value={srtLatency}></Input>
          {/if}
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>
