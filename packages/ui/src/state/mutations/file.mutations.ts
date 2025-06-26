import { useMutation } from '@tanstack/react-query';

import { emitter } from '@komplett/core';
import type { FileCreateEvent, FileCreateResponse, FileImportEvent, FileModel, UUID } from '@komplett/core';

import { queryClient } from '#state/queries/client.js';

export function useCreateFile() {
  return useMutation({
    mutationFn: async (data: FileCreateEvent) => {
      return new Promise<FileCreateResponse>((resolve, reject) => {
        emitter
          .await('files.create', data, resp => {
            resolve(resp);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}

export function useImportFile() {
  return useMutation({
    mutationFn: async (data: FileImportEvent) => {
      return new Promise<FileCreateResponse>((resolve, reject) => {
        emitter
          .await('files.import', data, resp => {
            resolve(resp);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}

export function useDeleteFiles() {
  return useMutation({
    mutationFn: async (fileIds: UUID[]) => {
      return new Promise<void>((resolve, reject) => {
        emitter
          .await('files.delete', { ids: fileIds }, () => {
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

export function useGetFilesImperatively() {
  return useMutation({
    mutationFn: async (ids: UUID[]) => {
      return new Promise<FileModel[]>((resolve, reject) => {
        emitter
          .await('files.list', null, res => {
            const resultFiles = res.filter(file => ids.includes(file.id));
            resolve(resultFiles);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}
