import clsx from 'clsx';
import { Resizable, ResizeCallback, ResizeStartCallback } from 're-resizable';

import { useEditorStore } from '#state/stores';

import './SplitView.scss';

export interface SplitViewProps {
  children: [React.ReactNode, React.ReactNode];
  className?: string;
}

export default function SplitView({ children, className }: SplitViewProps) {
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
        handleClasses={{ right: 'split-view__handle' }}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        resizeRatio={1 / zoomFactor}
        handleStyles={{
          right: {
            width: '6px',
            right: '-3px',
          },
        }}
      >
        {children[1]}
      </Resizable>
      <div className="split-view__item">{children[0]}</div>
    </div>
  );
}
