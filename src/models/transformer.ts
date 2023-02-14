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
