import client from '../apollo-client';
import { agGridClickHandler, ComputeDetail, ComputeDetailListResponse, ComputeRun, DbSettingsDetail, GetDbSettingsType, RunComputeDetail } from '../models/computeDetails';
import { getComputeListData, dmsRunCompute, GET_DB_SETTINGS } from '../query';
import useAppStore from '../store';
import {
    getAndUpdateDmsComputeData as getAndUpdateDmsComputesDataType,
    setComputeState as setComputeStateType,
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

export const onPlayClickHandler: agGridClickHandler = async (id, DmsComputeData) => {
    console.log('onPlayClickHandler ===>', id, DmsComputeData);
    const response = await client.mutate<ComputeRun<RunComputeDetail>>({
        mutation: dmsRunCompute(id)
    });

    const newData: any = DmsComputeData.map((computeData: any) => {
        if (id === computeData.id) {
            computeData.status = 'STARTING';
            return computeData;
        }
        if (!(id === computeData.id)) {
            return computeData;
        }
    });
    useAppStore.setState(() => ({ DmsComputeData: newData }));
};

// client
//     .mutate<ComputeRun<RunComputeDetail>>({
//         mutation: dmsRunCompute(id)
//     })
//     .then(() => {
//         // TODO MANULLY UPDATE
//         getAndUpdateDmsComputeData();

//         // TODO : Below toast should be displayed

//         // toast({
//         //     title: `Compute is starting`,
//         //     status: 'success',
//         //     isClosable: true,
//         //     duration: 5000,
//         //     position: 'top-right'
//         // });
//     })
//     .catch((err: any) => {
//         console.log('error ===>', err);
//         // toast({
//         //     title: `${err}`,
//         //     status: 'success',
//         //     isClosable: true,
//         //     duration: 5000,
//         //     position: 'top-right'
//         // });
//     });

export const getAndUpdateDbSettingsData: any = async () => {
    const response = await client.query<GetDbSettingsType<DbSettingsDetail>>({
        query: GET_DB_SETTINGS
    });
    useAppStore.setState(() => ({ dbSettingsData: response.data.dmsDatabricksSettings.node_types }));
    return true;
};

export const DmsRunCompute: dmsRunComputesType = async (id: string) => {
    const response = await client.mutate<ComputeRun<RunComputeDetail>>({ mutation: dmsRunCompute(id) });
};
export const updateDmsComputeData: updateDmsComputeDataType = (ComputeData) => useAppStore.setState(() => ({ DmsComputeData: ComputeData }));
export const setComputeState: setComputeStateType = (value) => useAppStore.setState({ computeState: value });
