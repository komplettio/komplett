import * as Select from '@radix-ui/react-select';
import { AlertTriangle, ArrowLeft, Check, ChevronDown, Palette, Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { ConfirmationModal } from '#components/ui/ConfirmationModal';
import { useToast } from '#components/ui/Toast';

import './settings.route.scss';

import { Link } from 'react-router';

import { useSystemReset } from '#state/mutations/system.mutations.js';

export default function SettingsRoute() {
  const { addToast } = useToast();

  const resetSystem = useSystemReset();

  // UI Preferences State
  const [theme, setTheme] = useState('light');
  const [autoSave, setAutoSave] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [notifications, setNotifications] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Reset Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetApp = async () => {
    try {
      setIsResetting(true);

      await resetSystem.mutateAsync();

      localStorage.clear();
      sessionStorage.clear();

      // Optionally reload the page
      setTimeout(() => {
        window.location.replace('/');
      }, 1000);
    } catch (error) {
      console.error('Failed to reset app:', error);
      addToast({
        type: 'error',
        title: 'Reset Failed',
        description: 'Could not reset the application',
      });
    } finally {
      setIsResetting(false);
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto (System)' },
  ];

  const compressionOptions = [
    { value: 'low', label: 'Low (Best Quality)' },
    { value: 'medium', label: 'Medium (Balanced)' },
    { value: 'high', label: 'High (Smaller Files)' },
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <Link to="/">
          <button className="back-button">
            <ArrowLeft size={20} />
            Back
          </button>
        </Link>
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Customize your zedit experience and manage your data</p>
      </div>

      <div className="settings-content">
        {/* Appearance Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">
              <Palette size={20} style={{ display: 'inline', marginRight: '8px' }} />
              Appearance
            </h2>
            <p className="section-description">Customize the look and feel of the application</p>
          </div>
          <div className="section-content">
            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-label">Theme</h3>
                <p className="setting-description">Choose your preferred color scheme</p>
              </div>
              <div className="setting-control">
                <div className="select-control">
                  <Select.Root value={theme} onValueChange={setTheme}>
                    <Select.Trigger className="select-trigger">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDown size={16} />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="select-content">
                        <Select.Viewport>
                          {themeOptions.map(option => (
                            <Select.Item key={option.value} value={option.value} className="select-item">
                              <Select.ItemText>{option.label}</Select.ItemText>
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
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-label">Animations</h3>
                <p className="setting-description">Enable smooth transitions and animations</p>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${animationsEnabled ? 'active' : ''}`}
                  onClick={() => {
                    setAnimationsEnabled(!animationsEnabled);
                  }}
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-label">Show Thumbnails</h3>
                <p className="setting-description">Display preview thumbnails for files</p>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${showThumbnails ? 'active' : ''}`}
                  onClick={() => {
                    setShowThumbnails(!showThumbnails);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* File Processing Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">
              <SettingsIcon size={20} style={{ display: 'inline', marginRight: '8px' }} />
              File Processing
            </h2>
            <p className="section-description">Configure how files are processed and saved</p>
          </div>
          <div className="section-content">
            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-label">Auto Save</h3>
                <p className="setting-description">Automatically save changes as you work</p>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${autoSave ? 'active' : ''}`}
                  onClick={() => {
                    setAutoSave(!autoSave);
                  }}
                />
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-label">Default Compression</h3>
                <p className="setting-description">Default compression level for new files</p>
              </div>
              <div className="setting-control">
                <div className="select-control">
                  <Select.Root value={compressionLevel} onValueChange={setCompressionLevel}>
                    <Select.Trigger className="select-trigger">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDown size={16} />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="select-content">
                        <Select.Viewport>
                          {compressionOptions.map(option => (
                            <Select.Item key={option.value} value={option.value} className="select-item">
                              <Select.ItemText>{option.label}</Select.ItemText>
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
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-label">Notifications</h3>
                <p className="setting-description">Show notifications for completed operations</p>
              </div>
              <div className="setting-control">
                <div
                  className={`toggle-switch ${notifications ? 'active' : ''}`}
                  onClick={() => {
                    setNotifications(!notifications);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="section-header">
            <h2 className="section-title">
              <AlertTriangle size={20} style={{ display: 'inline', marginRight: '8px' }} />
              Danger Zone
            </h2>
            <p className="section-description">Irreversible actions that will affect your data</p>
          </div>
          <div className="section-content">
            <div className="setting-item">
              <div className="setting-info">
                <h3 className="setting-label">Reset Application</h3>
                <p className="setting-description">Delete all projects, files, and reset settings to defaults</p>
              </div>
              <div className="setting-control">
                <button
                  className="reset-button"
                  onClick={() => {
                    setIsResetModalOpen(true);
                  }}
                >
                  <Trash2 size={16} />
                  Reset App
                </button>
              </div>
            </div>

            <div className="reset-warning">
              <h4 className="warning-title">⚠️ Warning</h4>
              <p className="warning-text">
                This action will permanently delete all your projects, files, and custom settings. Make sure to download
                any important files before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => {
          setIsResetModalOpen(false);
        }}
        onConfirm={handleResetApp}
        title="Reset Application"
        message="Are you sure you want to reset the entire application? This will permanently delete all projects, files, and settings."
        confirmText="Reset Everything"
        cancelText="Cancel"
        variant="danger"
        isLoading={isResetting}
      />
    </div>
  );
}
