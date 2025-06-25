import { useTheme } from '@janis.me/react-themed/js';
import { File, FileText, FolderOpen, Settings, Sun } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router';

import { useProjectListStore } from '#state/stores';

import './header.scss';

export const Header: React.FC = () => {
  const [toggleProjectList] = useProjectListStore(s => [s.toggleOpen]);
  const { setTheme, theme, toggleTheme } = useTheme();

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
          <button className="nav-button" onClick={toggleProjectList}>
            <FolderOpen size={20} />
            Projects
          </button>
          <Link to="/settings">
            <button className="nav-button">
              <Settings size={20} />
              Settings
            </button>
          </Link>
          <Link to="/files">
            <button className="nav-button">
              <File size={20} />
              Files
            </button>
          </Link>
          <button
            className="nav-button"
            onClick={() => {
              setTheme(toggleTheme());
            }}
          >
            <Sun size={20} />
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
      </div>
    </header>
  );
};
