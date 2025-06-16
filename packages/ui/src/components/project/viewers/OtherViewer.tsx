import { FileBaseModel } from '@komplett/core';

import { BaseViewerProps } from './BaseViewer';

export type OtherViewerProps = BaseViewerProps;

function SimpleOtherView({ originalFile }: { originalFile: FileBaseModel }) {
  return <pre>{JSON.stringify(originalFile, null, 4)}</pre>;
}

export default function OtherViewer({ originalFile }: OtherViewerProps) {
  return (
    <div className="audio-viewer">
      <SimpleOtherView originalFile={originalFile} />
    </div>
  );
}
