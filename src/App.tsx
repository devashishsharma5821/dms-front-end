import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashboard/dashboard';

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
