import { ThemeProvider } from '@janis.me/react-themed/js';
import { QueryClientProvider } from '@tanstack/react-query';

import { ToastProvider } from '#components/ui/Toast';
import { queryClient } from '#state/queries/client';

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
