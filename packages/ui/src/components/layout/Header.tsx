import { FileText, FolderOpen, Plus } from 'lucide-react';
import React from 'react';

import { useProjectManager } from '../../contexts/ProjectManagerContext';

import './Header.scss';

export const Header: React.FC = () => {
  const { openProjectList } = useProjectManager();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <FileText className="logo-icon" />
          <h1 className="logo-text">
            komplett<span className="logo-secondary">.io</span>
          </h1>
        </div>
        <nav className="nav">
          <button className="nav-button" onClick={openProjectList}>
            <FolderOpen size={20} />
            Projects
          </button>
        </nav>
      </div>
    </header>
  );
};
