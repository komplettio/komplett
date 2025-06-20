import type { TransformerExecuteResponse, TransformerSetting } from '@komplett/core';
import { TRANSFORMER_DEFAULT_SETTINGS, TRANSFORMER_FEATURES, transformerHasSetting, type UUID } from '@komplett/core';

import { useExecuteTransformer, useUpdateTransformer } from '#state/mutations';
import { useTransformer } from '#state/queries';
import * as UI from '#ui';

import OptimizeSettings from './optimize-settings';

import './transformer-settings.scss';

import { useEffect, useState } from 'react';

export interface TransformerSettingsProps {
  id: UUID;
}

export default function TransformerSettings({ id }: TransformerSettingsProps) {
  const { data: transformer } = useTransformer(id);
  const executeTransformer = useExecuteTransformer();
  const updateTransformer = useUpdateTransformer();

  const [transformerProgress, setTransformerProgress] = useState(0);
  const [transformerProgressMessage, setTransformerProgressMessage] = useState('');

  useEffect(() => {
    if (transformer?.resultFileIds.length === 0 && executeTransformer.isIdle) {
      executeTransformer.mutate({ data: { id: transformer.id }, callback: handleTransformerUpdate });
    }
  }, [transformer, executeTransformer]);

  if (!transformer) {
    return <div>Loading transformer settings...</div>;
  }

  const handleTransformerUpdate = (resp: TransformerExecuteResponse) => {
    if (resp.files) {
      const completedFiles = Object.values(resp.files).filter(status => status === 'completed').length;
      setTransformerProgress(Math.min(100, Math.round((completedFiles / transformer.originalFiles.length) * 100)));
    }
    setTransformerProgressMessage(resp.message);
  };

  const transformerHasAnySetting = Object.entries(transformer.settings).some(([_, value]) => value !== undefined);

  const handleExportButtonClick = () => {
    executeTransformer.mutate(
      { data: { id: transformer.id }, callback: handleTransformerUpdate },
      {
        onSuccess: () => {
          setTransformerProgress(100);
        },
      },
    );
  };

  const handleToggleFeature = (feature: TransformerSetting) => {
    if (transformerHasSetting(transformer, feature)) {
      const currentSetting = transformer.settings[feature];
      const newSetting = currentSetting ? undefined : TRANSFORMER_DEFAULT_SETTINGS[feature];

      updateTransformer.mutate({
        id: transformer.id,
        data: {
          settings: {
            ...transformer.settings,
            [feature]: newSetting,
          },
        },
      });
    }
  };

  const handleTransformerSettingsChange = (feature: TransformerSetting, setting: string) => (value: unknown) => {
    if (transformerHasSetting(transformer, feature)) {
      updateTransformer.mutate({
        id: transformer.id,
        data: {
          settings: {
            [feature]: {
              [setting]: value,
            },
          },
        },
      });
    }
  };

  const resizeSettings = () => {
    if (transformerHasSetting(transformer, 'resize')) {
      return (
        <UI.FeatureToggle.Item value="resize">
          <UI.FeatureToggle.Header>
            <UI.FeatureToggle.Trigger
              checked={!!transformer.settings.resize}
              onCheckedChange={() => {
                handleToggleFeature('resize');
              }}
            >
              Resize
            </UI.FeatureToggle.Trigger>
          </UI.FeatureToggle.Header>
          <UI.FeatureToggle.Content>asd</UI.FeatureToggle.Content>
        </UI.FeatureToggle.Item>
      );
    }

    return null;
  };

  const renderSettings = () => {
    // TODO: Remove the image check if video/audio etc. is supported.
    if (TRANSFORMER_FEATURES[transformer.kind].length === 0 || transformer.kind !== 'image') {
      return <div className="transformer-settings__no-features">No actions available for this file type.</div>;
    }

    return (
      <UI.FeatureToggle.Root type="multiple">
        {resizeSettings()}

        <OptimizeSettings
          busy={executeTransformer.isPending}
          transformer={transformer}
          onChange={handleTransformerSettingsChange}
          toggleFeature={handleToggleFeature}
        />
      </UI.FeatureToggle.Root>
    );
  };

  return (
    <div className="transformer-settings">
      {renderSettings()}

      <div className="transformer-settings__bottom">
        <UI.Label.Root className="transformer-settings__progress-label">
          <span>
            {transformerProgressMessage
              ? transformerProgressMessage
              : !executeTransformer.isPending
                ? 'No process running'
                : 'Unknown progress'}
          </span>
          <UI.Progress.Root primary>
            <UI.Progress.Indicator style={{ width: `${String(transformerProgress)}%` }} />
          </UI.Progress.Root>
        </UI.Label.Root>
        <UI.Button.Root
          className="transformer-settings__process-button"
          primary
          onClick={handleExportButtonClick}
          disabled={executeTransformer.isPending || !transformerHasAnySetting}
        >
          Process files
        </UI.Button.Root>
      </div>
    </div>
  );
}
