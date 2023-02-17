import client from '../apollo-client';
import { GET_ALL_PROJECTS } from '../query';
import useAppStore from '../store';
import {
    getAndUpdateAllProjectsData as getAndUpdateAllProjectsDataType,
    updateAllProjectsData as updateAllProjectsDataType
} from '../models/zustandStore';
import { GetAllProjects, GetAllProjectsDetail } from '../models/project';

export const getAndUpdateAllProjectsData: getAndUpdateAllProjectsDataType = async () => {
    const response = await client.query<GetAllProjects<Array<GetAllProjectsDetail>>>({
        query: GET_ALL_PROJECTS
    });
    useAppStore.setState(() => ({ AllProjectsData: response.data.dmsProjects }));
};
export const updateAllProjectsData: updateAllProjectsDataType = (AllProjectsData) => useAppStore.setState(() => ({ AllProjectsData: AllProjectsData }));
