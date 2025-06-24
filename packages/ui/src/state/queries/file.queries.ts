import { useQuery } from '@tanstack/react-query';

import { emitter } from '@komplett/core';
import type { FileBaseModel, FileListResponse, FileModel, ListQueryOptions, UUID } from '@komplett/core';

import { useInvalidateOnEvent } from '#hooks/useInvalidateOnEvent';

export function useFiles(filters?: ListQueryOptions<FileBaseModel>) {
  useInvalidateOnEvent('files.pub', ['files']);

  return useQuery({
    queryKey: ['files', filters],
    queryFn: async () => {
      return await new Promise<FileListResponse>((resolve, reject) => {
        emitter
          .await('files.list', filters ?? null, data => {
            resolve(data);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}

export function useFile(id: UUID | null) {
  useInvalidateOnEvent('files.pub', ['files', id]);

  return useQuery({
    queryKey: ['files', id],
    enabled: !!id,
    placeholderData: prev => prev,
    queryFn: async () => {
      if (!id) return;

      return await new Promise<FileModel>((resolve, reject) => {
        emitter
          .await('files.get', { id }, data => {
            resolve(data);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}
