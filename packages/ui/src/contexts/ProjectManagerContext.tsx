import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { 
  Project, 
  ProjectFile, 
  FileTypeOptions
} from '../types/project';
import { db } from '../services/database';
import { debounceAsync } from '../utils/debounce';
import { useToast } from '../components/ui/Toast';

interface ProjectManagerState {
  currentProject: Project | null;
  currentFile: ProjectFile | null;
  projects: Project[];
  isLoading: boolean;
  isProjectListOpen: boolean;
}

type ProjectManagerAction =
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'SET_CURRENT_FILE'; payload: ProjectFile | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROJECT_LIST_OPEN'; payload: boolean }
  | { type: 'UPDATE_CURRENT_FILE'; payload: Partial<ProjectFile> }
  | { type: 'UPDATE_CURRENT_PROJECT'; payload: Partial<Project> };

const initialState: ProjectManagerState = {
  currentProject: null,
  currentFile: null,
  projects: [],
  isLoading: false,
  isProjectListOpen: false,
};

const projectManagerReducer = (
  state: ProjectManagerState, 
  action: ProjectManagerAction
): ProjectManagerState => {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
        currentFile: action.payload?.files[0] || null, // Auto-select first file
      };
    
    case 'SET_CURRENT_FILE':
      return {
        ...state,
        currentFile: action.payload,
      };
    
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_PROJECT_LIST_OPEN':
      return {
        ...state,
        isProjectListOpen: action.payload,
      };
    
    case 'UPDATE_CURRENT_FILE':
      return {
        ...state,
        currentFile: state.currentFile 
          ? { ...state.currentFile, ...action.payload }
          : null,
      };
    
    case 'UPDATE_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: state.currentProject 
          ? { ...state.currentProject, ...action.payload }
          : null,
      };
    
    default:
      return state;
  }
};

