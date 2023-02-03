import create from 'zustand';
import { Message } from '@antuit/web-sockets-gateway-client';
import client from './apollo-client';
import { ComputeDetail, ComputeDetailListResponse } from './models/computeDetails';
import { AppState } from './models/zustandStore';
import { getComputeListData } from './query';

const useAppStore = create<AppState>((set) => ({
    i18n: {},
    config: {},
    DmsDatabricksCredentialsValidToken: false,
    DmsComputeData: null,
    UserConfig: [],
    lastAliveMessage: null,
    inferStartedMessaage: null,
    runStageCompleted: null,
    runStageError: null,
    runStageStarted: null,
    runStageData: null,
    shutdownMessage: null,
    createdById: null,
    inferStageCompleted: null,
    inferStageError: null,
    uncategorizedEvents: [],
    currentRunState: { running: false, lastStageId: null },
    connectionState: { connected: false, subscribed: false },
    message: [],

    computeState: ''
    // updateI18N: (translation = {}) => set((state: { i18n: {} }) => ({ i18n: translation })),
    // updateAppConfig: (config = {}) => set((state: { config: {} }) => ({ config: config })),
    // updateDmsDatabricksCredentialsValidToken: (token) => set(() => ({ DmsDatabricksCredentialsValidToken: token })),
    // updateDmsComputeData: (ComputeData) => set(() => ({ DmsComputeData: ComputeData })),
    // updateUserConfig: (UserConfig) => set(() => ({ UserConfig: UserConfig })),
    // submitMessage: (content: Message) => set(() => ({ message: content })),
    // getAndUpdateDmsComputeData: async () => {
    //     const { GET_COMPUTELIST } = getComputeListData();
    //     const response = await client.query<ComputeDetailListResponse<Array<ComputeDetail>>>({
    //         query: GET_COMPUTELIST
    //     });

    //     set(() => ({ DmsComputeData: response.data.dmsComputes }));
    // },
    // //     set(() => {
    // //         console.log('inside getAndUpdateDmsComputeData');
    // //         const { GET_COMPUTELIST } = getComputeListData();
    // //         let ComputeData;
    // //         client
    // //             .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
    // //                 query: GET_COMPUTELIST
    // //             })
    // //             .then((response: any) => {
    // //                 console.log('inside getAndUpdateDmsComputeData response', [...response.data.dmsComputes]);
    // //                 ComputeData = [...response.data.dmsComputes];
    // //                 console.log('ComputeData----', ComputeData);
    // //                 // return { DmsComputeData: [...response.data.dmsComputes] };
    // //             })
    // //             .catch((err) => console.log(err));
    // //         console.log('ComputeData----', ComputeData);
    // //         return { DmsComputeData: ComputeData };
    // //     }),
    // connectionEstablished: () =>
    //     set(() => {
    //         console.log('connection established');
    //         return { connectionState: { connected: true, subscribed: false } };
    //     }),
    // receiveMessage: (action: any) =>
    //     set((state: any) => {
    //         let event = action;
    //         if (event.payload) {
    //             if (event.payload.alive) {
    //                 return { lastAliveMessage: event.payload.alive };
    //             } else if (event.payload.started) {
    //                 console.log('started:');
    //                 console.log(event.payload.started);
    //                 return { inferStartedMessaage: event.payload.started };
    //             }
    //             // Below is the new code for Experiments from event payload.
    //             else if (event.payload.experiment) {
    //                 console.log('Experiment New');
    //                 console.log(event.payload.experiment);
    //                 if (event.payload.experiment.infer_stage_completed) {
    //                     console.log('completed:');
    //                     console.log(event.payload.experiment.infer_stage_completed);
    //                     return { inferStageCompleted: event.payload.experiment.infer_stage_completed };
    //                 } else if (event.payload.experiment.infer_stage_error) {
    //                     console.log('error:');
    //                     console.log(event.payload.experiment.infer_stage_error);
    //                     return { inferStageError: event.payload.experiment.infer_stage_error };
    //                 } else if (event.payload.experiment.run_started) {
    //                     return { currentRunState: { running: true, lastStageId: null } };
    //                 } else if (event.payload.experiment.run_stage_started) {
    //                     console.log('run stage started:');
    //                     console.log(event.payload.experiment.run_stage_started);
    //                     return { runStageStarted: event.payload.experiment.run_stage_started, currentRunState: { running: true, lastStageId: event.payload.experiment.run_stage_started.stage_id } };
    //                 } else if (event.payload.experiment.run_stage_completed) {
    //                     console.log('run stage completed:');
    //                     console.log(event.payload.experiment.run_stage_completed);
    //                     return {
    //                         runStageCompleted: event.payload.experiment.run_stage_completed,
    //                         currentRunState: { running: true, lastStageId: event.payload.experiment.run_stage_completed.stage_id }
    //                     };
    //                 } else if (event.payload.experiment.run_stage_data) {
    //                     console.log('run stage data:');
    //                     console.log(event.payload.experiment.run_stage_data);

    //                     return { runStageData: event.payload.experiment.run_stage_data };
    //                 } else if (event.payload.experiment.run_stage_error) {
    //                     console.log('run stage error:');
    //                     console.log(event.payload.experiment.run_stage_error);
    //                     return { runStageError: event.payload.experiment.run_stage_error };
    //                 } else if (event.payload.experiment.run_cancelled || event.payload.experiment.run_completed) {
    //                     return { currentRunState: { running: false, lastStageId: null } };
    //                 }
    //             }
    //             // Below is the new code for Datatables from event payload.
    //             else if (event.payload.datatables) {
    //                 console.log('Datatables New');
    //                 console.log(event.payload.experiment);
    //             } else if (event.payload.shutdown) {
    //                 console.log('shutdown:');
    //                 console.log(event.payload.shutdown);
    //                 return { shutdownMessage: event.payload.shutdown };
    //             } else {
    //                 console.log('uncategorized event');
    //                 console.log(event);
    //                 return state.uncategorizedEvents.push(event);
    //             }
    //         }
    //     }),
    // resetMessages: () =>
    //     set(() => ({
    //         inferStartedMessaage: null,
    //         inferStageCompleted: null,
    //         runStageStarted: null,
    //         runStageCompleted: null,
    //         runStageData: null,
    //         runStageError: null,
    //         inferStageError: null,
    //         currentRunState: { running: false, lastStageId: null }
    //     })),
    // hasSubscribed: () => set(() => ({ connectionState: { connected: true, subscribed: true } })),
    // disconnected: () => set(() => ({ connectionState: { connected: false, subscribed: false } })),
    // startConnecting: () => set(() => ({})),
    // updateCreatedById: (createdById: string) => set(() => ({ createdById: createdById })),
    // setComputeState: (value: string) => set({ computeState: value })
}));

export default useAppStore;
