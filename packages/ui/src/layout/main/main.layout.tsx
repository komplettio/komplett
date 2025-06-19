import type React from 'react';
import { Outlet } from 'react-router';

import { Header } from '#components/header/header';
import { ProjectList } from '#components/project/projects-list/ProjectList';
import { useProjectListStore } from '#state/stores';

import './main.layout.scss';

export const MainLayout: React.FC = () => {
  const [isProjectListOpen, setIsProjectListOpen] = useProjectListStore(s => [s.open, s.setOpen]);

  return (
    <>
      <div className="main-layout">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <ProjectList
        isOpen={isProjectListOpen}
        onClose={() => {
          setIsProjectListOpen(false);
        }}
      />
    </>
  );
};
