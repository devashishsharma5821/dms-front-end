export interface CreateProject {
    name: string;
    description: string;
    tags: string;
    project_variables: string;
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
