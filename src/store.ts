import create from 'zustand';
import { AppState } from './models/zustandStore';

const useAppStore = create<AppState>((set) => ({
    i18n: {},
    config: {},
    DmsDatabricksCredentialsValidToken: false,
    DmsComputeData: null,
    TransformersData: null,
    AllProjectsData: null,
    SingleProjectData: null,
    UserConfig: [],
    lastAliveMessage: null,
    inferStartedMessaage: null,
    runStageCompleted: null,
    runStageError: null,
    runStageStarted: null,
    runStageData: null,
    shutdownMessage: null,
    inferStageCompleted: null,
    inferStageError: null,
    uncategorizedEvents: [],
    currentRunState: { running: false, lastStageId: null },
    connectionState: { connected: false, subscribed: false },
    message: [],
    computeState: '',
    dbSettingsData: []
}));

export default useAppStore;
