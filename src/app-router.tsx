import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

import { HomePage, PageNotFound } from './pages';

export const AppRouter = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/notfound" element={<PageNotFound />} />
                </Routes>
            </Suspense>
        </Router>
    );
};
