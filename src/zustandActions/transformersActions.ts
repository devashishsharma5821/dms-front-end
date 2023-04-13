import client from '../apollo-client';
import { dmsEditExperiment, getTransformersData } from '../query';
import useAppStore from '../store';
import {
    getAndUpdateTransformersData as getAndUpdateTransformersDataType,
    updateTransformersData as updateTransformersDataType,
    updateSelectedStageId as updateSelectedStageIdType,
    updateSelectedTransformer as updateSelectedTransformerType,
    addStages as addStagesType,
    updateSelectedCellId as updateSelectedCellIdType
} from '../models/zustandStore';
import { TransformerListResponse } from '../models/transformerListResponse';
import { TransformerDetail } from '../models/transformerDetail';
import { StageHelper } from '../helpers/StageHelper';
import { StageStatus } from '../models/types';
import { Dictionary } from '../models/schema';
import { g } from '@antuit/rappid-v1';
import { getToastOptions } from '../models/toastMessages';
import { createStandaloneToast } from '@chakra-ui/react';
const { toast } = createStandaloneToast();

export const getAndUpdateTransformersData: getAndUpdateTransformersDataType = async () => {
    const { GET_TRANSFORMERS } = getTransformersData();
    const response = await client.query<TransformerListResponse<Array<TransformerDetail>>>({
        query: GET_TRANSFORMERS
    });

    useAppStore.setState(() => ({ TransformersData: response.data.dmsTransformers }));
};

export const updateTransformersData: updateTransformersDataType = (TransformersData) => useAppStore.setState(() => ({ TransformersData: TransformersData }));

export const updateSelectedStageId: updateSelectedStageIdType = (stageId: any) => useAppStore.setState(() => ({ selectedStageId: stageId }));
export const updateSelectedCellId: updateSelectedCellIdType = (CellId: any) => useAppStore.setState(() => ({ selectedCellId: CellId }));

export const updateSelectedTransformer: updateSelectedTransformerType = (stageId: any) => {
    useAppStore.setState((state: any) => {
        const transformer = state.TransformersData.find((transformer: any) => transformer?.id === stageId);
        return { selectedTransformer: Object.create(transformer) };
    });
};

export const addStages: addStagesType = (stage: any) =>
    useAppStore.setState((state: any) => {
        if (stage?.stageId && state?.stages?.some((stage: any) => stage?.id === stage?.stageId)) {
        } else {
            if (!state.stages) {
                state.stages = [];
            }

            const newStage = {
                id: stage?.stageId,
                name: stage?.name,
                transformerId: stage?.transformerId,
                outputs: stage?.outputs?.map((output: any) => {
                    return {
                        id: output?.id,
                        isValid: false,
                        signature: '',
                        inferredOutput: StageHelper.ioDefaultPopulate(output)
                    };
                }),
                inputs: stage?.inputs?.map((input: any) => {
                    return {
                        id: input?.id,
                        isConnected: false,
                        isValid: false,
                        connectedStageId: '',
                        connectedStageOutputId: '',
                        connectedStageOutputSignature: ''
                    };
                }),
                status: StageStatus.Invalid,
                hasRun: false,
                expandedSchema: stage?.schema,
                signature: ''
            };

            state?.stages?.push(newStage);
            return state;
        }
    });

export const updateGraph = async (graph: any) => {
    let experimentToSave: any = {
        id: '',
        name: '',
        tags: null,
        description: '',
        stages: []
    };
    useAppStore.setState((state: any) => {
        let currentStages: any;

        let inputsPosition: Dictionary<g.PlainPoint> = {};
        let extractedPorts: any;
        let extractedPortsIdArray: any = [];

        graph?.getCells().map((cell: any) => {
            if (cell.get('type') === 'standard.Link') {
                let [port1, port2] = extractedPortsIdArray;
                let source = cell.get('source');
                let target = cell.get('target');
                let port = cell.get('_byId');
                inputsPosition[`${source.id}.${port1}-${target.id}.${port2}`] = cell.position();
            }
            let stageId = cell.get('id');
            if (cell?.attributes?.type !== 'standard.Link') {
                let stage = state?.stages?.find((st: any) => st.id === stageId);
                if (stageId && stage) {
                    let stageInputs = stage.inputs?.map((input: any) => {
                        return {
                            id: input.id,
                            isConnected: input.isConnected,
                            connectedStageId: input.connectedStageId,
                            connectedStageOutputId: input.connectedStageOutputId,
                            position: inputsPosition[`${input.connectedStageId}.${input.connectedStageOutputId}-${stageId}.${input.id}`]
                        };
                    });
                    let stageOutput = stage.outputs?.map((output: any) => {
                        return {
                            id: output.id,
                            isValid: output.isValid,
                            inferredOutput: output.inferredOutput,
                            signature: output.signature
                        };
                    });
                    experimentToSave.stages.push({
                        id: cell.id.toString(),
                        transformerId: stage.transformerId,
                        name: stage.name,
                        inputs: stageInputs,
                        outputs: stageOutput,
                        formData: stage.formState?.currentForm.formData,
                        status: stage.status,
                        signature: stage.signature,
                        position: cell.position()
                    });
                }
            }
        });

        experimentToSave.id = state.ExperimentData.id;
        experimentToSave.name = state.ExperimentData.name;
        experimentToSave.description = state.ExperimentData.description;
        experimentToSave.tags = state.ExperimentData.tags;

        return {
            updatedGraph: experimentToSave
        };
    });

    let newGeneratedObj: any = {};

    experimentToSave.stages.map((stage: any) => {
        if (stage.inputs.length > 0) {
            newGeneratedObj[stage.id] = {
                id: stage.id,
                name: stage.name,
                module_id: '',
                module_conf: '',
                inputs: {
                    [stage.inputs[0].id]: {
                        intermediate: {}
                    }
                }
                // display: {
                //     [stage.id]: stage.position
                // }
            };
        } else {
            newGeneratedObj[stage.id] = {
                id: stage.id,
                name: stage.name,
                module_id: '',
                module_conf: ''
                // display: {
                //     [stage.id]: stage.position
                // }
            };
        }
    });

    let newStages = {
        stages: newGeneratedObj
    };

    let stages: any = JSON.stringify(newStages);
    experimentToSave.stages = stages;

    try {
        const response = await client.mutate<any>({
            mutation: dmsEditExperiment(experimentToSave)
        });

        console.log('lets check response ===>', response);
    } catch (error: any) {
        toast(getToastOptions(`${error.message}`, 'error'));
    }
};
