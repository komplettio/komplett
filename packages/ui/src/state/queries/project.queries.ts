import { useQuery } from '@tanstack/react-query';

import { emitter, ProjectListResponse } from '@komplett/core';
import type { ListQueryOptions, ProjectBaseModel, ProjectModel, UUID } from '@komplett/core';

import { useInvalidateOnEvent } from '#hooks/useInvalidateOnEvent';

export function useProjects(filters?: ListQueryOptions<ProjectBaseModel>) {
  useInvalidateOnEvent('projects.pub', ['projects']);

  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      return await new Promise<ProjectListResponse>((resolve, reject) => {
        emitter
          .await('projects.list', filters ?? null, data => {
            resolve(data);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}

export function useProject(id: UUID) {
  useInvalidateOnEvent('projects.pub', ['projects', id]);

  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      return await new Promise<ProjectModel>((resolve, reject) => {
        emitter
          .await('projects.get', { id }, data => {
            resolve(data);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}
