import { Request, InferOutputRequest, GetStageDataRequest, GetRunStatusRequest, KeepAliveRequest } from '@antuit/pipeline-interactive-driver-client-ts';
import { Message, Action } from '@antuit/web-sockets-gateway-client';
import { dia } from '@antuit/rappid-v1';
import { BaseRequest, GetStageDataMessageRequest, InferRunMessageRequest, InferRunStage } from '../models/messages';
import TransformerModel from '../models/transformerModal';
// import { JSONSchemaExpander } from '../temp/json_schema_expander';
import { StageState, StageStatus } from '../models/types';
import { cloneDeep } from 'lodash';

export class BusHelper {
    // static GetInferOutputRunRequestMessage(request: InferRunMessageRequest, isInfer: boolean): Message<Request> {
    //     // When you hit submit on the right side form
    //     let inferOrRunRequest: InferOutputRequest = {
    //         // experiment_id: request.experimentId,
    //         stage_id: request.stageId,
    //         experiment_core: {
    //             stages: {},
    //             variables: {},
    //             inputs: {}
    //         }
    //     };

    //     request.stages.forEach((stage) => {
    //         if (inferOrRunRequest?.experiment_core) {
    //             inferOrRunRequest.experiment_core.stages[stage.stageId] = {
    //                 id: stage.stageId,
    //                 module_conf: stage.moduleConf,
    //                 module_id: stage.transformerId,
    //                 // TODO InferOutputRequest and InferRunMessageRequest both type are defined in package file have different inputs type, which are giving conflicts.
    //                 // inputs: stage?.inputs ? stage?.inputs : {},
    //                 inputs: {},
    //                 name: stage.transformerId
    //             };
    //         }
    //     });

    //     let msg = new Message<Request>();
    //     msg.action = Action.Publish;
    //     msg.subject = `dms_pid.in.${request.userId}`;
    //     msg.payload = {
    //         op_id: request.opId,
    //         keep_alive: undefined,
    //         shutdown: undefined,
    //         experiment: {
    //             experiment_id: request.experimentId,
    //             infer_output: isInfer ? inferOrRunRequest : undefined,
    //             // TODO start_run and inferOrRunRequest both type are defined in package file, which are giving conflicts.
    //             // start_run: !isInfer ? inferOrRunRequest : undefined,
    //             start_run: undefined,
    //             get_run_status: undefined,
    //             get_stage_data: undefined,
    //             cancel_run: undefined,
    //             close: undefined
    //         },
    //         data: {
    //             project_id: request.project_id,
    //             get_datatables: request.get_datatables,
    //             az_blob_get_containers: request.az_blob_get_containers,
    //             az_blob_browse_container: request.az_blob_browse_container
    //         }
    //     };
    //     return msg;
    // }

    static GetRunStatusRequestMessage(request: BaseRequest): Message<Request> {
        let runStatus: GetRunStatusRequest = {};

        let msg = new Message<Request>();
        msg.action = Action.Publish;
        msg.subject = `dms_pid.in.${request.userId}`;
        msg.payload = {
            op_id: request.opId,
            keep_alive: undefined,
            shutdown: undefined,
            experiment: {
                experiment_id: request.experimentId,
                infer_output: undefined,
                start_run: undefined,
                get_run_status: runStatus,
                get_stage_data: undefined,
                cancel_run: undefined,
                close: undefined
            },
            data: {
                project_id: request.project_id,
                get_datatables: request.get_datatables,
                az_blob_get_containers: request.az_blob_get_containers,
                az_blob_browse_container: request.az_blob_browse_container
            }
        };
        return msg;
    }

    static GetStageDataRequestMessage(request: GetStageDataMessageRequest): Message<Request> {
        let getDataRequest: GetStageDataRequest = {
            stage_id: request.stageId,
            output_id: request.outputId
        };

        let msg = new Message<Request>();
        msg.action = Action.Publish;
        msg.subject = `dms_pid.in.${request.userId}`;
        msg.payload = {
            op_id: request.opId,
            keep_alive: undefined,
            shutdown: undefined,
            experiment: {
                experiment_id: request.experimentId,
                infer_output: undefined,
                start_run: undefined,
                get_run_status: undefined,
                get_stage_data: getDataRequest,
                cancel_run: undefined,
                close: undefined
            },
            data: {
                project_id: request?.project_id,
                get_datatables: request?.get_datatables,
                az_blob_get_containers: request?.az_blob_get_containers,
                az_blob_browse_container: request?.az_blob_browse_container
            }
        };
        return msg;
    }

