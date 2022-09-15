import { Dictionary } from "./schema";

export type BaseRequest = {
    userId: string;
    experimentId: number;
    opId: string;
}

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
    inputs?: Dictionary<InferRunStageInput>;
}

export interface InferRunStageInput{
    stage_id: string;
    module_output_id: string;
}