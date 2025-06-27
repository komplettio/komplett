import clsx from 'clsx';
import type { ResizeCallback, ResizeStartCallback } from 're-resizable';
import { Resizable } from 're-resizable';
import { useRef, useState } from 'react';
import { KeepScale } from 'react-zoom-pan-pinch';

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
      <KeepScale>
        <span className="base-viewer__label base-viewer__label--input">
          <span>{originalFile?.name}</span> - <span>{originalFile ? formatFileSize(originalFile.size) : ''}</span>
        </span>
      </KeepScale>
      <KeepScale>
        <span className="base-viewer__label base-viewer__label--result">
          <span>{resultFile?.name}</span> - <span>{resultFile ? formatFileSize(resultFile.size) : ''}</span>
        </span>
      </KeepScale>
    </div>
  );
}

export interface SplitViewProps {
  originalFile: FileBaseModel;
  resultFile: FileBaseModel | undefined;
  children: [React.ReactNode, React.ReactNode];
  className?: string;
}

export default function SplitView({ children, className, originalFile, resultFile }: SplitViewProps) {
  const splitViewRef = useRef<HTMLDivElement>(null);
  const [rightWidth, setRightWidth] = useState<number>(50);
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

  // Needed to calculate the width of the right pane based on the left pane's width
  // The right element should never be 'below' the left one, as the left may have transparency
  // Also, the left element cannot have a background, because the background pattern of the main container
  // should match
  const handleResize: ResizeCallback = (_, __, ref) => {
    const parentWidth = splitViewRef.current?.clientWidth ?? 0;
    const leftWidthPercentage = (ref.clientWidth / parentWidth) * 100;
    setRightWidth(100 - leftWidthPercentage);
  };

  return (
    <div className={clsx('split-view', className)} ref={splitViewRef}>
      <Resizable
        className="split-view__item"
        enable={{ right: true }}
        defaultSize={{ width: '50%', height: '100%' }}
        minWidth="5%"
        maxWidth="95%"
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        onResize={handleResize}
        resizeRatio={1 / zoomFactor}
        bounds="parent"
        handleStyles={{
          right: {
            width: 5,
          },
        }}
        handleComponent={{
          right: <SplitViewHandle originalFile={originalFile} resultFile={resultFile} />,
        }}
      >
        <div className="split-view__container">{children[0]}</div>
      </Resizable>
      <div className="split-view__item" style={{ width: `${String(rightWidth)}%` }}>
        <div className="split-view__container">{children[1]}</div>
      </div>
    </div>
  );
}
