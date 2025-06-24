import { CheckIcon, ChevronUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { FileType, TransformerExecuteResponse, TransformerSetting } from '@komplett/core';
import {
  FILE_TYPE_MAP,
  TRANSFORMER_DEFAULT_SETTINGS,
  TRANSFORMER_FEATURES,
  transformerHasSetting,
  type UUID,
} from '@komplett/core';

import { useExecuteTransformer, useUpdateTransformer } from '#state/mutations';
import { useTransformer } from '#state/queries';
import * as UI from '#ui';

import CropSettings from './crop-settings';
import FilterSettings from './filter-settings';
import OptimizeSettings from './optimize-settings';
import ResizeSettings from './resize-settings';

import './transformer-settings.scss';

export interface TransformerSettingsProps {
  id: UUID;
}

export default function TransformerSettings({ id }: TransformerSettingsProps) {
  const { data: transformer } = useTransformer(id);
  const executeTransformer = useExecuteTransformer();
  const updateTransformer = useUpdateTransformer();

  const [transformerProgress, setTransformerProgress] = useState(0);
  const [transformerProgressMessage, setTransformerProgressMessage] = useState('');

  const transformerProgressPercent = Math.min(
    100,
    Math.round((transformerProgress / (transformer?.originalFiles.length ?? 0)) * 100),
  );

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
      setTransformerProgress(completedFiles);
    }
    setTransformerProgressMessage(resp.message);
  };

  const handleExportButtonClick = () => {
    executeTransformer.mutate(
      { data: { id: transformer.id }, callback: handleTransformerUpdate },
      {
        onSuccess: () => {
          setTransformerProgress(transformer.originalFiles.length);
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
      if (feature === 'format') {
        updateTransformer.mutate({
          id: transformer.id,
          data: {
            settings: {
              ...transformer.settings,
              format: value as FileType,
            },
          },
        });
      } else {
        updateTransformer.mutate({
          id: transformer.id,
          data: {
            settings: {
              ...transformer.settings,
              [feature]: {
                ...transformer.settings[feature],
                [setting]: value,
              },
            },
          },
        });
      }
    }
  };

  const renderSettings = () => {
    // TODO: Remove the image check if video/audio etc. is supported.
    if (TRANSFORMER_FEATURES[transformer.kind].length === 0 || transformer.kind !== 'image') {
      return <div className="transformer-settings__no-features">No actions available for this file type.</div>;
    }

    return (
      <UI.FeatureToggle.Root type="multiple">
        <ResizeSettings
          busy={executeTransformer.isPending}
          transformer={transformer}
          onChange={handleTransformerSettingsChange}
          toggleFeature={handleToggleFeature}
        />
        <CropSettings
          busy={executeTransformer.isPending}
          transformer={transformer}
          onChange={handleTransformerSettingsChange}
          toggleFeature={handleToggleFeature}
        />
        <FilterSettings
          busy={executeTransformer.isPending}
          transformer={transformer}
          onChange={handleTransformerSettingsChange}
          toggleFeature={handleToggleFeature}
        />
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
            <UI.Progress.Indicator style={{ width: `${String(transformerProgressPercent)}%` }}>
              {!executeTransformer.isIdle
                ? `file ${String(transformerProgress)} / ${String(transformer.originalFiles.length)}`
                : null}
            </UI.Progress.Indicator>
          </UI.Progress.Root>
        </UI.Label.Root>
        <UI.Select.Root
          value={transformer.settings.format}
          onValueChange={v => {
            handleTransformerSettingsChange('format', 'format')(v as FileType);
          }}
        >
          <div className="transformer-settings__process-button-container">
            <UI.Button.Root
              className="transformer-settings__process-button"
              primary
              onClick={handleExportButtonClick}
              disabled={executeTransformer.isPending}
            >
              Process as {transformer.settings.format}
            </UI.Button.Root>
            <UI.Select.Trigger
              className="transformer-settings__file-select__trigger"
              disabled={executeTransformer.isPending}
            >
              <UI.Select.Icon>
                <ChevronUpIcon />
              </UI.Select.Icon>
            </UI.Select.Trigger>
          </div>

          <UI.Select.Portal>
            <UI.Select.Content
              position="popper"
              side="top"
              align="end"
              className="transformer-settings__file-select__content"
            >
              {FILE_TYPE_MAP[transformer.kind].map(fileType => (
                <UI.Select.Item key={fileType} value={fileType}>
                  <UI.Select.ItemText>{fileType}</UI.Select.ItemText>
                  {transformer.settings.format === fileType && (
                    <UI.Select.ItemIndicator>
                      <CheckIcon />
                    </UI.Select.ItemIndicator>
                  )}
                </UI.Select.Item>
              ))}
            </UI.Select.Content>
          </UI.Select.Portal>
        </UI.Select.Root>
      </div>
    </div>
  );
}
