import useAppStore from '../store';
import {
    submitMessage as submitMessageType,
    connectionEstablished as connectionEstablishedType,
    receiveMessage as receiveMessageType,
    resetMessages as resetMessagesType,
    hasSubscribed as hasSubscribedType,
    disconnected as disconnectedType,
    startConnecting as startConnectingType,
    AppState
} from '.././models/zustandStore';
export const submitMessage: submitMessageType = (content) => useAppStore.setState(() => ({ message: content }));
export const connectionEstablished: connectionEstablishedType = () =>
    useAppStore.setState(() => {
        return { connectionState: { connected: true, subscribed: false } };
    });
export const receiveMessage: receiveMessageType = (action) =>
    useAppStore.setState((state: any) => {
        let event = action;
        if (event.payload) {
            if (event.payload.alive) {
                return { lastAliveMessage: event.payload.alive };
            } else if (event.payload.started) {
                console.log('started:');
                console.log(event.payload.started);
                return { inferStartedMessaage: event.payload.started };
            }
            // Below is the new code for Experiments from event payload.
            else if (event.payload.experiment) {
                console.log('Experiment New');
                console.log(event.payload.experiment);
                if (event.payload.experiment.infer_stage_completed) {
                    console.log('completed:');
                    console.log(event.payload.experiment.infer_stage_completed);
                    return { inferStageCompleted: event.payload.experiment.infer_stage_completed };
                } else if (event.payload.experiment.infer_stage_error) {
                    console.log('error:');
                    console.log(event.payload.experiment.infer_stage_error);
                    return { inferStageError: event.payload.experiment.infer_stage_error };
                } else if (event.payload.experiment.run_started) {
                    return { currentRunState: { running: true, lastStageId: null } };
                } else if (event.payload.experiment.run_stage_started) {
                    console.log('run stage started:');
                    console.log(event.payload.experiment.run_stage_started);
                    return { runStageStarted: event.payload.experiment.run_stage_started, currentRunState: { running: true, lastStageId: event.payload.experiment.run_stage_started.stage_id } };
                } else if (event.payload.experiment.run_stage_completed) {
                    console.log('run stage completed:');
                    console.log(event.payload.experiment.run_stage_completed);
                    return {
                        runStageCompleted: event.payload.experiment.run_stage_completed,
                        currentRunState: { running: true, lastStageId: event.payload.experiment.run_stage_completed.stage_id }
                    };
                } else if (event.payload.experiment.run_stage_data) {
                    console.log('run stage data:');
                    console.log(event.payload.experiment.run_stage_data);

                    return { runStageData: event.payload.experiment.run_stage_data };
                } else if (event.payload.experiment.run_stage_error) {
                    console.log('run stage error:');
                    console.log(event.payload.experiment.run_stage_error);
                    return { runStageError: event.payload.experiment.run_stage_error };
                } else if (event.payload.experiment.run_cancelled || event.payload.experiment.run_completed) {
                    return { currentRunState: { running: false, lastStageId: null } };
                }
            }
            // Below is the new code for Datatables from event payload.
            else if (event.payload.datatables) {
                console.log('Datatables New');
                console.log(event.payload.experiment);
            } else if (event.payload.shutdown) {
                console.log('shutdown:');
                console.log(event.payload.shutdown);
                return { shutdownMessage: event.payload.shutdown };
            } else {
                console.log('uncategorized event');
                console.log(event);
                return state.uncategorizedEvents.push(event);
            }
        }
    });
export const resetMessages: resetMessagesType = () =>
    useAppStore.setState(() => ({
        inferStartedMessaage: null,
        inferStageCompleted: null,
        runStageStarted: null,
        runStageCompleted: null,
        runStageData: null,
        runStageError: null,
        inferStageError: null,
        currentRunState: { running: false, lastStageId: null }
    }));
export const hasSubscribed: hasSubscribedType = () => useAppStore.setState(() => ({ connectionState: { connected: true, subscribed: true } }));
export const disconnected: disconnectedType = () => useAppStore.setState(() => ({ connectionState: { connected: false, subscribed: false } }));
export const startConnecting: startConnectingType = () => useAppStore.setState(() => ({}));
