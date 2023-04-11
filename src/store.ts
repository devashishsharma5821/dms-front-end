import create from 'zustand';
import { AppState } from './models/zustandStore';

const useAppStore = create<AppState>((set) => ({
    i18n: {},
    config: {},
    DmsDatabricksCredentialsValidToken: false,
    AllUsersData: null,
    DmsComputeData: null,
    DmsSingleComputeData: null,
    ExperimentData: null,
    TransformersData: null,
    AllProjectsData: null,
    SingleProjectData: null,
    DatasetDetailData: null,
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
    dbSettingsData: [],
    toastMessage: {},
    spinnerInfo: false,
    selectedStageId: null,
    selectedCellId: null,
    selectedTransformer: null,
    stages: []
}));

export default useAppStore;
