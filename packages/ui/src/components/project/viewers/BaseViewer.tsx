import { FileBaseModel } from '@komplett/core';

import { ViewerKind, ViewerMode } from '#types';

import AudioViewer from './AudioViewer';
import DocumentViewer from './DocumentViewer';
import ImageViewer from './ImageViewer';
import OtherViewer from './OtherViewer';
import TextViewer from './TextViewer';
import VideoViewer from './VideoViewer';

export const ViewerMap = {
  image: ImageViewer,
  video: VideoViewer,
  audio: AudioViewer,
  document: DocumentViewer,
  text: TextViewer,
  other: OtherViewer,
} satisfies Record<ViewerKind, React.ComponentType<BaseViewerProps>>;

export interface BaseViewerProps {
  originalFile: FileBaseModel;
  resultFile?: FileBaseModel;
  mode: ViewerMode;
  kind: ViewerKind;
  zoomEnabled?: boolean;
}

export default function BaseViewer({ originalFile, resultFile, mode }: BaseViewerProps) {
  if (mode === 'split') {
    if (!resultFile) {
      throw new Error('Both original and result files are required for split mode.');
    }

    if (originalFile.kind !== resultFile.kind) {
      throw new Error('Original and result files must be of the same kind for split mode.');
    }
  }

  return <div className="file-preview"></div>;
}
