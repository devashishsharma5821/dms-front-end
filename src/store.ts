import create from 'zustand';
import { Message } from '@antuit/web-sockets-gateway-client';

interface AppState {
    i18n: any;
    config: any;
    DmsDatabricksCredentialsValidToken: boolean;
    DmsComputeStatus: [];
    DmsComputeData: [];
    UserConfig: [];
    updateI18N: (translation: {}) => void;
    updateAppConfig: (config: {}) => void;
    updateDmsDatabricksCredentialsValidToken: (token: boolean) => void;
    updateDmsComputeStatus: (computeStatus: []) => void;
    updateDmsComputeData: (computeData: []) => void;
    updateUserConfig: (UserConfig: []) => void;
}

const useAppStore = create<AppState>((set) => ({
    i18n: {},
    config: {},
    DmsDatabricksCredentialsValidToken: false,
    DmsComputeStatus: [],
    DmsComputeData: [],
    UserConfig: [],
    updateI18N: (translation = {}) => set((state: { i18n: {} }) => ({ i18n: translation })),
    updateAppConfig: (config = {}) => set((state: { config: {} }) => ({ config: config })),
    updateDmsDatabricksCredentialsValidToken: (token) => set(() => ({ DmsDatabricksCredentialsValidToken: token })),
    updateDmsComputeStatus: (ComputeStatus) => set(() => ({ DmsComputeStatus: ComputeStatus })),
    updateDmsComputeData: (ComputeData) => set(() => ({ DmsComputeData: ComputeData })),
    updateUserConfig: (UserConfig) => set(() => ({ UserConfig: UserConfig })),
    submitMessage: (content: Message) => set(() => ({}))
}));

export default useAppStore;
