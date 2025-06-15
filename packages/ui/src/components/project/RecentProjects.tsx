import { FileIcon, HardDrive } from 'lucide-react';
import { Link } from 'react-router';

import { useProjects } from '#state/queries';
import { formatFileSize } from '#utils/fileUtils';

import './RecentProjects.scss';

export default function RecentProjects() {
  const { data: projects, isLoading: isLoadingProjects } = useProjects({ limit: 2 });

  return (
    <>
      <h2>Recent projects:</h2>
      <div className="recent-projects-grid">
        {isLoadingProjects ? (
          <div>Loading...</div>
        ) : (
          projects?.map(project => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <div className="project-card">
                <div className="project-header">
                  <div className="project-info">
                    <h3 className="project-name">{project.name}</h3>
                    {project.description && <p className="project-description">{project.description}</p>}
                  </div>
                </div>

                <div className="project-stats">
                  <div className="stat-item">
                    <FileIcon size={14} className="stat-icon" />
                    <span>{project.fileIds.length} files</span>
                  </div>
                  <div className="stat-item">
                    <HardDrive size={14} className="stat-icon" />
                    <span>{formatFileSize(project.size)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}

        {projects && projects.length === 0 && <div className="no-projects">None.</div>}
      </div>
    </>
  );
}
