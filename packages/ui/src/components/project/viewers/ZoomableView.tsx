import clsx from 'clsx';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { useEditorStore } from '#state/stores';

import './ZoomableView.scss';

export interface ZoomableViewProps {
  children?: React.ReactNode;
  className?: string;
  contentWidth?: number;
  contentHeight?: number;
  zoomEnabled?: boolean;
}

export default function ZoomableView({
  children,
  className,
  contentWidth,
  contentHeight,
  zoomEnabled = true,
}: ZoomableViewProps) {
  const [isResizingSplitView, setZoomFactor] = useEditorStore(state => [
    state.isResizingSplitView,
    state.setZoomFactor,
  ]);

  const handleZoom = (ref: ReactZoomPanPinchRef) => {
    setZoomFactor(ref.state.scale);
  };

  return (
    <TransformWrapper
      limitToBounds={false}
      centerOnInit={true}
      disabled={!zoomEnabled || isResizingSplitView}
      panning={{
        allowRightClickPan: false,
      }}
      maxScale={20}
      minScale={0.1}
      onZoom={handleZoom}
      velocityAnimation={{
        disabled: true,
      }}
      onInit={ref => {
        // Set initial zoom factor based on the current state
        setZoomFactor(ref.state.scale);
      }}
    >
      <TransformComponent
        wrapperClass="zoomable-view"
        contentStyle={{
          width: contentWidth ? `${String(contentWidth)}px` : undefined,
          height: contentHeight ? `${String(contentHeight)}px` : undefined,
        }}
      >
        <div className={clsx('view', className)}>{children}</div>
      </TransformComponent>
    </TransformWrapper>
  );
}
