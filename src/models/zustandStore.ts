import { Message } from '@antuit/web-sockets-gateway-client';
import { DmsComputeData } from './computeDetails';
import {
    AliveEvent,
    Event,
    StartedEvent,
    InferOutputStageCompletedEvent,
    InferOutputStageErrorEvent,
    RunStageStartedEvent,
    RunStageCompletedEvent,
    RunStageErrorEvent,
    RunStageDataEvent,
    ShutdownEvent
} from '@antuit-zebra/pipeline-interactive-driver-client-ts';
import { TransformerInfo } from './transformer';
import { GetAllProjectsDetail, GetSingleProjectDetail } from './project';
import { AllUsers } from './profile';
import { AnyRecord } from 'dns';
import { Experiment } from './experimentModel';

export interface AppState {
    i18n: any;
    config: any;
    AllUsersData: any;
    ExperimentData: any;
    DmsDatabricksCredentialsValidToken: boolean;
    DmsComputeData: any;
    DmsSingleComputeData: any;
    TransformersData: any;
    AllProjectsData: any;
    SingleProjectData: any;
    DatasetDetailData: any;
    UserConfig: [];
    lastAliveMessage: AliveEvent | null;
    inferStartedMessaage: StartedEvent | null;
    runStageCompleted: RunStageCompletedEvent | null;
    runStageError: RunStageErrorEvent | null;
    inferStageCompleted: InferOutputStageCompletedEvent | null;
    inferStageError: InferOutputStageErrorEvent | null;
    currentRunState: { running: boolean; lastStageId: string | null };
    runStageStarted: RunStageStartedEvent | null;
    uncategorizedEvents: Message<Event>[];
    shutdownMessage: ShutdownEvent | null;
    connectionState: { connected: boolean; subscribed: boolean };
    message: Array<Message> | [];
    runStageData: RunStageDataEvent | null;
    computeState: string;
    dbSettingsData: any;
    spinnerInfo: boolean;
    selectedStageId: any;
    selectedTransformer: any;
    selectedCellId: any;
    stages: any;
}

export type updateI18N = (translation: {}) => void;
export type updateAppConfig = (config: {}) => void;
export type updateAllUsersData = (allUsersData: AllUsers[]) => void;
export type updateExperimentData = (experimentData: Experiment) => void;
export type updateDmsDatabricksCredentialsValidToken = (token: boolean) => void;
export type updateDmsComputeData = (computeData: DmsComputeData[]) => void;
export type updateDmsSingleComputeData = (computeSingleData: any) => void;
export type updateTransformersData = (transformersData: TransformerInfo[]) => void;
export type updateAllProjectsData = (projectsData: GetAllProjectsDetail[]) => void;
export type updateSingleProjectData = (projectData: any) => void;
export type updateSingleDatasetDataType = (projectData: any) => void;

export type updateUserConfig = (UserConfig: []) => void;
export type connectionEstablished = () => void;
export type receiveMessage = (action: any) => void;
export type resetMessages = () => void;
export type hasSubscribed = () => void;
export type disconnected = () => void;
export type startConnecting = () => void;
export type getAndUpdateAllUsersData = (variables: any) => void;
export type getAndUpdateExperimentData = (experiment_id: string) => void;
export type setComputeState = (value: string) => void;
export type getAndUpdateDmsComputeData = () => void;
export type getAndUpdateDmsSingleComputeData = (computeId: string) => void;
export type getAndUpdateDbSettingsData = () => void;
export type getAndUpdateTransformersData = () => void;
export type getAndUpdateAllProjectsData = () => void;
export type getAndUpdateSingleProjectData = (id: string) => void;
export type getAndUpdateSingleDatasetData = (id: string) => void;
export type submitMessage = (content: any) => void;
export type dmsRunCompute = (id: string) => void;
export type updateSpinnerInfo = (spinnerInfo: boolean) => void;
export type updateSelectedStageId = (stageId: any) => void;
export type updateSelectedTransformer = (stageId: any) => void;
export type addStages = (stage: any) => void;
export type updateSelectedCellId = (cellId: string) => void;
