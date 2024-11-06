import type { PipelinesMessage } from '$lib/types/socket-messages';

export type PipelineInfo = {
  device: string | null;
  encoder: string | null;
  format: string | null;
  resolution: string | null;
  fps: number | null;
};

type HumanReadablePipeline = {
  name: string;
  asrc: boolean;
  acodec: boolean;
  identifier: string;
  extraction: PipelineInfo;
};

export type GroupedPipelines = {
  [device: string]: {
    [format: string]: {
      [encoder: string]: {
        [resolution: string]: HumanReadablePipeline[];
      };
    };
  };
};

export function parsePipelineName(name: string): PipelineInfo {
  const deviceMatch = name.match(/^([^/]+)/);
  const encoderMatch = name.match(/(h264|h265)/);

  const formatMatch = name.match(/(?:h264|h265)_([^_]+(?:_[^_\d]+)*)/);
  const resolutionMatch = name.match(/(\d{3,4}p)/);
  const fpsMatch = name.match(/(\d+(?:\.\d+)?)(?:fps)?$/);

  return {
    device: deviceMatch ? deviceMatch[0] : null,
    encoder: encoderMatch ? encoderMatch[0] : null,
    format: formatMatch ? formatMatch[1].replace(/_/g, ' ') : null,
    resolution: resolutionMatch ? resolutionMatch[0] : null,
    fps: fpsMatch ? parseFloat(fpsMatch[1]) : null,
  };
}

export const groupPipelinesByDeviceAndFormat = (pipelines: PipelinesMessage): GroupedPipelines => {
  const groupedPipelines: GroupedPipelines = {};

  Object.entries(pipelines).forEach(([key, value]) => {
    const extraction = parsePipelineName(value.name);
    const device = extraction.device || 'unknown';
    const format = extraction.format || 'unknown';
    const encoder = extraction.encoder || 'unknown';
    const resolution = extraction.resolution || '[Given by the device]';

    if (!groupedPipelines[device]) {
      groupedPipelines[device] = {};
    }

    if (!groupedPipelines[device][format]) {
      groupedPipelines[device][format] = {};
    }

    if (!groupedPipelines[device][format][encoder]) {
      groupedPipelines[device][format][encoder] = {};
    }

    if (!groupedPipelines[device][format][encoder][resolution]) {
      groupedPipelines[device][format][encoder][resolution] = [];
    }

    groupedPipelines[device][format][encoder][resolution].push({
      ...value,
      identifier: key,
      extraction,
    });
  });

  console.log(groupedPipelines);
  return groupedPipelines;
};
