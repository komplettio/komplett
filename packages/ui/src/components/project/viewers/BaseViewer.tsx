import { SquareSplitHorizontal, SquareStack } from 'lucide-react';
import { useEffect } from 'react';

import type { FileBaseModel, UUID } from '@komplett/core';

import { SUPPORTED_VIEWER_MODE } from '#constants/project';
import { useFile } from '#state/queries/file.queries.js';
import { useEditorStore } from '#state/stores';
import type { ViewerKind, ViewerMode } from '#types';
import * as UI from '#ui';

import AudioViewer from './AudioViewer';
import DocumentViewer from './DocumentViewer';
import ImageViewer from './ImageViewer';
import TextViewer from './TextViewer';
import UnknownViewer from './UnknownViewer';
import VideoViewer from './VideoViewer';

import './BaseViewer.scss';

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

export default function BaseViewer({ originalFileId, resultFileId, kind, zoomEnabled = true }: ViewerProps) {
  const { data: originalFile } = useFile(originalFileId);
  const { data: resultFile } = useFile(resultFileId);
  const [viewerMode, setViewerMode] = useEditorStore(s => [s.viewerMode, s.setViewerMode]);

  // Switch view mode if the current mode is not supported by the project kind
  useEffect(() => {
    const supportedModes = SUPPORTED_VIEWER_MODE[kind];
    if (!supportedModes.includes(viewerMode)) {
      setViewerMode('simple');
    }
  }, [viewerMode, setViewerMode, kind]);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime safety check
  if (!kind || !ViewerMap[kind]) {
    throw new Error(`Viewer for kind "${kind}" is not defined.`);
  }

  const Viewer = originalFile && resultFile ? ViewerMap[originalFile.kind] : UnknownViewer;

  if (originalFile && resultFile) {
    return (
      <div className="base-viewer">
        <div className="base-viewer__overlay">
          <UI.ToggleGroup.Root
            className="base-viewer__mode-switch"
            type="single"
            value={viewerMode}
            onValueChange={v => {
              if (v) setViewerMode(v as ViewerMode);
            }}
          >
            <UI.ToggleGroup.Item value="simple">
              <SquareStack size={20} />
            </UI.ToggleGroup.Item>
            <UI.ToggleGroup.Item value="split">
              <SquareSplitHorizontal size={20} />
            </UI.ToggleGroup.Item>
          </UI.ToggleGroup.Root>
        </div>
        <Viewer
          originalFile={originalFile}
          resultFile={resultFile}
          mode={viewerMode}
          kind={kind}
          zoomEnabled={zoomEnabled}
        />
      </div>
    );
  }

  return <div>Loading...</div>;
}
