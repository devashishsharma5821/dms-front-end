import client from '../apollo-client';
import { GET_EXPERIMENT } from '../query';
import useAppStore from '../store';
import { getAndUpdateExperimentData as getAndUpdateExperimentDataDataType } from '../models/zustandStore';
import { Experiment, GetExperiment } from '../models/experimentModel';
import { createStandaloneToast } from '@chakra-ui/react';
import { getToastOptions } from '../models/toastMessages';
import { updateSpinnerInfo } from './commonActions';
const { toast } = createStandaloneToast();

export const getAndUpdateExperimentData: getAndUpdateExperimentDataDataType = async (experiment_id: string) => {
    try {
        const response = await client.query<GetExperiment<Experiment>>({
            query: GET_EXPERIMENT(experiment_id.toString())
        });
        useAppStore.setState(() => ({ ExperimentData: response.data.dmsExperiment }));
    } catch (err: any) {
        updateSpinnerInfo(false);
        toast(getToastOptions(err?.message, 'error'));
    }
};
