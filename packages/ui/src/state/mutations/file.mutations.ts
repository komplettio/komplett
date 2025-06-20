import { useMutation } from '@tanstack/react-query';

import { emitter, type FileCreateEvent, type FileCreateResponse, type FileImportEvent } from '@komplett/core';

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
