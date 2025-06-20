import { useQuery } from '@tanstack/react-query';

import { emitter } from '@komplett/core';
import type {
  ListQueryOptions,
  TransformerBaseModel,
  TransformerListResponse,
  TransformerModel,
  UUID,
} from '@komplett/core';

import { useInvalidateOnEvent } from '#hooks/useInvalidateOnEvent';

export function useTransformers(filters?: ListQueryOptions<TransformerBaseModel>) {
  useInvalidateOnEvent('transformers.pub', ['transformers']);

  return useQuery({
    queryKey: ['transformers', filters],
    queryFn: async () => {
      return await new Promise<TransformerListResponse>((resolve, reject) => {
        emitter
          .await('transformers.list', filters ?? null, data => {
            resolve(data);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}

export function useTransformer(id: UUID | null) {
  useInvalidateOnEvent('transformers.pub', ['transformers', id]);

  return useQuery({
    queryKey: ['transformers', id],
    enabled: id !== null,
    queryFn: async () => {
      if (id === null) {
        return;
      }

      return await new Promise<TransformerModel>((resolve, reject) => {
        emitter
          .await('transformers.get', { id }, data => {
            resolve(data);
          })
          .catch((err: unknown) => {
            reject(err as Error);
          });
      });
    },
  });
}
