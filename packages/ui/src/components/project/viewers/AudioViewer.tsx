import type { FileBaseModel } from '@komplett/core';

import type { ViewerProps } from './BaseViewer';
import SplitView from './SplitView';

export type AudioViewerProps = ViewerProps;

function AudioViewInput({ originalFile }: { originalFile: FileBaseModel }) {
  const audioUrl = URL.createObjectURL(originalFile.blob);

  return (
    <audio src={audioUrl} controls className="audio-controls">
      Your browser does not support the audio tag.
    </audio>
  );
}

function AudioViewSplit({ originalFile, resultFile }: { originalFile: FileBaseModel; resultFile: FileBaseModel }) {
  const originalUrl = URL.createObjectURL(originalFile.blob);
  const resultUrl = URL.createObjectURL(resultFile.blob);

  return (
    <SplitView originalFile={originalFile} resultFile={resultFile}>
      <audio src={originalUrl} controls className="audio-controls">
        Your browser does not support the audio tag.
      </audio>
      <audio src={resultUrl} controls className="audio-controls">
        Your browser does not support the audio tag.
      </audio>
    </SplitView>
  );
}

export default function AudioViewer({ originalFile, resultFile, mode }: AudioViewerProps) {
  if (!originalFile) {
    return <div className="base-viewer__loading">Loading...</div>;
  }

  return (
    <div className="audio-viewer">
      {mode === 'split' ? (
        <>
          {resultFile ? (
            <AudioViewSplit originalFile={originalFile} resultFile={resultFile} />
          ) : (
            <div className="base-viewer__loading">Loading result file...</div>
          )}
        </>
      ) : (
        <AudioViewInput originalFile={originalFile} />
      )}
    </div>
  );
}
