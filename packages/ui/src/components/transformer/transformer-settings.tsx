import type { TransformerSetting } from '@komplett/core';
import { TRANSFORMER_DEFAULT_SETTINGS, TRANSFORMER_FEATURES, transformerHasSetting, type UUID } from '@komplett/core';

import { useExecuteTransformer, useUpdateTransformer } from '#state/mutations';
import { useTransformer } from '#state/queries';
import * as UI from '#ui';

import OptimizeSettings from './optimize-settings';

import './transformer-settings.scss';

export interface TransformerSettingsProps {
  id: UUID;
}

export default function TransformerSettings({ id }: TransformerSettingsProps) {
  const { data: transformer } = useTransformer(id);
  const executeTransformer = useExecuteTransformer();
  const updateTransformer = useUpdateTransformer();

  if (!transformer) {
    return <div>Loading transformer settings...</div>;
  }

  const transformerHasAnySetting = Object.entries(transformer.settings).some(([_, value]) => value !== undefined);

  const handleExportButtonClick = () => {
    executeTransformer.mutate({ data: { id: transformer.id } });
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
        <UI.Button.Root
          primary
          onClick={handleExportButtonClick}
          disabled={executeTransformer.isPending || !transformerHasAnySetting}
        >
          Export
        </UI.Button.Root>
      </div>
    </div>
  );
}
