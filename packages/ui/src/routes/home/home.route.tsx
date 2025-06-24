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

    const firstFiles = fileResponses
      .slice(0, 3)
      .map(response => response.data.name)
      .join(', ');

    const projectResponse = await createProject.mutateAsync({
      name: `Project for ${firstFiles}`,
      fileIds: fileResponses.map(response => response.id),
      description: `Automatically created for files: ${firstFiles}`,
      tags: projectTag ? [projectTag] : [],
    });

    await navigate(`/projects/${projectResponse.id}`);
  };

  return (
    <div className="home">
      <h1 className="home__title">Komplett.io - local-first file processing</h1>
      <h2 className="home__subtitle">
        Files never leave your machine!{' '}
        <span>
          For <b>all</b> files, for free, for ever!
        </span>
      </h2>
      <FileDropZone onFileUpload={handleFileUpload} />
      <RecentProjects />
    </div>
  );
}
