import { ThemeProvider } from '@janis.me/react-themed/js';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '#state/queries/client';
import { ToastProvider } from '#ui/Toast';

import Router from './router';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
