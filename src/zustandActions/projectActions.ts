import client from '../apollo-client';
import { GET_ALL_PROJECTS, GET_SINGLE_DATASET, GET_SINGLE_PROJECT } from '../query';
import useAppStore from '../store';
import {
    getAndUpdateAllProjectsData as getAndUpdateAllProjectsDataType,
    updateAllProjectsData as updateAllProjectsDataType,
    getAndUpdateSingleProjectData as getAndUpdateSingleProjectDataType,
    getAndUpdateSingleDatasetData as getAndUpdateSingleDatasetDataType,
    updateSingleProjectData as updateSingleProjectDataType,
    updateSingleDatasetDataType
} from '../models/zustandStore';
import { GetAllProjects, GetAllProjectsDetail, GetSingleProject, GetSingleProjectDetail } from '../models/project';
import { createStandaloneToast } from '@chakra-ui/react';
import { getToastOptions } from '../models/toastMessages';
import { GetSingleDataset, GetSingleDatasetAppStoreState } from '../models/dataset';
const { toast } = createStandaloneToast();

export const getAndUpdateAllProjectsData: getAndUpdateAllProjectsDataType = async () => {
    const response = await client.query<GetAllProjects<Array<GetAllProjectsDetail>>>({
        query: GET_ALL_PROJECTS
    });
    if (response.errors?.length) {
        toast(getToastOptions(response.errors[0].message, 'error'));
    }
    useAppStore.setState(() => ({ AllProjectsData: response.data.dmsProjects }));
};
export const updateAllProjectsData: updateAllProjectsDataType = (AllProjectsData) => useAppStore.setState(() => ({ AllProjectsData: AllProjectsData }));

export const getAndUpdateSingleProjectData: getAndUpdateSingleProjectDataType = async (id: string) => {
    const response = await client.query<GetSingleProject<Array<GetSingleProjectDetail>>>({
        query: GET_SINGLE_PROJECT(id)
    });
    if (response.errors?.length) {
        toast(getToastOptions(response.errors[0].message, 'error'));
    }
    useAppStore.setState(() => ({ SingleProjectData: response?.data?.dmsProject }));
};
export const updateSingleProjectData: updateSingleProjectDataType = (SingleProjectData: any) => useAppStore.setState(() => ({ SingleProjectData: SingleProjectData }));

export const getAndUpdateSingleDatasetData: getAndUpdateSingleDatasetDataType = async (id: string) => {
    const response = await client.query<GetSingleDataset<Array<GetSingleDatasetAppStoreState>>>({
        query: GET_SINGLE_DATASET(id)
    });
    if (response.errors?.length) {
        toast(getToastOptions(response.errors[0].message, 'error'));
    }
    useAppStore.setState(() => ({ DatasetDetailData: response?.data?.dmsDataSource }));
};
export const updateSingleDatasetData: updateSingleDatasetDataType = (DatasetDetailData: any) => useAppStore.setState(() => ({ DatasetDetailData: DatasetDetailData }));
