import { AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { useSystemReset } from '#state/mutations';
import * as UI from '#ui';
import { ConfirmationModal } from '#ui/ConfirmationModal';
import { useToast } from '#ui/Toast.js';

import './settings.route.scss';

// TODO: Replace all those nasty toggle divs. WTF is AI doing.

export default function SettingsRoute() {
  const { addToast } = useToast();

  const resetSystem = useSystemReset();

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
                <UI.Button.Root
                  error
                  large
                  onClick={() => {
                    setIsResetModalOpen(true);
                  }}
                >
                  <Trash2 size={16} />
                  Reset App
                </UI.Button.Root>
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
