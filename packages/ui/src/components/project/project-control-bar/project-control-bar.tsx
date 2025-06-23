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
      <div className="project-control-bar__right"></div>
    </div>
  );
}
