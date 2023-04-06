import client from '../apollo-client';
import { getTransformersData } from '../query';
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
