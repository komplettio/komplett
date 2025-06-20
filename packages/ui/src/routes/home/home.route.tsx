import { useNavigate } from 'react-router';

import { FileDropZone } from '#components/file-manager/FileDropZone';
import RecentProjects from '#components/project/recent-projects-list/RecentProjects';
import { useCreateProject, useImportFile } from '#state/mutations';

import './home.route.scss';

export default function HomeRoute() {
  const navigate = useNavigate();
  const importFile = useImportFile();
  const createProject = useCreateProject();

  const handleFileUpload = async (files: File[]) => {
    const fileResponses = await Promise.all(files.map(file => importFile.mutateAsync({ file })));

    const projectTag = fileResponses[0]?.data.kind;

    const projectResponse = await createProject.mutateAsync({
      name: `Project for ${files.map(file => file.name).join(', ')}`,
      fileIds: fileResponses.map(response => response.id),
      description: `Automatically created project for files: ${files.map(file => file.name).join(', ')}`,
      tags: projectTag ? [projectTag] : [],
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
