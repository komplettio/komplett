import { useMutationState } from '@tanstack/react-query';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import type { ProjectModel, UUID } from '@komplett/core';

import { FileDropZone } from '#components/file-manager/FileDropZone';
import TransformerSettings from '#components/transformer/transformer-settings';
import {
  useDeleteFiles,
  useDeleteProject,
  useGetFilesImperatively,
  useImportFile,
  useUpdateProject,
} from '#state/mutations';
import { useTransformer } from '#state/queries';
import * as UI from '#ui';
import { ConfirmationModal } from '#ui/ConfirmationModal';

import BaseViewer from './viewers/BaseViewer';

import './Project.scss';

interface ProjectProps {
  project: ProjectModel;
}

export const Project: React.FC<ProjectProps> = ({ project }) => {
  const navigate = useNavigate();

  const importFile = useImportFile();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const deleteFiles = useDeleteFiles();
  const getFiles = useGetFilesImperatively();

  const transformerExecuting = useMutationState({
    filters: { status: 'pending', mutationKey: ['transformers.execute'] },
    select: mutation => mutation.mutationId,
  });

  const { data: transformer } = useTransformer(project.transformer?.id ?? null);

  const [selectedFileId, setSelectedFileId] = useState<UUID | null>(project.files[0]?.id ?? null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const resultFile = transformer?.resultFiles.find(file => file.originalFileId === selectedFileId);

  const handleBack = () => {
    void navigate('/');
  };

  const handleDeleteProject = () => {
    deleteProject.mutate(project.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      const fileResponses = await Promise.all(files.map(file => importFile.mutateAsync({ file })));
      await updateProject.mutateAsync({
        id: project.id,
        data: {
          fileIds: [...project.fileIds, ...fileResponses.map(response => response.id)],
        },
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const handleFilesDelete = () => {
    deleteFiles.mutate(
      project.files.map(file => file.id),
      {
        onSuccess: () => {
          setSelectedFileId(null);
          updateProject.mutate({
            id: project.id,
            data: {
              fileIds: [],
            },
          });
        },
      },
    );
  };

  const handleFilesExport = () => {
    if (!project.transformer) return;

    getFiles.mutate(project.transformer.resultFileIds, {
      onSuccess: files => {
        const fileBlobs = files.map(file => file.blob);

        for (const file of fileBlobs) {
          const fileURL = URL.createObjectURL(file);

          const downloadLink = document.createElement('a');
          downloadLink.href = fileURL;
          downloadLink.download = file.name || 'unknown komplett file';
          document.body.appendChild(downloadLink);
          downloadLink.click();

          URL.revokeObjectURL(fileURL);
        }
      },
      onError: err => {
        console.error('Failed to export files:', err);
      },
    });
  };

  return (
    <div className="project">
      <div className="project-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
            Home
          </button>
          <div className="project-info">
            <h1 className="project-title">{project.name}</h1>
            {project.description && <p className="project-description">{project.description}</p>}
          </div>
        </div>

        <div className="header-actions">
          <UI.Button.Root
            className="action-button"
            error
            large
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 size={20} />
            Delete
          </UI.Button.Root>
        </div>
      </div>

      <div className="project-main">
        {project.files.length > 0 ? (
          <>
            {selectedFileId ? (
              <BaseViewer
                selectedFileId={selectedFileId}
                files={project.files}
                onFileSelect={setSelectedFileId}
                resultFileId={resultFile?.id ?? null}
                busy={transformerExecuting.length > 0}
                kind={project.kind}
              />
            ) : (
              <div className="project-main__file-preview-loading">
                <p>Preview not available</p>
                <span>did you process the file?</span>
              </div>
            )}
          </>
        ) : (
          <FileDropZone onFileUpload={handleFileUpload} />
        )}
      </div>

      <div className="editor-section">
        <div className="file-header">
          <h3 className="file-name">File actions:</h3>
          <div className="file-actions">
            {/* TODO */}
            <UI.Button.Root secondary large className="action-button" onClick={handleFilesExport}>
              <Download size={16} />
              Export
            </UI.Button.Root>
            <UI.Button.Root error large className="action-button danger" onClick={handleFilesDelete}>
              <Trash2 size={16} />
              Delete
            </UI.Button.Root>
          </div>
        </div>

        <div className="editor-content">
          {project.transformer?.id && <TransformerSettings id={project.transformer.id} />}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? All files and data associated with this project will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        projectName={project.name}
        isLoading={deleteProject.isPending}
      />
    </div>
  );
};
