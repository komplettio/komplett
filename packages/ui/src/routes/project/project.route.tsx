import { useEffect } from 'react';
import { useParams } from 'react-router';

import { Project } from '#components/project/project';
import { useProjectManager } from '#contexts/ProjectManagerContext';

export default function ProjectRoute() {
  const { currentProject, currentFile, isLoading, loadProject } = useProjectManager();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (currentProject) return;

    if (params.id) {
      const projectId = Number(params.id);
      if (projectId && typeof projectId === 'number' && !isNaN(projectId)) {
        void loadProject(projectId);
      }
    }
  }, [params.id, currentProject]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentProject || !currentFile) {
    return <div className="error">No project or file selected</div>;
  }

  return <Project project={currentProject} currentFile={currentFile} />;
}
