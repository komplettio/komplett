import { CheckIcon, ChevronDownIcon } from 'lucide-react';

import type { FileBaseModel, UUID } from '@komplett/core';

import * as UI from '#ui';

import './project-control-bar.scss';

export interface ProjectControlBarProps {
  files: FileBaseModel[];
  selectedFileId: UUID | null;
  onFileSelect: (fileId: UUID) => void;
}

export default function ProjectControlBar({ files, selectedFileId, onFileSelect }: ProjectControlBarProps) {
  return (
    <div className="project-control-bar">
      <div className="project-control-bar__right">
        {selectedFileId && (
          <UI.Select.Root value={selectedFileId} onValueChange={onFileSelect}>
            <UI.Label.Root className="project-control-bar__file-select">
              File:
              <UI.Select.Trigger className="project-control-bar__file-select__trigger">
                <UI.Select.Value placeholder="Select a file..." />
                <UI.Select.Icon>
                  <ChevronDownIcon />
                </UI.Select.Icon>
              </UI.Select.Trigger>
            </UI.Label.Root>

            <UI.Select.Portal>
              <UI.Select.Content position="popper" side="top" className="project-control-bar__file-select__content">
                {files.map(file => (
                  <UI.Select.Item key={file.id} value={file.id}>
                    <UI.Select.ItemText>{file.name}</UI.Select.ItemText>
                    {selectedFileId === file.id && (
                      <UI.Select.ItemIndicator>
                        <CheckIcon />
                      </UI.Select.ItemIndicator>
                    )}
                  </UI.Select.Item>
                ))}
              </UI.Select.Content>
            </UI.Select.Portal>
          </UI.Select.Root>
        )}
      </div>
    </div>
  );
}
