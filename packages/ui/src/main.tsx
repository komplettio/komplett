import { ThemeProvider } from '@janis.me/react-themed/js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ToastProvider } from './components/ui/Toast';
import { ProjectManagerProvider } from './contexts/ProjectManagerContext';
import Router from './router';

import './index.css';
import './styles/global.scss';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <ProjectManagerProvider>
          <Router />
        </ProjectManagerProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
