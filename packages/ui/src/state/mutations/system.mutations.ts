import { useMutation } from '@tanstack/react-query';

import { emitter } from '@komplett/core';

export function useSystemReset() {
  return useMutation({
    mutationFn: async () => {
      return new Promise<void>((resolve, reject) => {
        emitter
          .await('system.reset', null, () => {
            resolve();
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}
