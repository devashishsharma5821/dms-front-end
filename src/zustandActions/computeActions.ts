import client from '../apollo-client';
import {
    agGridClickHandler,
    ComputeDetail,
    ComputeDetailListResponse,
    ComputeDetailSingleListResponse,
    ComputeRun,
    DbSettingsDetail,
    GetDbSettingsType,
    RunComputeDetail
} from '../models/computeDetails';
import { getComputeListData, dmsRunCompute, GET_DB_SETTINGS, getSingleComputeData } from '../query';
import useAppStore from '../store';
import {
    getAndUpdateDmsComputeData as getAndUpdateDmsComputesDataType,
    getAndUpdateDmsSingleComputeData as getAndUpdateDmsSingleComputesDataType,
    setComputeState as setComputeStateType,
    updateDmsComputeData as updateDmsComputeDataType,
    updateDmsSingleComputeData as updateDmsSingleComputeDataType,
    dmsRunCompute as dmsRunComputesType
} from '../models/zustandStore';

import { createStandaloneToast } from '@chakra-ui/react';
import { updateSpinnerInfo } from './commonActions';
import { getToastOptions } from '../models/toastMessages';
const { toast } = createStandaloneToast();

export const getAndUpdateDmsComputeData: getAndUpdateDmsComputesDataType = async () => {
    const { GET_COMPUTELIST } = getComputeListData();
    const response = await client.query<ComputeDetailListResponse<Array<ComputeDetail>>>({
        query: GET_COMPUTELIST
    });
    useAppStore.setState(() => ({ DmsComputeData: response.data.dmsComputes }));
};

export const getAndUpdateDmsSingleComputeData: getAndUpdateDmsSingleComputesDataType = async (computeId: string) => {
    const response = await client.query<ComputeDetailSingleListResponse<ComputeDetail>>({
        query: getSingleComputeData(computeId)
    });
    useAppStore.setState(() => ({ DmsSingleComputeData: response.data.dmsCompute }));
};

export const onPlayClickHandler: agGridClickHandler = async (id) => {
    let runComputeId: any;
    if (typeof id === 'object') {
        runComputeId = id.id;
    } else {
        runComputeId = id;
    }
    try {
        const response = await client.mutate<ComputeRun<RunComputeDetail>>({
            mutation: dmsRunCompute(runComputeId)
        });
        response && toast(getToastOptions(`Compute is Starting`, 'success'));
        useAppStore.setState((state) => ({
            DmsComputeData: state.DmsComputeData.map((computeData: any) => {
                if (runComputeId === computeData.id) {
                    computeData.status = 'STARTING';
                    return computeData;
                }
                if (!(runComputeId === computeData.id)) {
                    return computeData;
                }
            })
        }));
    } catch (error: any) {
        toast(getToastOptions(`${error.message}`, 'error'));
    }
};

export const getAndUpdateDbSettingsData: any = async () => {
    try {
        const response = await client.query<GetDbSettingsType<DbSettingsDetail>>({
            query: GET_DB_SETTINGS
        });
        updateSpinnerInfo(false);
        useAppStore.setState(() => ({ dbSettingsData: response.data.dmsDatabricksSettings.node_types }));
        return true;
    } catch (error: any) {
        toast(getToastOptions(`${error.message}`, 'error'));
        updateSpinnerInfo(false);
        return false;
    }
};

export const DmsRunCompute: dmsRunComputesType = async (id: string) => {
    await client.mutate<ComputeRun<RunComputeDetail>>({ mutation: dmsRunCompute(id) });
};
export const updateDmsComputeData: updateDmsComputeDataType = (ComputeData) => useAppStore.setState(() => ({ DmsComputeData: ComputeData }));
export const updateDmsSingleComputeData: updateDmsSingleComputeDataType = (SingleComputeData) => useAppStore.setState(() => ({ DmsSingleComputeData: SingleComputeData }));
export const setComputeState: setComputeStateType = (value) => useAppStore.setState({ computeState: value });
