import clsx from 'clsx';
import type { ResizeCallback, ResizeStartCallback } from 're-resizable';
import { Resizable } from 're-resizable';

import type { FileBaseModel } from '@komplett/core';

import { useEditorStore } from '#state/stores';
import { formatFileSize } from '#utils/formatters';

import './SplitView.scss';

export interface SplitViewHandleProps {
  originalFile: FileBaseModel | undefined;
  resultFile: FileBaseModel | undefined;
}

export function SplitViewHandle({ originalFile, resultFile }: SplitViewHandleProps) {
  return (
    <div className="split-view__handle">
      <span className="base-viewer__label base-viewer__label--input">
        <span>{originalFile?.name}</span> - <span>{originalFile ? formatFileSize(originalFile.size) : ''}</span>
      </span>
      <span className="base-viewer__label base-viewer__label--result">
        <span>{resultFile?.name}</span> - <span>{resultFile ? formatFileSize(resultFile.size) : ''}</span>
      </span>
    </div>
  );
}

export interface SplitViewProps {
  originalFile?: FileBaseModel;
  resultFile?: FileBaseModel;
  children: [React.ReactNode, React.ReactNode];
  className?: string;
}

export default function SplitView({ children, className, originalFile, resultFile }: SplitViewProps) {
  const [zoomFactor, setIsResizingSplitView] = useEditorStore(state => [
    state.zoomFactor,
    state.setIsResizingSplitView,
  ]);
  const handleResizeStart: ResizeStartCallback = () => {
    setIsResizingSplitView(true);
  };

  const handleResizeStop: ResizeCallback = () => {
    setIsResizingSplitView(false);
  };

  return (
    <div className={clsx('split-view', className)}>
      <Resizable
        className="split-view__item"
        enable={{ right: true }}
        defaultSize={{ width: '50%', height: '100%' }}
        minWidth="5%"
        maxWidth="95%"
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        resizeRatio={1 / zoomFactor}
        bounds="parent"
        handleComponent={{
          right: <SplitViewHandle originalFile={originalFile} resultFile={resultFile} />,
        }}
      >
        <div className="split-view__container">{children[0]}</div>
      </Resizable>
      <div className="split-view__item">
        <div className="split-view__container">{children[1]}</div>
      </div>
    </div>
  );
}
