import { ArrowLeft, Download, Settings, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { greet } from '@komplett/codecs';
import { FileBaseModel, ProjectModel } from '@komplett/core';

import { FileDropZone } from '#components/file-manager/FileDropZone';
import { ConfirmationModal } from '#components/ui/ConfirmationModal';
import { useImportFile, useUpdateProject } from '#state/mutations';

import BaseViewer from './viewers/BaseViewer';

import './Project.scss';

interface ProjectProps {
  project: ProjectModel;
}

export const Project: React.FC<ProjectProps> = ({ project }) => {
  const navigate = useNavigate();
  const importFile = useImportFile();
  const updateProject = useUpdateProject();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleFileUpload = async (file: File) => {
    try {
      const fileResponse = await importFile.mutateAsync({ file });
      await updateProject.mutateAsync({
        id: project.id,
        data: {
          fileIds: [...project.fileIds, fileResponse.id],
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
    <div className="project-view">
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

      <div className="project-content">
        {project.files[0] ? (
          <div className="file-editor-layout">
            <div className="preview-section">
              <BaseViewer
                originalFile={project.files[0]}
                resultFile={project.files[0]}
                mode="split"
                kind={project.files[0].kind}
              />
            </div>

            <div className="editor-section">
              <div className="file-header">
                <h3 className="file-name">{project.files[0].name}</h3>
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
                <button
                  onClick={() => {
                    greet();
                  }}
                >
                  greet
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-project">
            <FileDropZone onFileUpload={handleFileUpload} />
          </div>
        )}
      </div>

      {project.files.length > 0 && (
        <div className="project-sidebar">
          <h4 className="sidebar-title">Project Files</h4>
          <div className="file-list">
            {project.files.map(file => (
              <div
                key={file.id}
                className={`file-item`}
                onClick={() => {
                  /* Handle file selection */
                }}
              >
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
