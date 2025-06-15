import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface ProjectListState {
  open: boolean;
}

interface ProjectListActions {
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

export const useProjectListStore = createWithEqualityFn<ProjectListState & ProjectListActions>()(
  immer(set => ({
    open: false,
    setOpen(open: boolean) {
      set(state => {
        state.open = open;
      });
    },
    toggleOpen() {
      set(state => {
        state.open = !state.open;
      });
    },
  })),
  shallow,
);
