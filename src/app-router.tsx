import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import Header from '../src/component/header/Header';
import { HomePage, PageNotFound } from './pages';
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
                        <Box w={'50'} bg={useColorModeValue('light.header', 'dark.header')}>
                            <SideBarMenu />
                        </Box>
                        <Box>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/notfound" element={<PageNotFound />} />
                            </Routes>
                        </Box>
                    </Stack>
                </Flex>
            </Suspense>
        </Router>
    );
};
