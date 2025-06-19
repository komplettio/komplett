import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import type { ViewerMode } from '#types';

interface EditorState {
  viewerMode: ViewerMode;
  isResizingSplitView: boolean;
  zoomFactor: number;
}

interface EditorActions {
  setViewerMode: (mode: ViewerMode) => void;
  setIsResizingSplitView: (isResizing: boolean) => void;
  setZoomFactor: (zoomFactor: number) => void;
}

export const useEditorStore = createWithEqualityFn<EditorState & EditorActions>()(
  immer(set => ({
    viewerMode: 'simple' as ViewerMode,
    isResizingSplitView: false,
    zoomFactor: 1,
    setViewerMode(mode: ViewerMode) {
      set(state => {
        state.viewerMode = mode;
      });
    },
    setIsResizingSplitView(isResizing: boolean) {
      set(state => {
        state.isResizingSplitView = isResizing;
      });
    },
    setZoomFactor(zoomFactor: number) {
      set(state => {
        state.zoomFactor = zoomFactor;
      });
    },
  })),
  shallow,
);
