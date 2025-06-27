import type { FileBaseModel } from '@komplett/core';

import type { ViewerMode } from '#types';

import CollageView from './collage/CollageView';
import InputView from './input/InputView';
import OutputView from './output/OutputView';
import SplitView from './split/SplitView';

export interface RendererProps {
  file: FileBaseModel | undefined;
}

export interface ViewProps {
  originalFile: FileBaseModel;
  resultFile: FileBaseModel | undefined;
  mode: ViewerMode;
  renderer: React.ComponentType<RendererProps>;
}

export default function View({ originalFile, resultFile, mode, renderer: Rendered }: ViewProps) {
  switch (mode) {
    case 'input':
      return (
        <InputView file={originalFile}>
          <Rendered file={originalFile} />
        </InputView>
      );
    case 'output':
      return (
        <OutputView file={resultFile}>
          <Rendered file={resultFile} />
        </OutputView>
      );
    case 'collage':
      return (
        <CollageView originalFile={originalFile} resultFile={resultFile}>
          <Rendered file={originalFile} />
          <Rendered file={resultFile} />
        </CollageView>
      );
    case 'split':
      return (
        <SplitView originalFile={originalFile} resultFile={resultFile}>
          <Rendered file={originalFile} />
          <Rendered file={resultFile} />
        </SplitView>
      );
    default:
      return <div className="base-viewer__error">Unsupported viewer mode: {mode}</div>;
  }
}
