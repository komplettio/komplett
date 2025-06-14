import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check, Download } from 'lucide-react';
import { ProjectFile } from '../../types/project';
import { useProjectManager } from '../../contexts/ProjectManagerContext';
import { getSupportedFormats } from '../../utils/conversionUtils';
import './ImageEditor.scss';

interface ImageEditorProps {
  file: ProjectFile;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ file }) => {
  const { updateFileOptions, updateFileFormat, processFile, downloadFile } = useProjectManager();

  const handleAdjustment = async (property: string, value: number[]) => {
    await updateFileOptions({
      ...file.options,
      [property]: value[0]
    });
  };

  const handleFormatChange = (format: string) => {
    updateFileFormat(format);
  };

  const handleConvert = async () => {
    if (file.targetFormat) {
      await processFile();
    }
  };

  const handleDownload = () => {
    downloadFile(file);
  };

  const brightness = file.options?.brightness || 100;
  const contrast = file.options?.contrast || 100;
  const saturation = file.options?.saturation || 100;
  const quality = file.options?.quality || 90;

  const supportedFormats = getSupportedFormats(file.mimeType || '');
  const currentFormat = file.name.split('.').pop()?.toLowerCase() || '';

  return (
    <div className="image-editor">
      <div className="editor-section">
        <h4 className="section-title">Image Adjustments</h4>
        
        <div className="adjustment-controls">
          <div className="control-group">
            <label className="control-label">
              Brightness: {brightness}%
            </label>
            <Slider.Root
              className="slider-root"
              value={[brightness]}
              onValueChange={(value) => handleAdjustment('brightness', value)}
              min={0}
              max={200}
              step={1}
            >
              <Slider.Track className="slider-track">
                <Slider.Range className="slider-range" />
              </Slider.Track>
              <Slider.Thumb className="slider-thumb" />
            </Slider.Root>
          </div>

          <div className="control-group">
            <label className="control-label">
              Contrast: {contrast}%
            </label>
            <Slider.Root
              className="slider-root"
              value={[contrast]}
              onValueChange={(value) => handleAdjustment('contrast', value)}
              min={0}
              max={200}
              step={1}
            >
              <Slider.Track className="slider-track">
                <Slider.Range className="slider-range" />
              </Slider.Track>
              <Slider.Thumb className="slider-thumb" />
            </Slider.Root>
          </div>

          <div className="control-group">
            <label className="control-label">
              Saturation: {saturation}%
            </label>
            <Slider.Root
              className="slider-root"
              value={[saturation]}
              onValueChange={(value) => handleAdjustment('saturation', value)}
              min={0}
              max={200}
              step={1}
            >
              <Slider.Track className="slider-track">
                <Slider.Range className="slider-range" />
              </Slider.Track>
              <Slider.Thumb className="slider-thumb" />
            </Slider.Root>
          </div>

          <div className="control-group">
            <label className="control-label">
              Quality: {quality}%
            </label>
            <Slider.Root
              className="slider-root"
              value={[quality]}
              onValueChange={(value) => handleAdjustment('quality', value)}
              min={10}
              max={100}
              step={5}
            >
              <Slider.Track className="slider-track">
                <Slider.Range className="slider-range" />
              </Slider.Track>
              <Slider.Thumb className="slider-thumb" />
            </Slider.Root>
          </div>
        </div>
      </div>

      <div className="editor-section">
        <h4 className="section-title">Export Settings</h4>
        
        <div className="export-controls">
          <div className="format-selection">
            <label className="control-label">Output Format</label>
            <div className="current-format">
              Current: {currentFormat.toUpperCase()}
            </div>
            <Select.Root
              value={file.targetFormat || ''}
              onValueChange={handleFormatChange}
            >
              <Select.Trigger className="select-trigger">
                <Select.Value placeholder="Choose output format" />
                <Select.Icon>
                  <ChevronDown size={16} />
                </Select.Icon>
              </Select.Trigger>
              
              <Select.Portal>
                <Select.Content className="select-content">
                  <Select.Viewport>
                    {supportedFormats.map((format) => (
                      <Select.Item 
                        key={format} 
                        value={format}
                        className="select-item"
                      >
                        <Select.ItemText>{format.toUpperCase()}</Select.ItemText>
                        <Select.ItemIndicator>
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <div className="action-buttons">
            {file.status === 'pending' && file.targetFormat && (
              <button 
                className="convert-button"
                onClick={handleConvert}
              >
                Convert Image
              </button>
            )}
            
            {file.status === 'converting' && (
              <div className="conversion-status">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${file.progress || 0}%` }}
                  />
                </div>
                <span className="progress-text">Converting... {file.progress || 0}%</span>
              </div>
            )}
            
            {file.status === 'completed' && (
              <button 
                className="download-button"
                onClick={handleDownload}
              >
                <Download size={16} />
                Download Image
              </button>
            )}
            
            {file.status === 'error' && (
              <div className="error-status">
                Conversion failed. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};