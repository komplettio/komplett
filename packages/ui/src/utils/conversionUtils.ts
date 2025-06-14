import { ProjectFile } from '../types/project';

export const getSupportedFormats = (mimeType: string): string[] => {
  if (mimeType.startsWith('image/')) {
    return ['jpg', 'png', 'webp', 'gif', 'bmp'];
  }
  if (mimeType.startsWith('video/')) {
    return ['mp4', 'webm', 'avi', 'mov'];
  }
  if (mimeType.startsWith('audio/')) {
    return ['mp3', 'wav', 'ogg', 'flac'];
  }
  if (mimeType.includes('text') || mimeType.includes('document')) {
    return ['txt', 'pdf', 'docx', 'html'];
  }
  return [];
};

export const convertFile = async (
  file: ProjectFile, 
  onProgress: (progress: number) => void
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Simulate conversion process
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        onProgress(progress);
        
        // Simulate file conversion by creating a new blob
        // In a real implementation, this would use proper conversion libraries
        setTimeout(() => {
          const convertedBlob = new Blob([file.blob], { 
            type: `${file.type.split('/')[0]}/${file.targetFormat}`
          });
          resolve(convertedBlob);
        }, 500);
      } else {
        onProgress(progress);
      }
    }, 200);
  });
};

export const applyImageFilters = (
  imageData: ImageData, 
  options: any
): ImageData => {
  const { brightness = 100, contrast = 100, saturation = 100 } = options;
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness
    data[i] = data[i] * (brightness / 100);
    data[i + 1] = data[i + 1] * (brightness / 100);
    data[i + 2] = data[i + 2] * (brightness / 100);
    
    // Apply contrast
    data[i] = ((data[i] / 255 - 0.5) * (contrast / 100) + 0.5) * 255;
    data[i + 1] = ((data[i + 1] / 255 - 0.5) * (contrast / 100) + 0.5) * 255;
    data[i + 2] = ((data[i + 2] / 255 - 0.5) * (contrast / 100) + 0.5) * 255;
  }
  
  return imageData;
};