    static GetKeepAliveRequestMessage(request: BaseRequest): Message<Request> {
        let keepAliveRequest: KeepAliveRequest = {};
        let msg = new Message<Request>();
        msg.action = Action.Publish;
        msg.subject = `dms_pid.in.${request.userId}`;
        msg.payload = {
            op_id: request.opId,
            keep_alive: keepAliveRequest,
            shutdown: undefined,
            experiment: undefined,
            data: {
                project_id: request.project_id,
                get_datatables: request.get_datatables,
                az_blob_get_containers: request.az_blob_get_containers,
                az_blob_browse_container: request.az_blob_browse_container
            }
        };
        return msg;
    }

    static GetShutdownRequestMessage(request: BaseRequest): Message<Request> {
        let msg = new Message<Request>();
        msg.action = Action.Publish;
        msg.subject = `dms_pid.in.${request.userId}`;
        msg.payload = {
            op_id: request.opId,
            keep_alive: undefined,
            shutdown: {},
            experiment: undefined,
            data: {
                project_id: request.project_id,
                get_datatables: request.get_datatables,
                az_blob_get_containers: request.az_blob_get_containers,
                az_blob_browse_container: request.az_blob_browse_container
            }
        };
        return msg;
    }

    // static getInferRunStages(state: StageState, graph: dia.Graph, currentStages: Array<StageState>, formData: any): Array<InferRunStage> {
    //     let stages = new Array<InferRunStage>();
    //     let expander = new JSONSchemaExpander({});
    //     if (formData && Object.keys(formData).length > 0 && state && graph) {
    //         // Push previous stages
    //         let currentCell = graph.getCells().find((cell: dia.Cell) => cell.get('id') === state.id);
    //         if (currentCell && currentCell.isElement()) {
    //             let predecessors = graph.getPredecessors(currentCell as dia.Element);

    //             if (predecessors && currentStages) {
    //                 predecessors.forEach((pre) => {
    //                     if (pre instanceof TransformerModel) {
    //                         let existingStage = currentStages.find((stage) => stage.id === pre.get('id'));
    //                         if (existingStage) {
    //                             let preStage: InferRunStage = {
    //                                 stageId: existingStage.id,
    //                                 transformerId: existingStage.transformerId,
    //                                 moduleConf: JSON.stringify(expander.filter_empties(cloneDeep(existingStage?.formState?.currentForm?.formData))),
    //                                 inputs: {}
    //                             };
    //                             if (existingStage.inputs) {
    //                                 existingStage.inputs.forEach((inp) => {
    //                                     if (preStage.inputs && inp.connectedStageId !== '') {
    //                                         preStage.inputs[inp.id] = {
    //                                             stage_id: inp.connectedStageId,
    //                                             module_output_id: inp.connectedStageOutputId
    //                                         };
    //                                     }
    //                                 });
    //                             }
    //                             stages.push(preStage);
    //                         }
    //                     }
    //                 });
    //             }
    //             // Push current stage
    //             let currentStage: InferRunStage = {
    //                 stageId: state.id,
    //                 transformerId: state.transformerId,
    //                 moduleConf: JSON.stringify(expander.filter_empties(cloneDeep(formData))),
    //                 inputs: {}
    //             };
    //             if (state?.inputs) {
    //                 state.inputs.forEach((inp) => {
    //                     if (currentStage.inputs && inp.connectedStageId !== '') {
    //                         currentStage.inputs[inp.id] = {
    //                             stage_id: inp.connectedStageId,
    //                             module_output_id: inp.connectedStageOutputId
    //                         };
    //                     }
    //                 });
    //             }

    //             stages.push(currentStage);
    //         }
    //     }

    //     return stages;
    // }

    // static getAllInferRunStages(currentStages: Array<StageState>): Array<InferRunStage> {
    //     let stages = new Array<InferRunStage>();
    //     let expander = new JSONSchemaExpander({});
    //     currentStages.forEach((stage) => {
    //         if (stage.status === StageStatus.Valid || stage.status === StageStatus.Warning) {
    //             let currentStage: InferRunStage = {
    //                 stageId: stage.id,
    //                 transformerId: stage.transformerId,
    //                 moduleConf: JSON.stringify(expander.filter_empties(cloneDeep(stage?.formState?.currentForm?.formData))),
    //                 inputs: {}
    //             };
    //             if (stage?.inputs) {
    //                 stage.inputs.forEach((inp) => {
    //                     if (currentStage.inputs && inp.connectedStageId !== '') {
    //                         currentStage.inputs[inp.id] = {
    //                             stage_id: inp.connectedStageId,
    //                             module_output_id: inp.connectedStageOutputId
    //                         };
    //                     }
    //                 });
    //             }
    //             stages.push(currentStage);
    //         }
    //     });

    //     return stages;
    // }
}
