import create from 'zustand';

interface AppState {
    i18n: any;
    config: any;
    DmsDatabricksCredentialsValidToken: boolean;
    DmsComputeStatus: [];
    DmsComputeData: [];
    updateI18N: (translation: {}) => void;
    updateAppConfig: (config: {}) => void;
    updateDmsDatabricksCredentialsValidToken: (token: boolean) => void;
    updateDmsComputeStatus: (computeStatus: []) => void;
    updateDmsComputeData: (computeData: []) => void;
}

const useAppStore = create<AppState>((set) => ({
    i18n: {},
    config: {},
    DmsDatabricksCredentialsValidToken: false,
    DmsComputeStatus: [],
    DmsComputeData: [],
    updateI18N: (translation = {}) => set((state: { i18n: {} }) => ({ i18n: translation })),
    updateAppConfig: (config = {}) => set((state: { config: {} }) => ({ config: config })),
    updateDmsDatabricksCredentialsValidToken: (token) => set(() => ({ DmsDatabricksCredentialsValidToken: token })),
    updateDmsComputeStatus: (ComputeStatus) => set(() => ({ DmsComputeStatus: ComputeStatus })),
    updateDmsComputeData: (ComputeData) => set(() => ({ DmsComputeData: ComputeData }))
}));

export default useAppStore;
