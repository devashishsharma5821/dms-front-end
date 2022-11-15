import create from 'zustand';

interface AppState {
  i18n: {},
  config: {},
  updateI18N: (translation: {}) => void,
  updateAppConfig: (config: {}) => void
}

const useAppStore = create<AppState>((set) => ({
  i18n: {},
  config: {},
  updateI18N: (translation={}) => set((state: {i18n: {}}) => ({ i18n: translation })),
  updateAppConfig: (config={}) => set((state:  {config: {}}) => ({ config: config }))
}))

export default useAppStore;