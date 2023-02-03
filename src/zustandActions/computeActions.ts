import client from '../apollo-client';
import { ComputeDetail, ComputeDetailListResponse, ComputeRun, RunComputeDetail } from '../models/computeDetails';
import { getComputeListData, dmsRunCompute } from '../query';
import gql from 'graphql-tag';
import useAppStore from '../store';
import {
    getAndUpdateDmsComputeData as getAndUpdateDmsComputesDataType,
    setComputeState as setComputeStateType,
    updateCreatedById as updateCreatedByIdType,
    updateDmsComputeData as updateDmsComputeDataType
} from '../models/zustandStore';

export const getAndUpdateDmsComputeData: getAndUpdateDmsComputesDataType = async () => {
    const { GET_COMPUTELIST } = getComputeListData();
    const response = await client.query<ComputeDetailListResponse<Array<ComputeDetail>>>({
        query: GET_COMPUTELIST
    });

    useAppStore.setState(() => ({ DmsComputeData: response.data.dmsComputes }));
};
export const DmsRunCompute: any = async (id: string) => {
    const mutation = gql` 
        mutation {
            dmsRunCompute(  
               id: "${id}"  
                  ) {
                    job_id,
                    job_run_id
                  }
            }`;
    const response = await client.mutate<ComputeRun<RunComputeDetail>>({ mutation: dmsRunCompute(id) });
};
export const updateDmsComputeData: updateDmsComputeDataType = (ComputeData) => useAppStore.setState(() => ({ DmsComputeData: ComputeData }));
export const updateCreatedById: updateCreatedByIdType = (createdById) => useAppStore.setState(() => ({ createdById: createdById }));
export const setComputeState: setComputeStateType = (value) => useAppStore.setState({ computeState: value });
