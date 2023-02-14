import { KeepAliveRequest } from '@antuit-zebra/pipeline-interactive-driver-client-ts';
import { Message } from '@antuit/web-sockets-gateway-client';
import { BaseRequest } from '../models/messages';

export class BusUtils {
    static GetKeepAliveRequestMessage(request: BaseRequest): Message {
        let keepAliveRequest: KeepAliveRequest = {};
        let msg = new Message();
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
        return msg;
    }
}
