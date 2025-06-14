import React from 'react';

import { Header } from '#components/header/header';
import { ProjectList } from '#components/project/project-list';
import { useProjectManager } from '#contexts/ProjectManagerContext';

import './main.layout.scss';

import { Outlet } from 'react-router';

export const MainLayout: React.FC = () => {
  const { isProjectListOpen, closeProjectList } = useProjectManager();

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>

      <ProjectList isOpen={isProjectListOpen} onClose={closeProjectList} />
    </div>
  );
};
