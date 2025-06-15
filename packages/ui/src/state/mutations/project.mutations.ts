import { useMutation } from '@tanstack/react-query';

import { emitter, ProjectCreateResponse, type ProjectCreateEvent, type ProjectUpdateEvent } from '@komplett/core';

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
