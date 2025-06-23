import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { TransformerModel, TransformerSetting } from '@komplett/core';
import { TRANSFORMER_DEFAULT_SETTINGS, transformerHasSetting } from '@komplett/core';

import { useDebounce } from '#hooks/useDebounce';
import * as UI from '#ui';

export interface OptimizeSettingsProps {
  transformer: TransformerModel;
  busy: boolean;
  onChange: (feature: TransformerSetting, setting: string) => (value: unknown) => void;
  toggleFeature: (feature: TransformerSetting) => void;
}

export default function OptimizeSettings({ transformer, busy, onChange, toggleFeature }: OptimizeSettingsProps) {
  const [level, setLevel] = useState([
    transformer.settings.optimize?.level ?? TRANSFORMER_DEFAULT_SETTINGS.optimize.level,
  ]);
  const debouncedLevel = useDebounce(level);

  useEffect(() => {
    onChange('optimize', 'level')(debouncedLevel[0]);
  }, [debouncedLevel]);

  if (transformerHasSetting(transformer, 'optimize')) {
    return (
      <UI.FeatureToggle.Item value="optimize">
        <UI.FeatureToggle.Header>
          <UI.FeatureToggle.Trigger
            checked={!!transformer.settings.optimize}
            onCheckedChange={() => {
              toggleFeature('optimize');
            }}
          >
            Optimize
          </UI.FeatureToggle.Trigger>
        </UI.FeatureToggle.Header>
        <UI.FeatureToggle.Content>
          <UI.Label.Root>
            <UI.Between.Root>
              <span>Level</span>
              <span>{level}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={level}
              onValueChange={setLevel}
              disabled={!transformer.settings.optimize || busy}
              min={0}
              max={10}
              step={1}
            >
              <UI.Slider.Track>
                <UI.Slider.Range />
              </UI.Slider.Track>
              <UI.Slider.Thumb />
            </UI.Slider.Root>
          </UI.Label.Root>

          <UI.Between.Root>
            <UI.Label.Root htmlFor="optimize-alpha-checkbox">Optimize alpha</UI.Label.Root>
            <UI.Checkbox.Root
              id="optimize-alpha-checkbox"
              checked={transformer.settings.optimize?.optimizeAlpha ?? false}
              onCheckedChange={onChange('optimize', 'optimizeAlpha')}
              disabled={!transformer.settings.optimize || busy}
            >
              <UI.Checkbox.Indicator>
                <CheckIcon size={16} />
              </UI.Checkbox.Indicator>
            </UI.Checkbox.Root>{' '}
          </UI.Between.Root>
        </UI.FeatureToggle.Content>
      </UI.FeatureToggle.Item>
    );
  }

  return null;
}
