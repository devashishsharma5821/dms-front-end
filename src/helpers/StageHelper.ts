import { InferredOutput, InputOutputType, StageInputOutput, StageState } from '../models/types';
import { JSONSchemaExpander } from '../../src/temp/json_schema_expander';
import { cloneDeep } from 'lodash';
import { Md5 } from 'ts-md5';

export class StageHelper {
    static ioDefaultPopulate(connection: StageInputOutput): InferredOutput {
        let inferredOutput: InferredOutput;
        switch (connection.type) {
            case InputOutputType.Dataset:
                inferredOutput = {
                    kind: InputOutputType.Dataset,
                    spec: {
                        dataframes: {},
                        files: {}
                    }
                };
                break;
            case InputOutputType.Model:
                inferredOutput = {
                    kind: InputOutputType.Model,
                    spec: {
                        model_dict: ''
                    }
                };
                break;
            default:
            case InputOutputType.Dataframe:
                inferredOutput = {
                    kind: InputOutputType.Dataframe,
                    spec: {
                        columns: [],
                        signature: ''
                    }
                };
                break;
        }

        return inferredOutput;
    }

    // IMPORTANT:
    // This function should be in-sync with the DMS PID (dms_pid.src.stage_cache.get_stage_signature)
    static getStageSignature(stageId: string, stages: Array<StageState>): string {
        let signature = '';
        let stage = stages.find((stage) => stage.id === stageId);
        if (stage) {
            let inputs = new Array<string>();
            if (stage.inputs && stage.inputs.length > 0) {
                stage.inputs.forEach((input) => {
                    let connectedStage = stages.find((stage) => stage.id === input.connectedStageId);
                    if (connectedStage) {
                        inputs.push(`${input.id}=${connectedStage.signature}.${input.connectedStageOutputId}`);
                    }
                });
            }

            inputs.sort();
            let signatureContent = inputs.join('|') + '|';

            let expander = new JSONSchemaExpander({});
            let moduleConf = JSON.stringify(expander.filter_empties(cloneDeep(stage?.formState?.currentForm?.formData)));

            signatureContent += `${stage.transformerId}|${moduleConf}`;
            signature = Md5.hashStr(signatureContent);
        }
        return signature;
    }
}
