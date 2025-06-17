import {
  Clock,
  FileIcon,
  FolderOpen,
  HardDrive,
  Image,
  Music,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Video,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import type { FileBaseModel, ProjectModel } from '@komplett/core';

import { useCreateProject } from '#state/mutations';
import { useProjects } from '#state/queries/project.queries.js';
import { formatFileSize } from '#utils/fileUtils';

import './ProjectList.scss';

interface ProjectListProps {
  isOpen: boolean;
  onClose: () => void;
}

type SortOption = 'name' | 'date' | 'size' | 'files';
type FilterOption = 'all' | 'recent' | 'large' | 'image' | 'video' | 'audio';

export const ProjectList: React.FC<ProjectListProps> = ({ isOpen, onClose }) => {
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  const createProject = useCreateProject();

  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [filteredProjects, setFilteredProjects] = useState<ProjectModel[]>([]);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchQuery, sortBy, sortOrder, filterBy]);

  const filterAndSortProjects = () => {
    if (!projects) return;

    let filtered = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some(tag => tag.toLowerCase().includes(query)),
      );
    }

    // Apply kind filter
    switch (filterBy) {
      case 'recent': {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(project => project.updatedAt > weekAgo);
        break;
      }
      case 'large':
        filtered = filtered.filter(project => project.size > 10 * 1024 * 1024); // > 10MB
        break;
      case 'all':
        break;
      default:
        filtered = filtered.filter(project => project.kind === filterBy);
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'files':
          comparison = a.fileIds.length - b.fileIds.length;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredProjects(filtered);
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    try {
      createProject.mutate({
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
        tags: [],
        fileIds: [],
      });
      setNewProjectName('');
      setNewProjectDescription('');
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getProjectFileTypes = (files: FileBaseModel[]) => {
    const types = new Set<string>();
    files.forEach(file => {
      if (file.kind === 'image') types.add('image');
      if (file.kind === 'video') types.add('video');
      if (file.kind === 'audio') types.add('audio');
      if (file.kind === 'document') types.add('document');
      if (file.kind === 'text') types.add('text');
    });
    return Array.from(types);
  };

  const filterOptions = [
    { key: 'all', label: 'All Projects', icon: FolderOpen },
    { key: 'recent', label: 'Recent', icon: Clock },
    { key: 'large', label: 'Large Files', icon: HardDrive },
    { key: 'image', label: 'Images', icon: Image },
    { key: 'video', label: 'Videos', icon: Video },
    { key: 'audio', label: 'Audio', icon: Music },
  ];

  return (
    <div className={`project-list ${isOpen ? 'open' : ''}`}>
      <div className="project-list-header">
        <div className="header-title">
          <h2 className="title-text">Projects</h2>
          <button className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="search-controls">
          <div className="search-input-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
              }}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <div className="filter-buttons">
              {filterOptions.map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.key}
                    className={`filter-button ${filterBy === option.key ? 'active' : ''}`}
                    onClick={() => {
                      setFilterBy(option.key as FilterOption);
                    }}
                  >
                    <Icon size={14} />
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="sort-controls">
              <button
                className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => {
                  toggleSort('name');
                }}
              >
                Name
                {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />)}
              </button>
              <button
                className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
                onClick={() => {
                  toggleSort('date');
                }}
              >
                Date
                {sortBy === 'date' && (sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />)}
              </button>
              <button
                className={`sort-button ${sortBy === 'size' ? 'active' : ''}`}
                onClick={() => {
                  toggleSort('size');
                }}
              >
                Size
                {sortBy === 'size' && (sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />)}
              </button>
            </div>
          </div>
        </div>

        {!isCreating ? (
          <button
            className="create-project-button"
            onClick={() => {
              setIsCreating(true);
            }}
          >
            <Plus size={16} />
            New Project
          </button>
        ) : (
          <div className="create-project-form">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={e => {
                setNewProjectName(e.target.value);
              }}
              className="project-name-input"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newProjectDescription}
              onChange={e => {
                setNewProjectDescription(e.target.value);
              }}
              className="project-description-input"
              rows={2}
            />
            <div className="form-actions">
              <button
                className="cancel-button"
                onClick={() => {
                  setIsCreating(false);
                  setNewProjectName('');
                  setNewProjectDescription('');
                }}
              >
                Cancel
              </button>
              <button className="create-button" onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                Create
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="project-list-content">
        {isLoadingProjects ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={64} className="empty-icon" />
            <p className="empty-text">
              {searchQuery || filterBy !== 'all' ? 'No projects match your criteria' : 'No projects yet'}
            </p>
            {!searchQuery && filterBy === 'all' && (
              <p className="empty-subtitle">Create your first project to get started</p>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map(project => {
              const fileTypes = getProjectFileTypes(project.files);

              return (
                <Link key={project.id} to={`/projects/${project.id}`} onClick={onClose}>
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

                    {fileTypes.length > 0 && (
                      <div className="file-types">
                        {fileTypes.includes('image') && <Image size={16} className="type-icon" />}
                        {fileTypes.includes('video') && <Video size={16} className="type-icon" />}
                        {fileTypes.includes('audio') && <Music size={16} className="type-icon" />}
                      </div>
                    )}

                    <div className="project-meta">
                      <span>Modified {formatDate(project.updatedAt)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
