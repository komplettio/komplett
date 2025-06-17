import type { FileBaseModel } from '@komplett/core';

import type { ViewerKind, ViewerMode } from '#types';

import AudioViewer from './AudioViewer';
import DocumentViewer from './DocumentViewer';
import ImageViewer from './ImageViewer';
import TextViewer from './TextViewer';
import unknownViewer from './UnknownViewer';
import VideoViewer from './VideoViewer';

export const ViewerMap = {
  image: ImageViewer,
  video: VideoViewer,
  audio: AudioViewer,
  document: DocumentViewer,
  text: TextViewer,
  unknown: unknownViewer,
} satisfies Record<ViewerKind, React.ComponentType<BaseViewerProps>>;

export interface BaseViewerProps {
  originalFile: FileBaseModel;
  resultFile?: FileBaseModel | undefined;
  mode: ViewerMode;
  kind: ViewerKind;
  zoomEnabled?: boolean;
}

export default function BaseViewer({ originalFile, resultFile, mode, kind, zoomEnabled = true }: BaseViewerProps) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime safety check
  if (!kind || !ViewerMap[kind]) {
    throw new Error(`Viewer for kind "${kind}" is not defined.`);
  }

  const Viewer = ViewerMap[originalFile.kind];

  if (mode === 'split') {
    if (!resultFile) {
      throw new Error('Both original and result files are required for split mode.');
    }

    if (originalFile.kind !== resultFile.kind) {
      throw new Error('Original and result files must be of the same kind for split mode.');
    }
  }

  return (
    <div className="file-preview">
      <Viewer originalFile={originalFile} resultFile={resultFile} mode={mode} kind={kind} zoomEnabled={zoomEnabled} />
    </div>
  );
}
