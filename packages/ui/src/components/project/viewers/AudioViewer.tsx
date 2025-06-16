import { FileBaseModel } from '@komplett/core';

import { BaseViewerProps } from './BaseViewer';
import SplitView from './SplitView';

export type AudioViewerProps = BaseViewerProps;

function SimpleAudioView({ originalFile }: { originalFile: FileBaseModel }) {
  const audioUrl = URL.createObjectURL(originalFile.blob);

  return (
    <audio src={audioUrl} controls className="audio-controls">
      Your browser does not support the audio tag.
    </audio>
  );
}

function SplitAudioView({ originalFile, resultFile }: { originalFile: FileBaseModel; resultFile: FileBaseModel }) {
  const originalUrl = URL.createObjectURL(originalFile.blob);
  const resultUrl = URL.createObjectURL(resultFile.blob);

  return (
    <SplitView>
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
  return (
    <div className="audio-viewer">
      {mode === 'split' ? (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- In split mode, resultFile is checked to be defined in BaseViewer
        <SplitAudioView originalFile={originalFile} resultFile={resultFile!} />
      ) : (
        <SimpleAudioView originalFile={originalFile} />
      )}
    </div>
  );
}
