import type { PipelinesMessage } from '$lib/types/socket-messages';

type VideoInfo = {
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
  extraction: VideoInfo;
};

export type GroupedPipelines = {
  [device: string]: {
    [format: string]: HumanReadablePipeline[];
  };
};

function parsePipelineName(name: string): VideoInfo {
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

    if (!groupedPipelines[device]) {
      groupedPipelines[device] = {};
    }

    if (!groupedPipelines[device][format]) {
      groupedPipelines[device][format] = [];
    }

    groupedPipelines[device][format].push({
      ...value,
      identifier: key,
      extraction,
    });
  });
  console.log(groupedPipelines);
  return groupedPipelines;
};
