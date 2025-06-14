import { FileDropZone } from '#components/file-manager/FileDropZone';
import { useProjectManager } from '#contexts/ProjectManagerContext';

import './home.route.scss';

export default function HomeRoute() {
  const { uploadFile } = useProjectManager();

  const handleFileUpload = async (file: File) => {
    await uploadFile(file);
  };

  return <FileDropZone onFileUpload={handleFileUpload} />;
}
