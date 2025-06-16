import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { useEditorStore } from '#state/stores';

import './ZoomableView.scss';

export interface ZoomableViewProps {
  zoomEnabled?: boolean | undefined;
  children?: React.ReactNode;
}

export default function ZoomableView({ children, zoomEnabled }: ZoomableViewProps) {
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
      onZoom={handleZoom}
    >
      <TransformComponent wrapperClass="zoomable-view">{children}</TransformComponent>
    </TransformWrapper>
  );
}
