import { useNavigate } from 'react-router';

import { FileDropZone } from '#components/file-manager/FileDropZone';
import RecentProjects from '#components/project/recent-projects-list/RecentProjects';
import { useCreateProject, useImportFile } from '#state/mutations';

import './home.route.scss';

import { ChevronDown, ChevronDownCircle, InfoIcon } from 'lucide-react';

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
      <div className="home__header">
        <h1 className="home__title">
          <div className="animated-text-container">
            <span className="animated-text highlight">Compress</span>
            <span className="animated-text highlight">Convert</span>
            <span className="animated-text highlight">Optimize</span>
            <span className="animated-text highlight">Stylize</span>
          </div>
          your
          <div className="animated-text-container">
            <span className="animated-text highlight">Images</span>
            <span className="animated-text highlight">Videos</span>
            <span className="animated-text highlight">Audios</span>
            <span className="animated-text highlight">Files</span>
          </div>
          - Offline and <span>Instantly</span>!
        </h1>
        <p className="home__subtitle">
          The smartest way to convert, optimize, and manage your files.
          <br />
          <span className="highlight">Privacy and local-first</span>: Files <span className="highlight">never</span>{' '}
          leave your machine!
          <br />
          <span className="home__subtitle__extra">
            Files are processed in your browser using the power of{' '}
            <a href="https://www.rust-lang.org/what/wasm" rel="noopener noreferrer" target="_blank">
              Rust and WebAssembly
            </a>
            .
          </span>
        </p>
        <div className="home__info-badge">
          <InfoIcon />
          <p>
            Komplett is still in development, and this is an MVP. <span className="highlight">Dont&apos;t</span> expect
            things to work. Expect them to <span className="highlight">break</span>, and{' '}
            <span className="highlight">don&apos;t rely</span> on files being stored.
          </p>
        </div>
        <div className="home__dropzone">
          <FileDropZone onFileUpload={handleFileUpload} />
        </div>

        <ChevronDown size={32} className="home__header__chevron" />
      </div>

      <div className="home__features">
        <h2>Why to choose komplett</h2>

        <p>
          komplett.io let&apos;s you process, optimize, convert and manipulate all kinds of files like images, videos,
          audio etc.
          <br />
          Files <b>never</b> leave your machine! We use the power of rust and webassembly to run all processing in your
          browser.
        </p>
      </div>
    </div>
  );
}
