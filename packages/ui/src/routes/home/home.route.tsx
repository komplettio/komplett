import { useNavigate } from 'react-router';

import { FileDropZone } from '#components/file-manager/FileDropZone';
import RecentProjects from '#components/project/RecentProjects';
import { useCreateProject, useImportFile } from '#state/mutations';

import './home.route.scss';

export default function HomeRoute() {
  const navigate = useNavigate();
  const importFile = useImportFile();
  const createProject = useCreateProject();

  const handleFileUpload = async (file: File) => {
    const fileResponse = await importFile.mutateAsync({
      file,
    });
    const projectResponse = await createProject.mutateAsync({
      name: `Project for ${file.name}`,
      fileIds: [fileResponse.id],
      description: `Automatically created project for file: ${file.name}`,
      tags: [fileResponse.data.category],
    });

    await navigate(`/projects/${projectResponse.id}`);
  };

  return (
    <div className="home">
      <FileDropZone onFileUpload={handleFileUpload} />
      <RecentProjects />
    </div>
  );
}
