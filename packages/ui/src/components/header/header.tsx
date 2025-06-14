import { FileText, FolderOpen, Plus } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import './header.scss';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <FileText className="logo-icon" />
          <Link to="/">
            <h1 className="logo-text">
              komplett<span className="logo-secondary">.io</span>
            </h1>
          </Link>
        </div>
        <nav className="nav">
          <button className="nav-button">
            <FolderOpen size={20} />
            Projects
          </button>
        </nav>
      </div>
    </header>
  );
};
