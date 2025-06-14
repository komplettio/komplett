import React, { useState } from 'react';
import { ArrowLeft, Settings, Download, Share2, Trash2 } from 'lucide-react';
import { Project as ProjectType, ProjectFile } from '../../types/project';
import { useProjectManager } from '../../contexts/ProjectManagerContext';
import { ImageEditor } from '../editors/ImageEditor';
import { VideoEditor } from '../editors/VideoEditor';
import { AudioEditor } from '../editors/AudioEditor';
import { FileDropZone } from '../file-manager/FileDropZone';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import './Project.scss';

interface ProjectProps {
  project: ProjectType;
  currentFile?: ProjectFile;
}

export const Project: React.FC<ProjectProps> = ({ project, currentFile }) => {
  const { 
    clearCurrentProject, 
    deleteProject, 
    uploadFile,
    downloadFile,
    deleteFile 
  } = useProjectManager();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBack = () => {
    clearCurrentProject();
  };

  const handleDeleteProject = async () => {
    try {
      setIsDeleting(true);
      await deleteProject(project.id);
      setIsDeleteModalOpen(false);
      // Navigation will be handled by the context
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    await uploadFile(file);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      await deleteFile(fileId);
    }
  };

  const renderFilePreview = () => {
    if (!currentFile) return null;

    if (currentFile.mimeType && currentFile.mimeType.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(currentFile.blob);
      return (
        <div className="file-preview">
          <img src={imageUrl} alt={currentFile.name} className="preview-image" />
        </div>
      );
    }

    if (currentFile.mimeType && currentFile.mimeType.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(currentFile.blob);
      return (
        <div className="file-preview">
          <video 
            src={videoUrl} 
            controls 
            className="preview-video"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (currentFile.mimeType && currentFile.mimeType.startsWith('audio/')) {
      const audioUrl = URL.createObjectURL(currentFile.blob);
      return (
        <div className="file-preview">
          <div className="audio-waveform">
            <div className="waveform-placeholder">
              <div className="waveform-bars">
                {Array.from({ length: 50 }, (_, i) => (
                  <div 
                    key={i} 
                    className="waveform-bar" 
                    style={{ 
                      height: `${Math.random() * 100}%`,
                      '--i': i
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>
            <audio 
              src={audioUrl} 
              controls 
              className="audio-controls"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      );
    }

    return (
      <div className="file-preview">
        <div className="file-placeholder">
          <p>File preview not available</p>
        </div>
      </div>
    );
  };

  const renderFileEditor = () => {
    if (!currentFile) return null;

    if (currentFile.mimeType && currentFile.mimeType.startsWith('image/')) {
      return <ImageEditor file={currentFile} />;
    }
    if (currentFile.mimeType && currentFile.mimeType.startsWith('video/')) {
      return <VideoEditor file={currentFile} />;
    }
    if (currentFile.mimeType && currentFile.mimeType.startsWith('audio/')) {
      return <AudioEditor file={currentFile} />;
    }
    return null;
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
            {project.description && (
              <p className="project-description">{project.description}</p>
            )}
          </div>
        </div>
        
        <div className="header-actions">
          <button className="action-button">
            <Settings size={20} />
            Settings
          </button>
          <button 
            className="action-button danger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 size={20} />
            Delete
          </button>
        </div>
      </div>

      <div className="project-content">
        {currentFile ? (
          <div className="file-editor-layout">
            <div className="preview-section">
              {renderFilePreview()}
            </div>
            
            <div className="editor-section">
              <div className="file-header">
                <h3 className="file-name">{currentFile.name}</h3>
                <div className="file-actions">
                  <button 
                    className="action-button"
                    onClick={() => downloadFile(currentFile)}
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button 
                    className="action-button danger"
                    onClick={() => handleDeleteFile(currentFile.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="editor-content">
                {renderFileEditor()}
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
                className={`file-item ${currentFile?.id === file.id ? 'active' : ''}`}
                onClick={() => {/* Handle file selection */}}
              >
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
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