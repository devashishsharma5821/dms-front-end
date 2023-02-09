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

export interface AppState {
    i18n: any;
    config: any;
    DmsDatabricksCredentialsValidToken: boolean;
    DmsComputeData: any;
    TransformersData: any;
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
    createdById: string | null;
    computeState: string;
}

export type updateI18N = (translation: {}) => void;
export type updateAppConfig = (config: {}) => void;
export type updateDmsDatabricksCredentialsValidToken = (token: boolean) => void;
export type updateDmsComputeData = (computeData: DmsComputeData[]) => void;
export type updateTransformersData = (transformersData: TransformerInfo[]) => void;
export type updateUserConfig = (UserConfig: []) => void;
export type connectionEstablished = () => void;
export type receiveMessage = (action: any) => void;
export type resetMessages = () => void;
export type hasSubscribed = () => void;
export type disconnected = () => void;
export type startConnecting = () => void;
export type updateCreatedById = (computeId: string) => void;
export type setComputeState = (value: string) => void;
export type getAndUpdateDmsComputeData = () => void;
export type getAndUpdateTransformersData = () => void;
export type submitMessage = (content: any) => void;
