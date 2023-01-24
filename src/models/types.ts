import { DataframeSpec, DatasetSpec, ModelSpec } from '@antuit/pipeline-interactive-driver-client-ts/dms_commons/protobuf/common';
import { Schema } from './schema';
import { dia, g } from '@antuit/rappid-v1';

export type StagePayload = {
    stageId: string;
    name: string;
    currentForm?: any;
    transformerId: string;
    outputs: Array<StageInputOutput>;
    inputs: Array<StageInputOutput>;
    schema: Schema;
};

export type StageInputOutput = {
    id: string;
    name: string;
    type: InputOutputType;
};

export enum InputOutputType {
    Dataframe = 'DATAFRAME',
    Dataset = 'DATASET',
    Model = 'MODEL',
    Metadata = 'METADATA'
}

export type FormPayload = {
    stageId: string;
    currentForm?: any;
};

export type StageDataModelProps = {
    modalSettings: ModalSettings;
    stageId: string;
    userId: string;
    experimentId: string;
    reset?: Function;
};

export type SettingsModalProps = {
    modalSettings: ModalSettings;
    onPidStart?: Function | undefined;
    message?: string;
    pidStatus?: { started: boolean };
    experimentId?: string;
    hideCancel?: boolean;
    onSubmitCallback?: Function;
};

export type PidManagerProps = {
    experimentId: string | undefined;
};

export type ModalSettings = {
    openModal: boolean;
};

export type InferredOutput = { kind: InputOutputType.Dataframe; spec: DataframeSpec } | { kind: InputOutputType.Dataset; spec: DatasetSpec } | { kind: InputOutputType.Model; spec: ModelSpec };

export type StageHasRunPayload = {
    stageId: string;
    hasRun: boolean;
};

export type StageSignaturePayload = {
    stageId: string;
    stageSignature: string;
};

export type InputOutputPayload = {
    stageId: string;
    inputOutputs: Array<InputOutput>;
};

export type InputOutput = {
    id: string;
    signature: string;
    inferredOutput: InferredOutput;
    isValid: boolean;
};

export type SingleInputOutput = {
    stageId: string;
    inputOutputId: string;
};

export type SingleInputOutputPayload = {
    fromStage: SingleInputOutput;
    toStage: SingleInputOutput;
};

export type ExpandSchemaPayload = {
    stageId: string;
};

export type FormsState = {
    currentForm: any;
};

export type StageInputState = {
    id: string;
    isConnected: boolean;
    isValid: boolean;
    connectedStageId: string;
    connectedStageOutputId: string;
    connectedStageOutputSignature: string;
};

export type StageOutputState = {
    id: string;
    isValid: boolean;
    inferredOutput: InferredOutput;
    signature: string;
};

export type StageState = {
    id: string;
    transformerId: string;
    name: string;
    inputs?: Array<StageInputState>;
    outputs: Array<StageOutputState>;
    formState?: FormsState;
    status: StageStatus;
    expandedSchema: string;
    hasRun: boolean;
    signature: string;
};

export type StatusPayload = {
    stageId: string;
    status: StageStatus;
};

export type StageExpandSchema = {
    stageId: string;
    schema: Schema;
};

export type StageExpandedSchema = {
    stageId: string;
    expandedSchema: string;
};

export type StageProps = {
    name: string;
    id: string;
    removeCell: Function;
    experimentId: string | undefined;
    isRestoring: boolean;
};

export enum StageStatus {
    Valid = 'Valid',
    Invalid = 'Invalid',
    Warning = 'Warning',
    Pending = 'Pending'
}

export type PipelineState = {
    stages?: Array<StageState>;
    graph?: dia.Graph;
};

export type PersistedStageInput = {
    id: string;
    isConnected: boolean;
    connectedStageId: string;
    connectedStageOutputId: string;
    position?: g.PlainPoint;
};

export type PersistedStageOutput = {
    id: string;
    isValid: boolean;
    inferredOutput: InferredOutput;
    signature: string;
};

export type PersistedStage = {
    id: string;
    transformerId: string;
    name: string;
    inputs?: Array<PersistedStageInput>;
    outputs: Array<PersistedStageOutput>;
    formData?: any;
    status: StageStatus;
    signature: string;
    position?: g.PlainPoint;
};

export type PersistedExperiment = {
    stages: PersistedStage[];
};

export type Link = {
    id: string;
    port: string;
};

export type CodeEditorOutput = {
    imports: string;
    code: string;
};

export enum InferStatus {
    NotStarted = 'NotStarted',
    Started = 'Started',
    Completed = 'Completed',
    Error = 'Error'
}

export interface DataBricksTokenDetails {
    valid: boolean;
    defined: boolean;
}

export interface dmsCreateCompute {
    compute_name: string;
    worker_type_id: string;
    workers: number;
    spot_instances: boolean;
    terminate_after: boolean;
    max_inactivity_min: number;
    min_workers: number;
    max_workers: number;
    enableAutoscaling: boolean;
}

export interface dmsCreateComputeOffEnableAutoscalingValues {
    id?: string;
    compute_name: string;
    worker_type_id: string;
    workers: number;
    spot_instances: boolean;
    terminate_after: boolean;
    max_inactivity_min: number;
}

export interface dmsCreateComputeOnEnableAutoscalingValues {
    id?: string;
    compute_name: string;
    worker_type_id: string;
    spot_instances: boolean;
    terminate_after: boolean;
    max_inactivity_min: number;
    min_workers: number;
    max_workers: number;
}

export interface COMPUTE_MODAL_PROPS {
    isOpen: boolean;
    onClose: () => void;
    isEdit?: boolean | undefined;
}
export interface dbSettingstype {
    __typename: String;
    node_type_id: String;
    memory_mb: Number;
    num_cores: Number;
    category: String;
}

export interface dmsCreateComputeCommonEnableAutoscalingValues {
    compute_name: string;
    enableAutoScalingConditional: {
        enable_autoscaling: boolean;
        max_workers: boolean;
        min_workers: boolean;
        workers: boolean;
    };
    spot_instances: boolean;
    terminateAfterConditional: {
        max_inactivity_min: number;
        terminate_after: boolean;
    };
    worker_type_id: string;
}
