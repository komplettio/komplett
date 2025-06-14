import { useQuery } from '@tanstack/react-query';

import { emitter } from '@komplett/core/events';
import type { ProjectBaseModel, ProjectModel } from '@komplett/core/models';
import type { ListQueryOptions } from '@komplett/core/types';

import { useInvalidateOnEvent } from '#hooks/useInvalidateOnEvent';

export function useProjects(filters?: ListQueryOptions<ProjectBaseModel>) {
  useInvalidateOnEvent('project.pub', ['projects']);

  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      return await new Promise<ProjectModel[]>((resolve, reject) => {
        emitter
          .await('project.list', filters ?? null, data => {
            resolve(data.payload);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}
