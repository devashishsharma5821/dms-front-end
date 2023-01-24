import { KeepAliveRequest } from '@antuit/pipeline-interactive-driver-client-ts';
import { Message } from '@antuit/web-sockets-gateway-client';
import { dia } from '@antuit/rappid-v1';
import { BaseRequest } from '../models/messages';
//import { BaseRequest, GetStageDataMessageRequest, InferRunMessageRequest, InferRunStage } from '../models/messages';
// import TransformerModel from '../models/transformerModel';
// import { StageState, StageStatus } from '../models/types';
// import { JSONSchemaExpander } from '../temp/json_schema_expander';
// import { cloneDeep } from 'lodash';

export class BusUtils {
    static GetKeepAliveRequestMessage(request: BaseRequest): Message {
        let keepAliveRequest: KeepAliveRequest = {};
        let msg = new Message();
        // msg.id = request.opId;
        msg.payload = {
            subject: `dms_pid.in.${request.userId}.${request.experimentId}`,
            data: {
                op_id: request.opId,
                infer_output: undefined,
                cancel_run: undefined,
                get_run_status: undefined,
                get_stage_data: undefined,
                keep_alive: keepAliveRequest,
                shutdown: undefined,
                start_run: undefined
            }
        };
        // msg.type = MessageType.Publish;

        return msg;
    }
}
