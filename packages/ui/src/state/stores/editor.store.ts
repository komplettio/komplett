import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import type { ViewerMode } from '#types';

interface EditorState {
  viewerMode: ViewerMode;
  zoomFactor: number;
  background: 'dark' | 'light' | 'pattern' | null;
  isResizingSplitView: boolean;
}

interface EditorActions {
  setViewerMode: (mode: ViewerMode) => void;
  setZoomFactor: (zoomFactor: number) => void;
  setBackground: (background: 'dark' | 'light' | 'pattern') => void;
  setIsResizingSplitView: (isResizing: boolean) => void;
}

export const useEditorStore = createWithEqualityFn<EditorState & EditorActions>()(
  immer(set => ({
    viewerMode: 'split',
    isResizingSplitView: false,
    zoomFactor: 1,
    background: null,
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
    setBackground(background: 'dark' | 'light' | 'pattern') {
      set(state => {
        state.background = background;
      });
    },
  })),
  shallow,
);
