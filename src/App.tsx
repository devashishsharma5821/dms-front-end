import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const DashboardPage = lazy(() => import('./pages/dashboard/dashboard'));

const App = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default App;
