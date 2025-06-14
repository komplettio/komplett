import React from 'react';
import { Header } from './Header';
import { Project } from '../project/Project';
import { ProjectList } from '../project/ProjectList';
import { FileDropZone } from '../file-manager/FileDropZone';
import { useProjectManager } from '../../contexts/ProjectManagerContext';
import './MainLayout.scss';

export const MainLayout: React.FC = () => {
  const { 
    currentProject,
    currentFile,
    isLoading,
    isProjectListOpen,
    closeProjectList,
    uploadFile
  } = useProjectManager();

  const handleFileUpload = async (file: File) => {
    await uploadFile(file);
  };

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading...</p>
          </div>
        ) : currentProject ? (
          <Project project={currentProject} currentFile={currentFile || undefined} />
        ) : (
          <div className="upload-container">
            <FileDropZone onFileUpload={handleFileUpload} />
          </div>
        )}
      </main>
      
      <ProjectList
        isOpen={isProjectListOpen}
        onClose={closeProjectList}
      />
    </div>
  );
};