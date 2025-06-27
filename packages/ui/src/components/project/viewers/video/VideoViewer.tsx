import { useEffect, useState } from 'react';

import type { VideoMetadata } from '@komplett/core';

import * as UI from '#ui';

import type { ViewerProps } from '../base/BaseViewer';
import type { RendererProps } from '../views';
import View from '../views';
import ZoomableView from '../views/zoomable/ZoomableView';

import './VideoViewer.scss';

import { ArrowLeftToLine, ArrowRightToLine, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export type VideoViewerProps = ViewerProps;

function Renderer({ file }: RendererProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file.blob);
      setUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
        setUrl(null);
      };
    }
  }, [file]);

  if (!url) return null;

  return (
    <video src={url} preload="metadata">
      Your browser does not support the video tag.
    </video>
  );
}

export default function VideoViewer({ originalFile, resultFile, mode, overlay }: VideoViewerProps) {
  if (!originalFile) {
    return <div className="base-viewer__loading">Loading...</div>;
  }

  const videoMetadata = originalFile.metadata as VideoMetadata;

  const viewWidth = videoMetadata.dimensions.width;
  let viewHeight = videoMetadata.dimensions.height;

  // estimate of the collage view height.
  // TODO: Make this the actual height
  if (mode === 'collage') {
    viewHeight *= 2;
  }

  return (
    <div className="video-viewer">
      <div className="video-viewer__view">
        {overlay}
        <ZoomableView contentHeight={viewHeight} contentWidth={viewWidth}>
          <div className="base-viewer__processing-effect"></div>
          <View originalFile={originalFile} resultFile={resultFile} mode={mode} renderer={Renderer} />
        </ZoomableView>
      </div>
      <div className="video-viewer__controls">
        <UI.Progress.Root value={20} max={100} className="video-viewer__progress-bar">
          <UI.Progress.Indicator
            className="video-viewer__progress-indicator"
            style={{ transform: `translateX(-${String(100 - 20)}%)` }}
          />
        </UI.Progress.Root>
        <UI.Button.Root secondary>
          <ArrowLeftToLine />
        </UI.Button.Root>
        <UI.Button.Root secondary>
          <ChevronLeft />
        </UI.Button.Root>
        <UI.Button.Root secondary>
          <Play />
        </UI.Button.Root>
        <UI.Button.Root secondary>
          <ChevronRight />
        </UI.Button.Root>
        <UI.Button.Root secondary>
          <ArrowRightToLine />
        </UI.Button.Root>
      </div>
    </div>
  );
}
