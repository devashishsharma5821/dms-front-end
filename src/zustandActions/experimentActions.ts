import client from '../apollo-client';
import { GET_EXPERIMENT } from '../query';
import useAppStore from '../store';
import { getAndUpdateExperimentData as getAndUpdateExperimentDataDataType, updateExperimentSelectedCompute as updateExperimentSelectedComputeType } from '../models/zustandStore';
import { Experiment, GetExperiment } from '../models/experimentModel';
import { createStandaloneToast } from '@chakra-ui/react';
import { getToastOptions } from '../models/toastMessages';
import { updateSpinnerInfo } from './commonActions';
import { disperseMessage } from '../models/messages';
import { Action } from '@antuit/web-sockets-gateway-client';
import { submitMessage } from './socketActions';
const { toast } = createStandaloneToast();

export const getAndUpdateExperimentData: getAndUpdateExperimentDataDataType = async (experiment_id: string) => {
    try {
        const response = await client.query<GetExperiment<Experiment>>({
            query: GET_EXPERIMENT(experiment_id.toString())
        });
        updateSpinnerInfo(false);
        useAppStore.setState(() => ({ ExperimentData: response.data.dmsExperiment }));
    } catch (err: any) {
        updateSpinnerInfo(false);
        toast(getToastOptions(err?.message, 'error'));
    }
};

export const updateExperimentSelectedCompute: updateExperimentSelectedComputeType = (selectedCompute: any) => {
    console.log('lets check selected compute from experiment dropdown ==>', selectedCompute);
    useAppStore.setState(() => {
        const messageQue: Array<disperseMessage> = [];
        messageQue.push({ content: { action: Action?.Subscribe, subject: `dms_pid.out.${selectedCompute?.id}` } });
        submitMessage(messageQue);
        return { experimentSelectedCompute: selectedCompute };
    });
};
