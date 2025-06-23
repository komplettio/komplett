import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { TransformerModel, TransformerSetting } from '@komplett/core';
import { TRANSFORMER_DEFAULT_SETTINGS, transformerHasSetting } from '@komplett/core';

import { useDebounce } from '#hooks/useDebounce';
import * as UI from '#ui';

export interface FilterSettingsProps {
  transformer: TransformerModel;
  busy: boolean;
  onChange: (feature: TransformerSetting, setting: string) => (value: unknown) => void;
  toggleFeature: (feature: TransformerSetting) => void;
}

export default function FilterSettings({ transformer, busy, onChange, toggleFeature }: FilterSettingsProps) {
  const [blurSigma, setBlurSigma] = useState([
    transformer.settings.filter?.blur?.sigma ?? TRANSFORMER_DEFAULT_SETTINGS.filter.blur.sigma,
  ]);
  const [brightenAmount, setBrightenAmount] = useState([
    transformer.settings.filter?.brighten?.amount ?? TRANSFORMER_DEFAULT_SETTINGS.filter.brighten.amount,
  ]);
  const [contrastAmount, setContrastAmount] = useState([
    transformer.settings.filter?.contrast?.amount ?? TRANSFORMER_DEFAULT_SETTINGS.filter.contrast.amount,
  ]);
  const [unsharpenSigma, setUnsharpenSigma] = useState([
    transformer.settings.filter?.unsharpen?.sigma ?? TRANSFORMER_DEFAULT_SETTINGS.filter.unsharpen.sigma,
  ]);
  const [unsharpenThreshold, setUnsharpenThreshold] = useState([
    transformer.settings.filter?.unsharpen?.threshold ?? TRANSFORMER_DEFAULT_SETTINGS.filter.unsharpen.threshold,
  ]);

  const debouncedBlurSigma = useDebounce(blurSigma);
  const debouncedBrightenAmount = useDebounce(brightenAmount);
  const debouncedContrastAmount = useDebounce(contrastAmount);
  const debouncedUnsharpenSigma = useDebounce(unsharpenSigma);
  const debouncedUnsharpenThreshold = useDebounce(unsharpenThreshold);

  useEffect(() => {
    onChange('filter', 'blur')({ sigma: debouncedBlurSigma[0] });
  }, [debouncedBlurSigma]);
  useEffect(() => {
    onChange('filter', 'brighten')({ amount: debouncedBrightenAmount[0] });
  }, [debouncedBrightenAmount]);
  useEffect(() => {
    onChange('filter', 'contrast')({ amount: debouncedContrastAmount[0] });
  }, [debouncedContrastAmount]);
  useEffect(() => {
    onChange('filter', 'unsharpen')({ sigma: debouncedUnsharpenSigma[0], threshold: debouncedUnsharpenThreshold[0] });
  }, [debouncedUnsharpenSigma, debouncedUnsharpenThreshold]);

  if (transformerHasSetting(transformer, 'filter')) {
    return (
      <UI.FeatureToggle.Item value="filter">
        <UI.FeatureToggle.Header>
          <UI.FeatureToggle.Trigger
            checked={!!transformer.settings.filter}
            onCheckedChange={() => {
              toggleFeature('filter');
            }}
          >
            Filter
          </UI.FeatureToggle.Trigger>
        </UI.FeatureToggle.Header>
        <UI.FeatureToggle.Content>
          <UI.Between.Root>
            <UI.Label.Root htmlFor="filter-grayscale">Grayscale</UI.Label.Root>
            <UI.Checkbox.Root
              id="filter-grayscale"
              checked={transformer.settings.filter?.grayscale ?? false}
              onCheckedChange={onChange('filter', 'grayscale')}
              disabled={!transformer.settings.filter || busy}
            >
              <UI.Checkbox.Indicator>
                <CheckIcon size={16} />
              </UI.Checkbox.Indicator>
            </UI.Checkbox.Root>
          </UI.Between.Root>
          <UI.Between.Root>
            <UI.Label.Root htmlFor="filter-invert">Invert</UI.Label.Root>
            <UI.Checkbox.Root
              id="filter-invert"
              checked={transformer.settings.filter?.invert ?? false}
              onCheckedChange={onChange('filter', 'invert')}
              disabled={!transformer.settings.filter || busy}
            >
              <UI.Checkbox.Indicator>
                <CheckIcon size={16} />
              </UI.Checkbox.Indicator>
            </UI.Checkbox.Root>
          </UI.Between.Root>
          <UI.Label.Root>
            <UI.Between.Root>
              <span>Blur</span>
              <span>{blurSigma}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={blurSigma}
              onValueChange={setBlurSigma}
              disabled={!transformer.settings.filter || busy}
              min={0}
              max={10}
              step={0.1}
            >
              <UI.Slider.Track>
                <UI.Slider.Range />
              </UI.Slider.Track>
              <UI.Slider.Thumb />
            </UI.Slider.Root>
          </UI.Label.Root>
          <hr />
          <UI.Label.Root>
            <UI.Between.Root>
              <span>Brighten</span>
              <span>{brightenAmount}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={brightenAmount}
              onValueChange={setBrightenAmount}
              disabled={!transformer.settings.filter || busy}
              min={-50}
              max={50}
              step={0.1}
            >
              <UI.Slider.Track>
                <UI.Slider.Range />
              </UI.Slider.Track>
              <UI.Slider.Thumb />
            </UI.Slider.Root>
          </UI.Label.Root>
          <UI.Label.Root>
            <UI.Between.Root>
              <span>Contrast</span>
              <span>{contrastAmount}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={contrastAmount}
              onValueChange={setContrastAmount}
              disabled={!transformer.settings.filter || busy}
              min={-50}
              max={50}
              step={0.1}
            >
              <UI.Slider.Track>
                <UI.Slider.Range />
              </UI.Slider.Track>
              <UI.Slider.Thumb />
            </UI.Slider.Root>
          </UI.Label.Root>

          <hr />

          <UI.Label.Root>
            <UI.Between.Root>
              <span>Unsharpen (amount)</span>
              <span>{unsharpenSigma}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={unsharpenSigma}
              onValueChange={setUnsharpenSigma}
              disabled={!transformer.settings.filter || busy}
              min={0}
              max={10}
              step={0.1}
            >
              <UI.Slider.Track>
                <UI.Slider.Range />
              </UI.Slider.Track>
              <UI.Slider.Thumb />
            </UI.Slider.Root>
          </UI.Label.Root>
          <UI.Label.Root>
            <UI.Between.Root>
              <span>Unsharpen (threshold)</span>
              <span>{unsharpenThreshold}</span>
            </UI.Between.Root>
            <UI.Slider.Root
              value={unsharpenThreshold}
              onValueChange={setUnsharpenThreshold}
              disabled={!transformer.settings.filter || busy}
              min={0}
              max={10}
              step={0.1}
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
