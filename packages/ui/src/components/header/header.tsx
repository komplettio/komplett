import { useTheme } from '@janis.me/react-themed/js';
import { File, FileText, FolderOpen, Settings, Sun } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router';

import boltBadge from '#assets/bolt-badge.svg';
import { useProjectListStore } from '#state/stores';

import './header.scss';

export const Header: React.FC = () => {
  const [toggleProjectList] = useProjectListStore(s => [s.toggleOpen]);
  const { setTheme, theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-content">
        <a href="https://bolt.new" target="_blank" rel="noopener noreferrer" className="bolt-badge">
          <img src={boltBadge} alt="powered by bolt.new" />
        </a>
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
            <span>Projects</span>
          </button>
          <Link to="/settings">
            <button className="nav-button">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </Link>
          <Link to="/files">
            <button className="nav-button">
              <File size={20} />
              <span>Files</span>
            </button>
          </Link>
          <button
            className="nav-button"
            onClick={() => {
              setTheme(toggleTheme());
            }}
          >
            <Sun size={20} />
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
