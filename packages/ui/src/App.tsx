import React from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ProjectManagerProvider } from './contexts/ProjectManagerContext';
import { ToastProvider } from './components/ui/Toast';
import './styles/global.scss';

function App() {
  return (
    <ToastProvider>
      <ProjectManagerProvider>
        <div className="app">
          <MainLayout />
        </div>
      </ProjectManagerProvider>
    </ToastProvider>
  );
}

export default App;