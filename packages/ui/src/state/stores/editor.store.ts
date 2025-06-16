import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface EditorState {
  isResizingSplitView: boolean;
  zoomFactor: number;
}

interface EditorActions {
  setIsResizingSplitView: (isResizing: boolean) => void;
  setZoomFactor: (zoomFactor: number) => void;
}

export const useEditorStore = createWithEqualityFn<EditorState & EditorActions>()(
  immer(set => ({
    isResizingSplitView: false,
    zoomFactor: 1,
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
