import client from '../apollo-client';
import { GET_EXPERIMENT } from '../query';
import useAppStore from '../store';
import {
    getAndUpdateExperimentData as getAndUpdateExperimentDataDataType
} from '../models/zustandStore';
import { Experiment, GetExperiment } from '../models/experimentModel';

export const getAndUpdateExperimentData: getAndUpdateExperimentDataDataType = async (experiment_id: string) => {
    const response = await client.query<GetExperiment<Experiment>>({
        query: GET_EXPERIMENT(experiment_id.toString())
    });
    useAppStore.setState(() => ({ ExperimentData: response.data.dmsExperiment }));
};
