import client from '../apollo-client';
import { GET_ALL_PROJECTS, GET_SINGLE_PROJECT } from '../query';
import useAppStore from '../store';
import {
    getAndUpdateAllProjectsData as getAndUpdateAllProjectsDataType,
    updateAllProjectsData as updateAllProjectsDataType,
    getAndUpdateSingleProjectData as getAndUpdateSingleProjectDataType,
    updateSingleProjectData as updateSingleProjectDataType
} from '../models/zustandStore';
import { GetAllProjects, GetAllProjectsDetail, GetSingleProject, GetSingleProjectDetail } from '../models/project';

export const getAndUpdateAllProjectsData: getAndUpdateAllProjectsDataType = async () => {
    const response = await client.query<GetAllProjects<Array<GetAllProjectsDetail>>>({
        query: GET_ALL_PROJECTS
    });
    useAppStore.setState(() => ({ AllProjectsData: response.data.dmsProjects }));
};
export const updateAllProjectsData: updateAllProjectsDataType = (AllProjectsData) => useAppStore.setState(() => ({ AllProjectsData: AllProjectsData }));

export const getAndUpdateSingleProjectData: getAndUpdateSingleProjectDataType = async (id: string) => {
    const response = await client.query<GetSingleProject<Array<GetSingleProjectDetail>>>({
        query: GET_SINGLE_PROJECT(id)
    });
    useAppStore.setState(() => ({ SingleProjectData: response.data.dmsProject }));
};
export const updateSingleProjectData: updateSingleProjectDataType = (SingleProjectData) => useAppStore.setState(() => ({ SingleProjectData: SingleProjectData }));
