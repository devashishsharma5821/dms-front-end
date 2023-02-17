import { TransformerDetail } from './transformerDetail';

export interface CreateProject {
    name: string;
    description: string;
    tags: string;
    project_variables: string;
}

export class GetAllProjects<T> {
    dmsProjects!: T;
}
export interface GetAllProjectsDetail {
    "id": string,
    "name": string,
    "created_by": string,
    "created_at": string,
    "project_variables": string
}
export interface GetAllProjectsAppStoreState {
    AllProjectsData: GetAllProjectsDetail[];
}
export interface GetSingleProjectAppStoreState {
    SingleProjectData: GetSingleProjectDetail;
}
export class GetSingleProject<T> {
    dmsProject!: T;
}
export interface GetSingleProjectDetail {
    basic : {
    id: string,
    name: string,
    created_by: string,
    created_at: string,
    project_variables: string
    },
tasks : {
    id: string,
    title: string,
    description: string,
    is_completed: string,
    created_by: string,
    created_at: string
}[],
experiments: {
    id: string,
    name: string,
} [],
project_access : {
    id: string,
    user_id: string,
    access_level: string,
}[],
}
export class ProjectCreate<T> {
    dmsCreateProject!: T;
}
export class ProjectCreateDetail {
    dmsCreateProject!: boolean;
}

export class EditCreateDetail {
    dmsEditProject!: boolean;
}
export class EditCreate<T> {
    dmsEditProject!: T;
}
