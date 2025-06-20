import { FileInput, FileOutput, Grid3X3, Moon, SquareSplitHorizontal, SquareStack, Sun, SunMoon } from 'lucide-react';
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

import clsx from 'clsx';

export const ViewerMap = {
  image: ImageViewer,
  video: VideoViewer,
  audio: AudioViewer,
  document: DocumentViewer,
  text: TextViewer,
  unknown: UnknownViewer,
} satisfies Record<ViewerKind, React.ComponentType<ViewerProps>>;

const viewModeToggles = [
  {
    value: 'split',
    label: 'Split',
    icon: <SquareSplitHorizontal size={20} />,
  },
  {
    value: 'collage',
    label: 'Collage',
    icon: <SquareStack size={20} />,
  },
  {
    value: 'input',
    label: 'Input',
    icon: <FileInput size={20} />,
  },
  {
    value: 'output',
    label: 'Output',
    icon: <FileOutput size={20} />,
  },
] as const;

export interface ViewerProps {
  originalFile: FileBaseModel | undefined;
  resultFile: FileBaseModel | undefined;
  mode: ViewerMode;
  kind: ViewerKind;
  zoomEnabled?: boolean;
}

export interface BaseViewerProps {
  originalFileId: UUID;
  resultFileId: UUID | null;
  kind: ViewerKind;
  zoomEnabled?: boolean;
}

export default function BaseViewer({ originalFileId, resultFileId, kind, zoomEnabled = true }: BaseViewerProps) {
  const { data: originalFile } = useFile(originalFileId);
  const { data: resultFile } = useFile(resultFileId);
  const [viewerMode, background, setViewerMode, setBackground] = useEditorStore(s => [
    s.viewerMode,
    s.background,
    s.setViewerMode,
    s.setBackground,
  ]);

  const supportedModes = SUPPORTED_VIEWER_MODE[kind];

  // Switch view mode if the current mode is not supported by the project kind
  useEffect(() => {
    if (!supportedModes.includes(viewerMode)) {
      setViewerMode('input');
    }
  }, [viewerMode, setViewerMode, supportedModes]);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime safety check
  if (!kind || !ViewerMap[kind]) {
    throw new Error(`Viewer for kind "${kind}" is not defined.`);
  }

  const Viewer = originalFile ? ViewerMap[originalFile.kind] : UnknownViewer;

  return (
    <div className={clsx('base-viewer', `base-viewer--${background ?? 'default'}`)}>
      <div className="base-viewer__overlay">
        <UI.ToggleGroup.Root
          className="base-viewer__mode-switch"
          type="single"
          value={viewerMode}
          onValueChange={v => {
            if (v) setViewerMode(v as ViewerMode);
          }}
        >
          {viewModeToggles.map(
            toggle =>
              supportedModes.includes(toggle.value) && (
                <UI.ToggleGroup.Item key={toggle.value} value={toggle.value}>
                  {toggle.icon}
                </UI.ToggleGroup.Item>
              ),
          )}
        </UI.ToggleGroup.Root>

        <UI.ToggleGroup.Root
          className="base-viewer__background-switch"
          type="single"
          value={background ?? 'default'}
          onValueChange={v => {
            if (v) setBackground(v as 'dark' | 'light' | 'pattern');
          }}
        >
          <UI.ToggleGroup.Item value="default">
            <SunMoon />
          </UI.ToggleGroup.Item>
          <UI.ToggleGroup.Item value="dark">
            <Moon />
          </UI.ToggleGroup.Item>
          <UI.ToggleGroup.Item value="light">
            <Sun />
          </UI.ToggleGroup.Item>
          <UI.ToggleGroup.Item value="pattern">
            <Grid3X3 />
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
