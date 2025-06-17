import { useMutation } from '@tanstack/react-query';

import type { TransformerExecuteEvent, TransformerExecuteResponse, TransformerUpdateEvent } from '@komplett/core';
import { emitter } from '@komplett/core';

export interface TransformerExecuteMutationResponse {
  done: Promise<TransformerExecuteResponse[]>;
  onUpdate: (callback: (update: TransformerExecuteResponse) => void) => void;
}

export function useExecuteTransformer() {
  return useMutation({
    mutationFn: (data: TransformerExecuteEvent): Promise<TransformerExecuteMutationResponse> => {
      let updateCallback: ((update: TransformerExecuteResponse) => void) | null = null;

      const eventPromise = emitter.await('transformers.execute', data, update => {
        if (updateCallback) {
          updateCallback(update);
        }
      });

      return Promise.resolve({
        done: eventPromise,
        onUpdate: (callback: (update: TransformerExecuteResponse) => void) => {
          updateCallback = callback;
        },
      });
    },
  });
}

export function useUpdateTransformer() {
  return useMutation({
    mutationFn: async (data: TransformerUpdateEvent) => {
      return new Promise<void>((resolve, reject) => {
        emitter
          .await('transformers.update', data, () => {
            resolve();
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}
