import { BrowserRouter, Route, Routes } from 'react-router';

import { MainLayout } from '#layout/main/main.layout';
import ProjectLayout from '#layout/project/project.layout';
import { HomeRoute, ProjectRoute } from '#routes';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomeRoute />} />
          <Route path="/projects" element={<ProjectLayout />}>
            <Route path=":id" element={<ProjectRoute />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
