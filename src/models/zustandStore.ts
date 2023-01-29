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
} from '@antuit/pipeline-interactive-driver-client-ts';

export interface AppState {
    i18n: any;
    config: any;
    DmsDatabricksCredentialsValidToken: boolean;
    DmsComputeData: any;
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
    message: Message | {};
    runStageData: RunStageDataEvent | null;
    createdById: string | null;
    computeState: string;
    updateI18N: (translation: {}) => void;
    updateAppConfig: (config: {}) => void;
    updateDmsDatabricksCredentialsValidToken: (token: boolean) => void;
    updateDmsComputeData: (computeData: DmsComputeData[]) => void;
    updateUserConfig: (UserConfig: []) => void;
    connectionEstablished: () => void;
    receiveMessage: (action: any) => void;
    resetMessages: () => void;
    hasSubscribed: () => void;
    disconnected: () => void;
    startConnecting: () => void;
    updateCreatedById: (computeId: string) => void;
    setComputeState: (value: string) => void;
    getAndUpdateDmsComputeData: () => void;
}
