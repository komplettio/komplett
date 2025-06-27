import { useEffect, useState } from 'react';

import type { ImageMetadata } from '@komplett/core';

import type { ViewerProps } from '../base/BaseViewer';
import type { RendererProps } from '../views';
import View from '../views';
import ZoomableView from '../views/zoomable/ZoomableView';

import './ImageViewer.scss';

export type ImageViewerProps = ViewerProps;

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

  return <img src={url} />;
}

export default function ImageViewer({ originalFile, resultFile, mode, overlay }: ImageViewerProps) {
  if (!originalFile) {
    return <div className="base-viewer__loading">Loading...</div>;
  }

  const imageMetadata = originalFile.metadata as ImageMetadata;

  const viewWidth = imageMetadata.dimensions.width;
  let viewHeight = imageMetadata.dimensions.height;

  // estimate of the collage view height.
  // TODO: Make this the actual height
  if (mode === 'collage') {
    viewHeight *= 2;
  }
  return (
    <div className="image-viewer">
      <div className="image-viewer__view">
        {overlay}
        <ZoomableView contentHeight={viewHeight} contentWidth={viewWidth}>
          <div className="base-viewer__processing-effect"></div>
          <View originalFile={originalFile} resultFile={resultFile} mode={mode} renderer={Renderer} />
        </ZoomableView>
      </div>
    </div>
  );
}
