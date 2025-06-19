import { File } from 'lucide-react';

import type { UUID } from '@komplett/core';

import { useProject } from '#state/queries';
import { formatFileSize } from '#utils/formatters';

import './project-file-list.scss';

import clsx from 'clsx';

export interface ProjectFileListProps {
  projectId: UUID;
  selectedFile?: UUID | null;
  onFileSelect?: (fileId: UUID) => void;
}

export default function ProjectFileList({ projectId, selectedFile, onFileSelect }: ProjectFileListProps) {
  const { data: project } = useProject(projectId);

  if (!project) {
    return <div className="project-file-list">Loading...</div>;
  }

  return (
    <div className="project-file-list">
      {project.files.map(file => (
        <div
          key={file.id}
          className={clsx('project-file-list__item', {
            'project-file-list__item--selected': selectedFile === file.id,
          })}
          title={file.name}
          onClick={() => onFileSelect?.(file.id)}
        >
          <span className="project-file-list__icon">
            <File size={40} />
          </span>
          <span className="project-file-list__name">{file.name}</span>
          <span className="project-file-list__size">{formatFileSize(file.size)}</span>
        </div>
      ))}
    </div>
  );
}
