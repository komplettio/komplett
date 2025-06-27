import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import type { ReactZoomPanPinchContentRef, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { getCenterPosition, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

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
  const transformRef = useRef<ReactZoomPanPinchContentRef>(null);

  const [isResizingSplitView, zoomFactor, setZoomFactor] = useEditorStore(state => [
    state.isResizingSplitView,
    state.zoomFactor,
    state.setZoomFactor,
  ]);

  useEffect(() => {
    if (!transformRef.current) return;

    const currentScale = transformRef.current.instance.transformState.scale;

    if (currentScale === zoomFactor) return;

    const currentPositionX = transformRef.current.instance.transformState.positionX;
    const currentPositionY = transformRef.current.instance.transformState.positionY;

    if (transformRef.current.instance.wrapperComponent && transformRef.current.instance.contentComponent) {
      const centerPosition = getCenterPosition(
        zoomFactor,
        transformRef.current.instance.wrapperComponent,
        transformRef.current.instance.contentComponent,
      );

      transformRef.current.setTransform(centerPosition.positionX, centerPosition.positionY, zoomFactor);
    } else {
      transformRef.current.setTransform(currentPositionX, currentPositionY, zoomFactor);
    }
  }, [zoomFactor, isResizingSplitView]);

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
      ref={transformRef}
      initialScale={zoomFactor}
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
