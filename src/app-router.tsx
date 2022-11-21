import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import Header from '../src/component/header/Header';
import { HomePage, PageNotFound, Notebook, Compute, Project, ExperimentsPage } from './pages';
import { Box, Flex, Stack, useColorModeValue } from '@chakra-ui/react';
import SideBarMenu from './component/sideBarMenu/SideBarMenu';

export const AppRouter = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Header />
                <Flex overflowY={'hidden'}>
                        {/*Replace Below Box with Side Bar Component*/}
                            <SideBarMenu />
                            <Routes>
                                <Route path="/" element={<PageNotFound />} />
                                <Route path="/home" element={<HomePage />} />
                                <Route path="/experiment" element={<ExperimentsPage />} />
                                <Route path="/notfound" element={<PageNotFound />} />
                                <Route path="/notebook" element={<Notebook />} />
                                <Route path="/compute" element={<Compute />} />
                                <Route path="/project" element={<Project />} />
                            </Routes>
                </Flex>
            </Suspense>
        </Router>
    );
};
