import { useMutation } from '@tanstack/react-query';

import type { TransformerExecuteEvent, TransformerExecuteResponse, TransformerUpdateEvent } from '@komplett/core';
import { emitter } from '@komplett/core';

export function useExecuteTransformer() {
  return useMutation({
    mutationKey: ['transformers.execute'],
    mutationFn: ({
      data,
      callback,
    }: {
      data: TransformerExecuteEvent;
      callback?: (update: TransformerExecuteResponse) => void;
    }): Promise<TransformerExecuteResponse[]> => {
      return emitter.await('transformers.execute', data, update => {
        callback?.(update);
      });
    },
  });
}

export function useUpdateTransformer() {
  return useMutation({
    mutationFn: async (data: TransformerUpdateEvent) => {
      return emitter.await('transformers.update', data);
    },
  });
}
