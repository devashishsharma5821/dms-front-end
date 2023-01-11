export type Stages = Record<string, Stage>;

export type Stage = {
    id: string;
    name: string;
    module_id: string;
    module_conf_schema?: string | null;
    module_conf?: string;
    inputs?: Input;
    outputs?: Output;
    error?: { error_message: string };
};

type Input = ExternalInput | InternalInput;

export type ExternalInput = {
    external: ExternalDataframe | ExternalArtifact | ExternalArtifactPromise;
};
type ExternalDataframe = {
    input_dataframe: {
        id: number;
        checkpoint_id: number;
    };
};
type ExternalArtifact = {
    artifact: {
        run_id: string;
        path: string;
    };
};
type ExternalArtifactPromise = {
    artifact_promise: {
        name: string;
    };
};

export type InternalInput = {
    internal: {
        map: Record<string, { stage_id: string; module_output_id: string }>;
    };
};

type Output = {
    dataframe_specs: Record<string, DataFrameSpec>;
};

type DataFrameSpec = {
    columns: {
        name: string;
        type: string;
        categorical_values?: string[];
    }[];
    attributes?: string;
};
