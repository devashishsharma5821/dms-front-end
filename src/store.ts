import create from 'zustand';
import { AppState } from './models/zustandStore';

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
}));

export default useAppStore;
