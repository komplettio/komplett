import React from 'react';

import { Header } from '#components/header/header';

import './main.layout.scss';

import { Outlet } from 'react-router';

export const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
