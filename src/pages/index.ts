import { lazy } from 'react';
export const HomePage = lazy(() => import('./home'));
export const ExperimentsPage = lazy(() => import('./experiment'));
export const PageNotFound = lazy(() => import('./pagenotfound'));
export const Notebook = lazy(() => import('./notebook'));
export const Compute = lazy(() => import('./compute'));
export const Project = lazy(() => import('./project'));
export const ProjectDetails = lazy(() => import('./project/projectDetails'));
export const ComputeDetails = lazy(() => import('./computeDetails'));
