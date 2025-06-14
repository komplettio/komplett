import { FileDropZone } from '#components/file-manager/FileDropZone';
import { useProjects } from '#state/queries';

import './home.route.scss';

export default function HomeRoute() {
  const { data: projects } = useProjects();
  console.log(projects);
  const handleFileUpload = async (file: File) => {
    console.log(file);
  };

  return <FileDropZone onFileUpload={handleFileUpload} />;
}
