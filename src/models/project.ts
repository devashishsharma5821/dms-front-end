export interface CreateProject {
    id: string;
    name: string;
    description: string;
    tags: string;
    project_variables: string;
    project_access: {
        id: string;
        user_id: string;
        access_level: string;
    };
}

export class GetAllProjects<T> {
    dmsProjects!: T;
}
export interface GetAllProjectsDetail {
    id: string;
    name: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    project_variables: string;
    description: string;
    tags: string[];
    project_access: {
        id: string;
        user_id: string;
        access_level: string;
    }[];
    datasources: {
        id: string;
        name: string;
        created_by: string;
        created_at: string;
        spec: {
            path: string;
        };
    }[];
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
    basic: {
        id: string;
        name: string;
        created_by: string;
        created_at: string;
        updated_at: string;
        project_variables: string;
        description: string;
        tags: string[];
    };
    tasks: {
        id: string;
        title: string;
        description: string;
        is_completed: string;
        created_by: string;
        created_at: string;
    }[];
    experiments: {
        id: string;
        name: string;
    }[];
    datasources: {
        id: string;
        name: string;
        spec: {
            path: string;
        };
    };
    project_access: {
        id: string;
        user_id: string;
        access_level: string;
    }[];
}
export class ProjectCreate<T> {
    dmsCreateProject!: T;
}
export class ProjectCreateDetail {
    dmsCreateProject!: boolean;
}
export class ProjectEdit<T> {
    dmsEditProject!: T;
}
export class ProjectEditDetail {
    dmsEditProject!: boolean;
}
export class EditCreateDetail {
    dmsEditProject!: boolean;
}
export class EditCreate<T> {
    dmsEditProject!: T;
}
export class ProjectDelete<T> {
    dmsDeleteProject!: T;
}
export class DeleteProjectDetail {
    dmsDeleteProject!: boolean;
}
