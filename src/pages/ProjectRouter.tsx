import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ExperimentsPage from './experiment';
import Project from './project/Project';
import ProjectDetails from './project/projectDetails';

export const ProjectRouter = () => {
    return (
        <Routes>
            <Route path="project" element={<Project />} />
            <Route path="projectDetails/:projectId" element={<ProjectDetails />} />
            <Route path="projectDetails/:projectId/experiment/:experimentId" element={<ExperimentsPage />} />
        </Routes>
    );
};
