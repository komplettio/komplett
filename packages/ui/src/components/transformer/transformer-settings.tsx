import type { UUID } from '@komplett/core';

import { useExecuteTransformer, useUpdateTransformer } from '#state/mutations';
import { useTransformer } from '#state/queries';

export interface TransformerSettingsProps {
  id: UUID;
}

export default function TransformerSettings({ id }: TransformerSettingsProps) {
  const { data: transformer } = useTransformer(id);
  const executeTransformer = useExecuteTransformer();
  const updateTransformer = useUpdateTransformer();

  const handleExportButtonClick = () => {
    if (transformer?.id) {
      executeTransformer.mutateAsync({ id: transformer.id }).catch((error: unknown) => {
        console.error('Failed to execute transformer:', error);
      });
    }
  };

  const toggleOptimize = () => {
    if (transformer) {
      updateTransformer.mutate({
        id: transformer.id,
        data: {
          settings: {
            kind: transformer.settings.kind,
            optimize: {
              optimizeAlpha: true,
              interlace: false,
              level: 5,
            },
          },
        },
      });
    }
  };

  if (!transformer) {
    return <div>Loading transformer settings...</div>;
  }

  return (
    <div className="transformer-settings">
      <div className="optimize-settings">
        <h3>Optimize</h3>
        <button onClick={toggleOptimize}>Toggle</button>
      </div>
      <button onClick={handleExportButtonClick}>Export</button>
    </div>
  );
}
