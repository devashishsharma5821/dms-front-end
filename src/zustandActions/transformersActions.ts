import client from '../apollo-client';
import { getTransformersData } from '../query';
import useAppStore from '../store';
import {
    getAndUpdateTransformersData as getAndUpdateTransformersDataType,
    updateTransformersData as updateTransformersDataType
} from '../models/zustandStore';
import { TransformerListResponse } from '../models/transformerListResponse';
import { TransformerDetail } from '../models/transformerDetail';

export const getAndUpdateTransformersData: getAndUpdateTransformersDataType = async () => {
    const { GET_TRANSFORMERS } = getTransformersData();
    const response = await client.query<TransformerListResponse<Array<TransformerDetail>>>({
        query: GET_TRANSFORMERS
    });

    useAppStore.setState(() => ({ TransformersData: response.data.dmsTransformers }));
};
export const updateTransformersData: updateTransformersDataType = (TransformersData) => useAppStore.setState(() => ({ TransformersData: TransformersData }));
