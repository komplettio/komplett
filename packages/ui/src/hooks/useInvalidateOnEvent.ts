import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { emitter, type Events } from '@komplett/core';

/**
 * Invalidate queries on a specific game event.
 * @param event The event to listen for.
 * @param queryKey The query key to invalidate.
 */
export function useInvalidateOnEvent(event: keyof Events, queryKey: QueryKey) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleGameStateUpdate = async () => {
      await queryClient.invalidateQueries({
        queryKey,
      });
    };

    emitter.on(event, handleGameStateUpdate);

    return () => {
      emitter.off(event, handleGameStateUpdate);
    };
  }, [queryClient, event, queryKey]);
}
