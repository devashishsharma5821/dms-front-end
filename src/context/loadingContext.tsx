import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext<any>({
    loading: false,
    setLoading: null
});

export function LoadingProvider({ children }: any) {
    const [loading, setLoading] = useState(false);
    const value: any = { loading, setLoading };
    return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider');
    }
    return context;
}
