import { useParams } from 'react-router';

import type { UUID } from '@komplett/core';

import { Project } from '#components/project/Project';
import { useProject } from '#state/queries/project.queries.js';

export default function ProjectRoute() {
  const params = useParams<{ id: UUID }>();

  if (!params.id) {
    throw new Error('Project ID is not set or invalid');
  }

  const { data: project } = useProject(params.id);

  if (!project) {
    return <div>Loading...</div>;
  }

  return <Project project={project} />;
}
