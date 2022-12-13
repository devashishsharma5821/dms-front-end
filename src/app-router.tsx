import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import Header from '../src/component/header/Header';
import { HomePage, PageNotFound, Notebook, Compute, Project, ExperimentsPage } from './pages';
import { Box, Flex } from '@chakra-ui/react';
import SideBarMenu from './component/sideBarMenu/SideBarMenu';
import {User} from './models/profile';

export const AppRouter = (props: any) => {
    const user = props.user as User;
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Header firstName={user?.firstName} lastName={user?.lastName}  email={user?.email}/>
                <Flex overflowY={'hidden'}>
                            <SideBarMenu />
                            <Box m={'auto'} >
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
