import clsx from 'clsx';
import {
  CheckIcon,
  ChevronDownIcon,
  FileInput,
  FileOutput,
  Grid3X3,
  Moon,
  SquareSplitHorizontal,
  SquareStack,
  Sun,
  SunMoon,
} from 'lucide-react';
import { useEffect } from 'react';

import type { FileBaseModel, UUID } from '@komplett/core';

import { SUPPORTED_VIEWER_MODE } from '#constants/project';
import { useFile } from '#state/queries/file.queries.js';
import { useEditorStore } from '#state/stores';
import type { ViewerKind, ViewerMode } from '#types';
import * as UI from '#ui';

import AudioViewer from '../AudioViewer';
import DocumentViewer from '../DocumentViewer';
import ImageViewer from '../image/ImageViewer';
import TextViewer from '../TextViewer';
import UnknownViewer from '../UnknownViewer';
import VideoViewer from '../video/VideoViewer';

import './BaseViewer.scss';

const ZOOM_FACTOR_STEPS = [0.5, 1, 1.5, 2, 2.5, 3] as const;

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
  overlay?: React.ReactNode;
}

export interface BaseViewerProps {
  selectedFileId: UUID;
  files: FileBaseModel[];
  onFileSelect: (fileId: UUID) => void;
  resultFileId: UUID | null;
  kind: ViewerKind;
  busy?: boolean;
  zoomEnabled?: boolean;
}

export default function BaseViewer({
  selectedFileId,
  files,
  onFileSelect,
  resultFileId,
  kind,
  busy = false,
}: BaseViewerProps) {
  const { data: originalFile } = useFile(selectedFileId);
  const { data: resultFile } = useFile(resultFileId);
  const [viewerMode, background, zoomFactor, setZoomFactor, setViewerMode, setBackground] = useEditorStore(s => [
    s.viewerMode,
    s.background,
    s.zoomFactor,
    s.setZoomFactor,
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

  const overlay = (
    <div className="base-viewer__overlay">
      <UI.Select.Root value={selectedFileId} onValueChange={onFileSelect}>
        <UI.Select.Trigger className="base-viewer__file-select__trigger">
          <UI.Select.Value placeholder="Select a file..." />
          <UI.Select.Icon>
            <ChevronDownIcon />
          </UI.Select.Icon>
        </UI.Select.Trigger>

        <UI.Select.Portal>
          <UI.Select.Content position="popper" className="base-viewer__file-select__content">
            {files.map(file => (
              <UI.Select.Item key={file.id} value={file.id}>
                <UI.Select.ItemText>{file.name}</UI.Select.ItemText>
                {selectedFileId === file.id && (
                  <UI.Select.ItemIndicator>
                    <CheckIcon />
                  </UI.Select.ItemIndicator>
                )}
              </UI.Select.Item>
            ))}
          </UI.Select.Content>
        </UI.Select.Portal>
      </UI.Select.Root>
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
          <SunMoon size={20} />
        </UI.ToggleGroup.Item>
        <UI.ToggleGroup.Item value="dark">
          <Moon size={20} />
        </UI.ToggleGroup.Item>
        <UI.ToggleGroup.Item value="light">
          <Sun size={20} />
        </UI.ToggleGroup.Item>
        <UI.ToggleGroup.Item value="pattern">
          <Grid3X3 size={20} />
        </UI.ToggleGroup.Item>
      </UI.ToggleGroup.Root>

      <UI.Button.Root
        className="base-viewer__center-button"
        secondary
        onClick={() => {
          setZoomFactor(1);
        }}
      >
        center
      </UI.Button.Root>

      <UI.Select.Root
        value={zoomFactor.toFixed(2)}
        onValueChange={v => {
          setZoomFactor(Number(v));
        }}
      >
        <UI.Select.Trigger className="base-viewer__zoom-factor__trigger">
          <UI.Select.Value placeholder="Zoom factor" />
          <UI.Select.Icon>
            <ChevronDownIcon />
          </UI.Select.Icon>
        </UI.Select.Trigger>

        <UI.Select.Portal>
          <UI.Select.Content position="popper" className="base-viewer__zoom-factor__content">
            {!ZOOM_FACTOR_STEPS.includes(zoomFactor as (typeof ZOOM_FACTOR_STEPS)[number]) && (
              <UI.Select.Item value={zoomFactor.toFixed(2)}>
                <UI.Select.ItemText>{(zoomFactor * 100).toFixed(2)}%</UI.Select.ItemText>
                <UI.Select.ItemIndicator>
                  <CheckIcon />
                </UI.Select.ItemIndicator>
              </UI.Select.Item>
            )}
            {ZOOM_FACTOR_STEPS.map(zoom => (
              <UI.Select.Item key={zoom} value={zoom.toFixed(2)}>
                <UI.Select.ItemText>{(zoom * 100).toFixed(2)}%</UI.Select.ItemText>
                {zoomFactor.toFixed(2) === zoom.toFixed(2) && (
                  <UI.Select.ItemIndicator>
                    <CheckIcon />
                  </UI.Select.ItemIndicator>
                )}
              </UI.Select.Item>
            ))}
          </UI.Select.Content>
        </UI.Select.Portal>
      </UI.Select.Root>
    </div>
  );

  return (
    <div
      className={clsx('base-viewer', `base-viewer--${background ?? 'default'}`, {
        'base-viewer--busy': busy,
      })}
    >
      <Viewer originalFile={originalFile} resultFile={resultFile} mode={viewerMode} kind={kind} overlay={overlay} />
    </div>
  );
}
