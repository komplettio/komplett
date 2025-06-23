import { ArrowLeft, Download, Settings, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import type { FileBaseModel, ProjectModel, UUID } from '@komplett/core';

import { FileDropZone } from '#components/file-manager/FileDropZone';
import TransformerSettings from '#components/transformer/transformer-settings';
import { useImportFile, useUpdateProject } from '#state/mutations';
import { useTransformer } from '#state/queries';
import { ConfirmationModal } from '#ui/ConfirmationModal';

import BaseViewer from './viewers/BaseViewer';

import './Project.scss';

import ProjectControlBar from './project-control-bar/project-control-bar';

interface ProjectProps {
  project: ProjectModel;
}

export const Project: React.FC<ProjectProps> = ({ project }) => {
  const navigate = useNavigate();
  const importFile = useImportFile();
  const updateProject = useUpdateProject();
  const { data: transformer } = useTransformer(project.transformer?.id ?? null);

  const [selectedFileId, setSelectedFileId] = useState<UUID | null>(project.files[0]?.id ?? null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const resultFile = transformer?.resultFiles.find(file => file.originalFileId === selectedFileId);

  const handleBack = () => {
    void navigate('/');
  };

  const handleDeleteProject = () => {
    try {
      setIsDeleting(true);
      // await deleteProject(project.id);
      setIsDeleteModalOpen(false);
      // Navigation will be handled by the context
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
    }
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

  const handleDeleteFile = (_: FileBaseModel) => {
    // TODO: handle
    if (window.confirm('Are you sure you want to delete this file?')) {
      // await deleteFile(fileId);
    }
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
          <button className="action-button">
            <Settings size={20} />
            Settings
          </button>
          <button
            className="action-button danger"
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 size={20} />
            Delete
          </button>
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
        <ProjectControlBar files={project.files} selectedFileId={selectedFileId} onFileSelect={setSelectedFileId} />
      </div>

      <div className="editor-section">
        <div className="file-header">
          <h3 className="file-name">File actions:</h3>
          <div className="file-actions">
            {/* TODO */}
            <button className="action-button">
              <Download size={16} />
              Download
            </button>
            <button
              className="action-button danger"
              onClick={() => {
                if (project.files[0]) {
                  handleDeleteFile(project.files[0]);
                }
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
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
        isLoading={isDeleting}
      />
    </div>
  );
};
