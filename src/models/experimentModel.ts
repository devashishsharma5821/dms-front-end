

export interface Experiment {
    id: string;
    name: string;
    description: string;
    tags: string[];
    core: any;
    display: any;
    outputs: {
    name: string;
    type: string;
    }[];
    status: string;
    created_by: string;
    created_at: string;
    modified_at: string;
    is_deployed: string;
    related_experiment_id: string;
    related_experiment_name: string;
}
export class GetExperiment<T> {
    dmsExperiment!: T;
}
export class ExperimentCreate<T> {
    dmsCreateExperiment!: T;
}
export class ExperimentCreateDetail {
    dmsCreateExperiment!: boolean;
}
export interface GetExperimentAppStoreState {
    ExperimentData: Experiment;
}

export class ExperimentEdit<T> {
    dmsEditExperiment!: T;
}
export class ExperimentEditDetail {
    dmsEditExperiment!: boolean;
}

export class CloneExperiment<T> {
    dmsCloneExperiment!: {
    experiment_id: T;
}
}
export class CloneExperimentDetail {
    dmsCloneExperiment!: {
        experiment_id: string
    }
}
