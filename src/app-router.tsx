import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import Header from '../src/component/header/Header';
import { HomePage, PageNotFound, Notebook, Compute, Project } from './pages';
import { Box, Flex, Stack, useColorModeValue } from '@chakra-ui/react';
import SideBarMenu from './component/sideBarMenu/SideBarMenu';

export const AppRouter = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Header />
                <Flex h={'95vh'} overflowY={'hidden'}>
                    <Stack direction={'row'}>
                        {/*Replace Below Box with Side Bar Component*/}
                        <Box w={'50'} bg={useColorModeValue('light.header', 'dark.header')}  zIndex="4000">
                            <SideBarMenu />
                        </Box>
                        <Box>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/notfound" element={<PageNotFound />} />
                                <Route path="/notebook" element={<Notebook />} />
                                <Route path="/compute" element={<Compute />} />
                                <Route path="/project" element={<Project />} />
                            </Routes>
                        </Box>
                    </Stack>
                </Flex>
            </Suspense>
        </Router>
    );
};
