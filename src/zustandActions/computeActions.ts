import client from '../apollo-client';
import { ComputeDetail, ComputeDetailListResponse, ComputeRun, RunComputeDetail } from '../models/computeDetails';
import { getComputeListData, dmsRunCompute } from '../query';
import useAppStore from '../store';
import {
    getAndUpdateDmsComputeData as getAndUpdateDmsComputesDataType,
    setComputeState as setComputeStateType,
    updateCreatedById as updateCreatedByIdType,
    updateDmsComputeData as updateDmsComputeDataType,
    dmsRunCompute as dmsRunComputesType
} from '../models/zustandStore';

export const getAndUpdateDmsComputeData: getAndUpdateDmsComputesDataType = async () => {
    const { GET_COMPUTELIST } = getComputeListData();
    const response = await client.query<ComputeDetailListResponse<Array<ComputeDetail>>>({
        query: GET_COMPUTELIST
    });

    useAppStore.setState(() => ({ DmsComputeData: response.data.dmsComputes }));
};
export const DmsRunCompute: dmsRunComputesType = async (id: string) => {
    const response = await client.mutate<ComputeRun<RunComputeDetail>>({ mutation: dmsRunCompute(id) });
};
export const updateDmsComputeData: updateDmsComputeDataType = (ComputeData) => useAppStore.setState(() => ({ DmsComputeData: ComputeData }));
export const updateCreatedById: updateCreatedByIdType = (createdById) => useAppStore.setState(() => ({ createdById: createdById }));
export const setComputeState: setComputeStateType = (value) => useAppStore.setState({ computeState: value });
