import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { TransformerModel, TransformerSetting } from '@komplett/core';
import { TRANSFORMER_DEFAULT_SETTINGS, transformerHasSetting } from '@komplett/core';

import { useDebounce } from '#hooks/useDebounce';
import * as UI from '#ui';

export interface ResizeSettingsProps {
  transformer: TransformerModel;
  busy: boolean;
  onChange: (feature: TransformerSetting, setting: string) => (value: unknown) => void;
  toggleFeature: (feature: TransformerSetting) => void;
}

export default function ResizeSettings({ transformer, busy, onChange, toggleFeature }: ResizeSettingsProps) {
  const [width, setWidth] = useState([transformer.settings.resize?.width ?? TRANSFORMER_DEFAULT_SETTINGS.resize.width]);
  const [height, setHeight] = useState([
    transformer.settings.resize?.height ?? TRANSFORMER_DEFAULT_SETTINGS.resize.height,
  ]);
  const debouncedWidth = useDebounce(width);
  const debouncedHeight = useDebounce(height);

  useEffect(() => {
    onChange('resize', 'width')(debouncedWidth[0]);
  }, [debouncedWidth]);

  useEffect(() => {
    onChange('resize', 'height')(debouncedHeight[0]);
  }, [debouncedHeight]);

  if (transformerHasSetting(transformer, 'resize')) {
    return (
      <UI.FeatureToggle.Item value="resize">
        <UI.FeatureToggle.Header>
          <UI.FeatureToggle.Trigger
            checked={!!transformer.settings.resize}
            onCheckedChange={() => {
              toggleFeature('resize');
            }}
          >
            Resize
          </UI.FeatureToggle.Trigger>
        </UI.FeatureToggle.Header>
        <UI.FeatureToggle.Content>
          <UI.Label.Root>
            <UI.Between.Root>
              <span>Width (%)</span>
              <span>{transformer.settings.resize?.width}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={width}
              onValueChange={setWidth}
              disabled={!transformer.settings.resize || busy}
              min={1}
              max={200}
              step={1}
            >
              <UI.Slider.Track>
                <UI.Slider.Range />
              </UI.Slider.Track>
              <UI.Slider.Thumb />
            </UI.Slider.Root>
          </UI.Label.Root>

          <UI.Label.Root>
            <UI.Between.Root>
              <span>Height (%)</span>
              <span>{transformer.settings.resize?.height}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={height}
              onValueChange={setHeight}
              disabled={!transformer.settings.resize || busy}
              min={1}
              max={200}
              step={1}
            >
              <UI.Slider.Track>
                <UI.Slider.Range />
              </UI.Slider.Track>
              <UI.Slider.Thumb />
            </UI.Slider.Root>
          </UI.Label.Root>

          <UI.Between.Root>
            <UI.Label.Root htmlFor="maintain-aspect-ratio-checkbox">Maintain aspect ratio</UI.Label.Root>
            <UI.Checkbox.Root
              id="maintain-aspect-ratio-checkbox"
              checked={transformer.settings.resize?.maintainAspectRatio ?? false}
              onCheckedChange={onChange('resize', 'maintainAspectRatio')}
              disabled={!transformer.settings.resize || busy}
            >
              <UI.Checkbox.Indicator>
                <CheckIcon size={16} />
              </UI.Checkbox.Indicator>
            </UI.Checkbox.Root>
          </UI.Between.Root>

          <UI.Between.Root>
            <UI.Label.Root>Method</UI.Label.Root>
            <UI.Select.Root
              value={transformer.settings.resize?.method ?? 'lanczos3'}
              onValueChange={onChange('resize', 'method')}
              disabled={!transformer.settings.resize || busy}
            >
              <UI.Select.Trigger>
                <UI.Select.Value placeholder="Resize method" />
                <UI.Select.Icon>
                  <ChevronDownIcon />
                </UI.Select.Icon>
              </UI.Select.Trigger>

              <UI.Select.Content position="popper">
                <UI.Select.Item value="lanczos3">
                  <UI.Select.ItemText>Lanczos3</UI.Select.ItemText>
                  <UI.Select.ItemIndicator>
                    <CheckIcon />
                  </UI.Select.ItemIndicator>
                </UI.Select.Item>
                <UI.Select.Item value="nearest-neighbor">
                  <UI.Select.ItemText>Nearest Neighbor</UI.Select.ItemText>
                  <UI.Select.ItemIndicator>
                    <CheckIcon />
                  </UI.Select.ItemIndicator>
                </UI.Select.Item>
                <UI.Select.Item value="triangle">
                  <UI.Select.ItemText>Triangle</UI.Select.ItemText>
                  <UI.Select.ItemIndicator>
                    <CheckIcon />
                  </UI.Select.ItemIndicator>
                </UI.Select.Item>
                <UI.Select.Item value="catmullrom">
                  <UI.Select.ItemText>Catmull-Rom</UI.Select.ItemText>
                  <UI.Select.ItemIndicator>
                    <CheckIcon />
                  </UI.Select.ItemIndicator>
                </UI.Select.Item>
                <UI.Select.Item value="gaussian">
                  <UI.Select.ItemText>Gaussian</UI.Select.ItemText>
                  <UI.Select.ItemIndicator>
                    <CheckIcon />
                  </UI.Select.ItemIndicator>
                </UI.Select.Item>
              </UI.Select.Content>
            </UI.Select.Root>
          </UI.Between.Root>
        </UI.FeatureToggle.Content>
      </UI.FeatureToggle.Item>
    );
  }

  return null;
}
