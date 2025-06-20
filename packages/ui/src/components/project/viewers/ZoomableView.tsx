import clsx from 'clsx';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { useEditorStore } from '#state/stores';

import './ZoomableView.scss';

export interface ZoomableViewProps {
  zoomEnabled?: boolean | undefined;
  children?: React.ReactNode;
  className?: string;
}

export default function ZoomableView({ children, zoomEnabled, className }: ZoomableViewProps) {
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
    >
      <TransformComponent wrapperClass="zoomable-view">
        <div className={clsx('view', className)}>{children}</div>
      </TransformComponent>
    </TransformWrapper>
  );
}
