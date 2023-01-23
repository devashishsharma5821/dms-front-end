import { Dictionary } from './schema';
import { DataTablesRequest, AzureBlobGetContainersRequest, AzureBlobBrowseContainerRequest } from '@antuit/pipeline-interactive-driver-client';
import { PipelineExperimentCore_Input } from '@antuit/pipeline-interactive-driver-client/dms_commons/protobuf/common';
export type BaseRequest = {
    userId: string;
    experimentId: number;
    opId: string;
    project_id: number;
    get_datatables: DataTablesRequest | undefined;
    /** Azure Blob Storage */
    az_blob_get_containers: AzureBlobGetContainersRequest | undefined;
    az_blob_browse_container: AzureBlobBrowseContainerRequest | undefined;
};

export interface InferRunMessageRequest extends BaseRequest {
    stages: Array<InferRunStage>;
    stageId: string;
}

export interface GetStageDataMessageRequest extends BaseRequest {
    stageId: string;
    outputId: string;
}

export interface InferRunStage {
    stageId: string;
    transformerId: string;
    moduleConf: string;
    inputs?: Dictionary<PipelineExperimentCore_Input>;
}

export interface InferRunStageInput {
    stage_id?: string;
    module_output_id?: string;
}

export interface Message {
    action: string;
    payload: {
        op_id: string;
        keep_alive: {};
        shutdown: any;
        experiment: any;
        get_datatables: any;
    };
    subject: string;
}