interface ProjectManagerContextType extends ProjectManagerState {
  // Project operations
  createProject: (name: string, description?: string) => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  updateProject: (updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  clearCurrentProject: () => void;
  
  // File operations
  uploadFile: (file: File) => Promise<void>;
  loadFile: (fileId: string) => Promise<void>;
  updateFileOptions: (options: Partial<FileTypeOptions>) => Promise<void>;
  updateFileFormat: (format: string) => void;
  processFile: () => Promise<void>;
  downloadFile: (file?: ProjectFile) => void;
  deleteFile: (fileId: string) => Promise<void>;
  selectFile: (fileId: string) => void;
  
  // Navigation
  openProjectList: () => void;
  closeProjectList: () => void;
  
  // Utility
  refreshProjects: () => Promise<void>;
}

const ProjectManagerContext = createContext<ProjectManagerContextType | undefined>(undefined);

export const useProjectManager = () => {
  const context = useContext(ProjectManagerContext);
  if (!context) {
    throw new Error('useProjectManager must be used within ProjectManagerProvider');
  }
  return context;
};

export const ProjectManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectManagerReducer, initialState);
  const { addToast } = useToast();

  // Debounced update functions for performance
  const debouncedUpdateFile = useCallback(
    debounceAsync(async (fileId: string, updates: Partial<ProjectFile>) => {
      await db.updateFile(fileId, updates);
    }, 300),
    []
  );

  const debouncedUpdateProject = useCallback(
    debounceAsync(async (projectId: string, updates: Partial<Project>) => {
      await db.updateProject(projectId, updates);
    }, 300),
    []
  );

  // Initialize database and load projects
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await db.open();
        await refreshProjects();
      } catch (error) {
        console.error('Failed to initialize app:', error);
        addToast({
          type: 'error',
          title: 'Initialization Error',
          description: 'Failed to initialize the application'
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, []);

  // Project operations
  const createProject = async (name: string, description?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const projectId = await db.createProject(name, description);
      const project = await db.getProject(projectId);
      
      if (project) {
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
        await refreshProjects();
        
        addToast({
          type: 'success',
          title: 'Project created',
          description: `Project "${name}" has been created successfully`
        });
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      addToast({
        type: 'error',
        title: 'Creation failed',
        description: 'Could not create project'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadProject = async (projectId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const project = await db.getProject(projectId);
      if (project) {
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      } else {
        addToast({
          type: 'error',
          title: 'Project not found',
          description: 'The requested project could not be loaded'
        });
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      addToast({
        type: 'error',
        title: 'Load failed',
        description: 'Could not load project'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProject = async (updates: Partial<Project>) => {
    if (!state.currentProject) return;

    try {
      dispatch({ type: 'UPDATE_CURRENT_PROJECT', payload: updates });
      await debouncedUpdateProject(state.currentProject.id, updates);
    } catch (error) {
      console.error('Failed to update project:', error);
      addToast({
        type: 'error',
        title: 'Update failed',
        description: 'Could not save project changes'
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await db.deleteProject(projectId);
      
      if (state.currentProject?.id === projectId) {
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
      }
      
      await refreshProjects();
      
      addToast({
        type: 'success',
        title: 'Project deleted',
        description: 'Project has been removed successfully'
      });
    } catch (error) {
      console.error('Failed to delete project:', error);
      addToast({
        type: 'error',
        title: 'Delete failed',
        description: 'Could not delete project'
      });
    }
  };

  const clearCurrentProject = () => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
  };

  // File operations
  const uploadFile = async (file: File) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      let currentProjectId = state.currentProject?.id;
      
      // If no current project, create one
      if (!currentProjectId) {
        const projectName = `Project - ${file.name}`;
        currentProjectId = await db.createProject(projectName, `Auto-created for ${file.name}`);
      }

      if (!currentProjectId) {
        throw new Error('Failed to create or load project');
      }

      // Upload the file
      const projectFile = await db.saveFile(currentProjectId, file);
      
      // Set the uploaded file as the current file
      dispatch({ type: 'SET_CURRENT_FILE', payload: projectFile });
      
      // Refresh project to get updated file list
      const updatedProject = await db.getProject(currentProjectId);
      if (updatedProject) {
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: updatedProject });
      }
      
      // Refresh projects list
      await refreshProjects();
      
      addToast({
        type: 'success',
        title: 'File uploaded',
        description: `${file.name} has been saved successfully`
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
      addToast({
        type: 'error',
        title: 'Upload failed',
        description: 'Could not save file'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadFile = async (fileId: string) => {
    try {
      const file = await db.getFile(fileId);
      if (file) {
        dispatch({ type: 'SET_CURRENT_FILE', payload: file });
        
        // Load the project if not already loaded
        if (!state.currentProject || state.currentProject.id !== file.projectId) {
          const project = await db.getProject(file.projectId);
          if (project) {
            dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
          }
        }
      } else {
        addToast({
          type: 'error',
          title: 'File not found',
          description: 'The requested file could not be loaded'
        });
      }
    } catch (error) {
      console.error('Failed to load file:', error);
      addToast({
        type: 'error',
        title: 'Load failed',
        description: 'Could not load file'
      });
    }
  };

  const selectFile = (fileId: string) => {
    if (state.currentProject) {
      const file = state.currentProject.files.find(f => f.id === fileId);
      if (file) {
        dispatch({ type: 'SET_CURRENT_FILE', payload: file });
      }
    }
  };

  const updateFileOptions = async (optionUpdates: Partial<FileTypeOptions>) => {
    if (!state.currentFile) return;

    try {
      const updatedOptions = { ...state.currentFile.options, ...optionUpdates };
      const updates = { options: updatedOptions };
      dispatch({ type: 'UPDATE_CURRENT_FILE', payload: updates });
      await debouncedUpdateFile(state.currentFile.id, updates);
    } catch (error) {
      console.error('Failed to update file options:', error);
      addToast({
        type: 'error',
        title: 'Update failed',
        description: 'Could not save file options'
      });
    }
  };

  const updateFileFormat = (format: string) => {
    if (!state.currentFile) return;
    
    dispatch({ 
      type: 'UPDATE_CURRENT_FILE', 
      payload: { targetFormat: format } 
    });
  };

  const processFile = async () => {
    if (!state.currentFile || !state.currentFile.targetFormat) return;
    
    try {
      // Update status to processing
      dispatch({ 
        type: 'UPDATE_CURRENT_FILE', 
        payload: { status: 'processing', progress: 0 } 
      });

      // Simulate processing with progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Complete processing
          const updates = { 
            status: 'completed' as const, 
            progress: 100,
            exportedBlob: state.currentFile!.blob, // Simulate conversion
            lastExportDate: new Date()
          };
          
          dispatch({ type: 'UPDATE_CURRENT_FILE', payload: updates });
          db.updateFile(state.currentFile!.id, updates);
          
          addToast({
            type: 'success',
            title: 'Processing completed',
            description: `${state.currentFile!.name} processed successfully`
          });
        } else {
          dispatch({ 
            type: 'UPDATE_CURRENT_FILE', 
            payload: { progress } 
          });
        }
      }, 200);
    } catch (error) {
      console.error('Processing failed:', error);
      const errorUpdates = { status: 'error' as const, progress: 0 };
      dispatch({ type: 'UPDATE_CURRENT_FILE', payload: errorUpdates });
      await db.updateFile(state.currentFile.id, errorUpdates);
      
      addToast({
        type: 'error',
        title: 'Processing failed',
        description: `Failed to process ${state.currentFile.name}`
      });
    }
  };

  const downloadFile = (file?: ProjectFile) => {
    const targetFile = file || state.currentFile;
    if (!targetFile) return;

    try {
      const blob = targetFile.exportedBlob || targetFile.blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = targetFile.targetFormat 
        ? `${targetFile.name.split('.')[0]}.${targetFile.targetFormat}`
        : targetFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addToast({
        type: 'success',
        title: 'Download started',
        description: `Downloading ${targetFile.name}`
      });
    } catch (error) {
      console.error('Download failed:', error);
      addToast({
        type: 'error',
        title: 'Download failed',
        description: 'Could not download file'
      });
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      await db.deleteFile(fileId);
      
      if (state.currentFile?.id === fileId) {
        dispatch({ type: 'SET_CURRENT_FILE', payload: null });
      }
      
      // Refresh current project
      if (state.currentProject) {
        const updatedProject = await db.getProject(state.currentProject.id);
        if (updatedProject) {
          dispatch({ type: 'SET_CURRENT_PROJECT', payload: updatedProject });
        }
      }
      
      addToast({
        type: 'success',
        title: 'File deleted',
        description: 'File has been removed successfully'
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      addToast({
        type: 'error',
        title: 'Delete failed',
        description: 'Could not delete file'
      });
    }
  };

  // Navigation
  const openProjectList = () => {
    dispatch({ type: 'SET_PROJECT_LIST_OPEN', payload: true });
  };

  const closeProjectList = () => {
    dispatch({ type: 'SET_PROJECT_LIST_OPEN', payload: false });
  };

  // Utility
  const refreshProjects = async () => {
    try {
      const projects = await db.getAllProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      console.error('Failed to refresh projects:', error);
    }
  };

  const contextValue: ProjectManagerContextType = {
    ...state,
    createProject,
    loadProject,
    updateProject,
    deleteProject,
    clearCurrentProject,
    uploadFile,
    loadFile,
    updateFileOptions,
    updateFileFormat,
    processFile,
    downloadFile,
    deleteFile,
    selectFile,
    openProjectList,
    closeProjectList,
    refreshProjects,
  };

  return (
    <ProjectManagerContext.Provider value={contextValue}>
      {children}
    </ProjectManagerContext.Provider>
  );
};