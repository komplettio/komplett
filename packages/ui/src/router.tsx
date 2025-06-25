import { BrowserRouter, Route, Routes } from 'react-router';

import { MainLayout } from '#layout/main/main.layout';
import ProjectLayout from '#layout/project/project.layout';
import { FilesRoute, HomeRoute, ProjectRoute, SettingsRoute } from '#routes';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomeRoute />} />
          <Route path="/projects" element={<ProjectLayout />}>
            <Route path=":id" element={<ProjectRoute />} />
          </Route>
          <Route path="/settings" element={<SettingsRoute />} />
          <Route path="/files" element={<FilesRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
