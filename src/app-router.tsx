import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import Header from '../src/component/header/Header';
import { HomePage, PageNotFound, Notebook, Compute, Project, ExperimentsPage, ProjectDetails, ComputeDetails, Dataset } from './pages';
import { Box, Spinner } from '@chakra-ui/react';
import SideBarMenu from './component/sideBarMenu/SideBarMenu';
import { User } from './models/profile';
import { ContextCompute } from './context/computeContext';
import SocketWrapper from './component/SocketWrapper';
import { ToastProvider } from '@chakra-ui/react';
import useAppStore from './store';

export const AppRouter = (props: any) => {
    const [spinnerInfo] = useAppStore((state: any) => [state.spinnerInfo]);
    const user = props.user as User;
    return (
        <Box className={'mainPageWrapper'}>
            <Router basename="/v3-dms">
                <Suspense fallback={<div>Loading...</div>}>
                    <Header firstName={user?.firstName} lastName={user?.lastName} email={user?.email} />
                    <Box flexDirection="column">
                        <SideBarMenu />
                        {spinnerInfo && (
                            <div className="spinnerContainer">
                                <Spinner className="spinner" size="xl" thickness="4px" />
                            </div>
                        )}
                        <SocketWrapper>
                            <ContextCompute>
                                <Box>
                                    <ToastProvider />
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/compute" />}></Route>
                                        <Route path="/home" element={<HomePage />} />
                                        <Route path="/experiment/:experimentId" element={<ExperimentsPage />} />
                                        <Route path="/notfound" element={<PageNotFound />} />
                                        <Route path="/notebook" element={<Notebook />} />
                                        <Route path="/compute" element={<Compute />} />
                                        <Route path="/project" element={<Project />} />
                                        <Route path="/projectDetails/:projectId" element={<ProjectDetails />} />
                                        <Route path="/computedetails/:computeId" element={<ComputeDetails />} />
                                        <Route path="/dataset" element={<Dataset />} />
                                    </Routes>
                                </Box>
                            </ContextCompute>
                        </SocketWrapper>
                    </Box>
                </Suspense>
            </Router>
        </Box>
    );
};
