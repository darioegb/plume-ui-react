import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AppShell } from "./components/app-shell";
import { DashboardPage } from "./pages/dashboard-page";
import { ProjectsPage } from "./pages/projects-page";

export function App(): ReactNode {
  return (
    <AppShell>
      <Routes>
        <Route element={<DashboardPage />} path="/" />
        <Route element={<ProjectsPage />} path="/projects" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </AppShell>
  );
}
