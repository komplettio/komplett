import { useMutation } from '@tanstack/react-query';

import type { ProjectCreateResponse, UUID } from '@komplett/core';
import { emitter, type ProjectCreateEvent, type ProjectUpdateEvent } from '@komplett/core';

import { queryClient } from '#state/queries/client.js';

export function useCreateProject() {
  return useMutation({
    mutationFn: async (data: ProjectCreateEvent) => {
      return new Promise<ProjectCreateResponse>((resolve, reject) => {
        emitter
          .await('projects.create', data, resp => {
            resolve(resp);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}

export function useUpdateProject() {
  return useMutation({
    mutationFn: async (data: ProjectUpdateEvent) => {
      return new Promise<void>((resolve, reject) => {
        emitter
          .await('projects.update', data, () => {
            resolve();
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: async (projectId: UUID) => {
      return new Promise<void>((resolve, reject) => {
        emitter
          .await('projects.delete', { id: projectId }, () => {
            resolve();
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
      void queryClient.invalidateQueries({ queryKey: ['transformers'] });
      void queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}
