import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import Header from '../src/component/header/Header';
import { HomePage, PageNotFound, Notebook, Compute, Project, ExperimentsPage, ProjectDetails, ComputeDetails } from './pages';
import { Box, Flex } from '@chakra-ui/react';
import SideBarMenu from './component/sideBarMenu/SideBarMenu';
import { User } from './models/profile';
import { ContextCompute } from './context/computeContext';
import SocketWrapper from './component/SocketWrapper';
import { ToastProvider } from '@chakra-ui/react';

export const AppRouter = (props: any) => {
    const user = props.user as User;

    return (
        <>
            <Router basename="/v3-dms">
                <Suspense fallback={<div>Loading...</div>}>
                    <Header firstName={user?.firstName} lastName={user?.lastName} email={user?.email} />
                    <Box height = {'100vh'} width = {'100vw'} overflow={'hidden'} flexDirection="column">
                        <SideBarMenu />
                        <SocketWrapper>
                            <ContextCompute>
                                <Box overflow={'hidden'}>
                                    <ToastProvider />
                                    <Routes>
                                        <Route path="/" element={<PageNotFound />} />
                                        <Route path="/home" element={<HomePage />} />
                                        <Route path="/experiment" element={<ExperimentsPage />} />
                                        <Route path="/notfound" element={<PageNotFound />} />
                                        <Route path="/notebook" element={<Notebook />} />
                                        <Route path="/compute" element={<Compute />} />
                                        <Route path="/project" element={<Project />} />
                                        <Route path="/projectDetails/:projectId" element={<ProjectDetails />} />
                                        <Route path="/computedetails/:computeId" element={<ComputeDetails />} />
                                    </Routes>
                                </Box>
                            </ContextCompute>
                        </SocketWrapper>
                    </Box>
                </Suspense>
            </Router>
        </>
    );
};
