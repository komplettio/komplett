import { useEffect, useState } from 'react';

import type { TransformerModel, TransformerSetting } from '@komplett/core';
import { TRANSFORMER_DEFAULT_SETTINGS, transformerHasSetting } from '@komplett/core';

import { useDebounce } from '#hooks/useDebounce';
import * as UI from '#ui';

export interface CropSettingsProps {
  transformer: TransformerModel;
  busy: boolean;
  onChange: (feature: TransformerSetting, setting: string) => (value: unknown) => void;
  toggleFeature: (feature: TransformerSetting) => void;
}

export default function CropSettings({ transformer, busy, onChange, toggleFeature }: CropSettingsProps) {
  const [width, setWidth] = useState([transformer.settings.crop?.width ?? TRANSFORMER_DEFAULT_SETTINGS.crop.width]);
  const [height, setHeight] = useState([transformer.settings.crop?.height ?? TRANSFORMER_DEFAULT_SETTINGS.crop.height]);
  const [x, setX] = useState([transformer.settings.crop?.x ?? TRANSFORMER_DEFAULT_SETTINGS.crop.x]);
  const [y, setY] = useState([transformer.settings.crop?.y ?? TRANSFORMER_DEFAULT_SETTINGS.crop.y]);
  const debouncedWidth = useDebounce(width);
  const debouncedHeight = useDebounce(height);
  const debouncedX = useDebounce(x);
  const debouncedY = useDebounce(y);

  useEffect(() => {
    onChange('crop', 'width')(debouncedWidth[0]);
  }, [debouncedWidth]);

  useEffect(() => {
    onChange('crop', 'height')(debouncedHeight[0]);
  }, [debouncedHeight]);

  useEffect(() => {
    onChange('crop', 'x')(debouncedX[0]);
  }, [debouncedX]);

  useEffect(() => {
    onChange('crop', 'y')(debouncedY[0]);
  }, [debouncedY]);

  if (transformerHasSetting(transformer, 'crop')) {
    return (
      <UI.FeatureToggle.Item value="crop">
        <UI.FeatureToggle.Header>
          <UI.FeatureToggle.Trigger
            checked={!!transformer.settings.crop}
            onCheckedChange={() => {
              toggleFeature('crop');
            }}
          >
            Crop
          </UI.FeatureToggle.Trigger>
        </UI.FeatureToggle.Header>
        <UI.FeatureToggle.Content>
          <UI.Label.Root>
            <UI.Between.Root>
              <span>Width (%)</span>
              <span>{transformer.settings.crop?.width}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={width}
              onValueChange={setWidth}
              disabled={!transformer.settings.crop || busy}
              min={1}
              max={100}
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
              <span>{transformer.settings.crop?.height}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={height}
              onValueChange={setHeight}
              disabled={!transformer.settings.crop || busy}
              min={1}
              max={100}
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
              <span>X (%)</span>
              <span>{transformer.settings.crop?.x}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={x}
              onValueChange={setX}
              disabled={!transformer.settings.crop || busy}
              min={0}
              max={100}
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
              <span>Y (%)</span>
              <span>{transformer.settings.crop?.y}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={y}
              onValueChange={setY}
              disabled={!transformer.settings.crop || busy}
              min={0}
              max={100}
              step={1}
            >
              <UI.Slider.Track>
                <UI.Slider.Range />
              </UI.Slider.Track>
              <UI.Slider.Thumb />
            </UI.Slider.Root>
          </UI.Label.Root>
        </UI.FeatureToggle.Content>
      </UI.FeatureToggle.Item>
    );
  }

  return null;
}
