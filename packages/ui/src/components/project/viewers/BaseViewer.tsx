import type { FileBaseModel, UUID } from '@komplett/core';

import { useFile } from '#state/queries/file.queries.js';
import type { ViewerKind, ViewerMode } from '#types';

import AudioViewer from './AudioViewer';
import DocumentViewer from './DocumentViewer';
import ImageViewer from './ImageViewer';
import TextViewer from './TextViewer';
import UnknownViewer from './UnknownViewer';
import VideoViewer from './VideoViewer';

export const ViewerMap = {
  image: ImageViewer,
  video: VideoViewer,
  audio: AudioViewer,
  document: DocumentViewer,
  text: TextViewer,
  unknown: UnknownViewer,
} satisfies Record<ViewerKind, React.ComponentType<BaseViewerProps>>;

export interface ViewerProps {
  originalFileId: UUID;
  resultFileId: UUID;
  mode: ViewerMode;
  kind: ViewerKind;
  zoomEnabled?: boolean;
}

export interface BaseViewerProps {
  originalFile: FileBaseModel;
  resultFile: FileBaseModel;
  mode: ViewerMode;
  kind: ViewerKind;
  zoomEnabled?: boolean;
}

export default function BaseViewer({ originalFileId, resultFileId, mode, kind, zoomEnabled = true }: ViewerProps) {
  const { data: originalFile } = useFile(originalFileId);
  const { data: resultFile } = useFile(resultFileId);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime safety check
  if (!kind || !ViewerMap[kind]) {
    throw new Error(`Viewer for kind "${kind}" is not defined.`);
  }

  const Viewer = originalFile && resultFile ? ViewerMap[originalFile.kind] : UnknownViewer;

  if (!originalFile && !resultFile) {
    return <>Loading...</>;
  }

  return (
    <div className="file-preview">
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <Viewer originalFile={originalFile!} resultFile={resultFile!} mode={mode} kind={kind} zoomEnabled={zoomEnabled} />
    </div>
  );
}
