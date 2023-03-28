import type UiSchema from '@rjsf/core';
import { InputOutputType } from './types';

export type Point = {
    x: number;
    y: number;
};

export type Port = {
    name: string;
    label: string;
    required: boolean;
    type: InputOutputType;
};

export type ErrorLevel = 'schema' | 'error' | 'warning' | 'pipeline';

export type ValidationError = {
    level: ErrorLevel;
    message: string;
};

export type Transformer = {
    stageId: string;
    position: Point;
    name: string;
    label: string;
    properties: any;
};

export type TransformerInfo = Omit<Transformer, 'stageId' | 'portErrors' | 'formErrors' | 'position'> & {
    category: string;
    description: string;
    documentation: string;
    icon: string;
    layout: UiSchema;
    inPorts: Port[];
    outPorts: Port[];
};
export interface TransformersAppStoreState {
    TransformersData: TransformerInfo[];
}

export interface DetailsPropsType {
    isOpen: boolean;
    onClose: () => void;
    onCloseEventHandler: () => void;
    selectedStageId: any;
}

export interface DataSource {
    id: string;
    name: string;
    spec: {
        path: string;
    };
}

export interface Experiment {
    id: string;
    name: string;
}

export interface ProjectAccessType {
    access_level: string;
    id: string;
    user_id: string;
}

export interface SingleProjectData {
    basic: {
        created_at: string;
        created_by: string;
        description: string;
        id: string;
        name: string;
    };
    datasources: DataSource[];
    experiments: Experiment[];
    project_access: ProjectAccessType[];
    tasks: any;
}

export interface DetailsAppStoreState {
    TransformersData: any;
    SingleProjectData?: SingleProjectData;
    ExperimentData?: any;
}
