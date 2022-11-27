import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import Header from '../src/component/header/Header';
import { HomePage, PageNotFound, Notebook, Compute, Project, ExperimentsPage } from './pages';
import { Box, Flex } from '@chakra-ui/react';
import SideBarMenu from './component/sideBarMenu/SideBarMenu';

export const AppRouter = ({ user }: any) => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Header firstName={user?.firstName} lastName={user?.lastName}/>
                <Flex overflowY={'hidden'}>
                            <SideBarMenu />
                            <Box ml={54}>
                            <Routes>
                                <Route path="/" element={<PageNotFound />} />
                                <Route path="/home" element={<HomePage />} />
                                <Route path="/experiment" element={<ExperimentsPage />} />
                                <Route path="/notfound" element={<PageNotFound />} />
                                <Route path="/notebook" element={<Notebook />} />
                                <Route path="/compute" element={<Compute />} />
                                <Route path="/project" element={<Project />} />
                            </Routes>
                            </Box>
                </Flex>
            </Suspense>
        </Router>
    );
};
