import { FileIcon, Image, Music, Upload, Video } from 'lucide-react';
import type React from 'react';
import { useCallback, useState } from 'react';

import './FileDropZone.scss';

interface FileDropZoneProps {
  onFileUpload: (file: File) => Promise<void>;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        try {
          setIsUploading(true);
          await onFileUpload(files[0]);
        } catch (error) {
          console.error('Failed to upload file:', error);
        } finally {
          setIsUploading(false);
        }
      }
    },
    [onFileUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        try {
          setIsUploading(true);
          await onFileUpload(e.target.files[0]);
        } catch (error) {
          console.error('Failed to upload file:', error);
        } finally {
          setIsUploading(false);
        }
      }
    },
    [onFileUpload],
  );

  if (isUploading) {
    return (
      <div className="drop-zone">
        <div className="drop-area">
          <div className="loading-spinner" />
          <h1 className="drop-title">Importing file...</h1>
          <p className="drop-subtitle">Please wait while we process your file</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}>
      <div className="drop-area" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
        <Upload className="drop-icon" />
        <h1 className="drop-title">Drop a file here</h1>
        <p className="drop-subtitle">or click to browse your files</p>

        <input type="file" onChange={handleFileInput} className="file-input" id="file-input" disabled={isUploading} />
        <label htmlFor="file-input" className="file-input-label">
          <Upload size={20} />
          Choose File
        </label>

        <div className="supported-formats">
          <div className="format-group">
            <FileIcon size={18} />
            <span>Documents</span>
          </div>
          <div className="format-group">
            <Image size={18} />
            <span>Images</span>
          </div>
          <div className="format-group">
            <Video size={18} />
            <span>Videos</span>
          </div>
          <div className="format-group">
            <Music size={18} />
            <span>Audio</span>
          </div>
        </div>
      </div>
    </div>
  );
};
