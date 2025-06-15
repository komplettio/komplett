import { useQuery } from '@tanstack/react-query';

import { emitter, ProjectListResponse } from '@komplett/core';
import type { ListQueryOptions, ProjectBaseModel } from '@komplett/core';

import { useInvalidateOnEvent } from '#hooks/useInvalidateOnEvent';

export function useProjects(filters?: ListQueryOptions<ProjectBaseModel>) {
  useInvalidateOnEvent('projects.pub', ['projects']);

  return useQuery({
    queryKey: ['projects'],
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
