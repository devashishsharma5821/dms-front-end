import React, { useEffect } from 'react';
import './project.scss';
import { Box, Button, Center, Divider, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import useAppStore from '../../store';
import { GetAllProjectsAppStoreState, GetAllProjectsDetail } from '../../models/project';
import { getAndUpdateAllProjectsData } from '../../zustandActions/projectActions';
import SearchComponent from '../../component/search/SearchComponent';
// import { DownArrow } from '../../assets/icons';
import CreateProjectModal from '../../component/modalSystem/CreateProjectModal';
import ProjectsViews from './projectDetails/projectsViews';
import { handleProjectsFilter, projectsSearch } from '../../utils/common.utils';
import { getAndUpdateAllUsersData } from '../../zustandActions/commonActions';
import { GetAllUsersDataAppStoreState } from '../../models/profile';
import { updateSpinnerInfo } from '../../zustandActions/commonActions';
import TickIcon from '../../assets/icons/TickIcon';

const Project = () => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const tabTextColor = useColorModeValue('default.darkGrayCreate', 'dark.white');
    const textColorPage = useColorModeValue('default.blackText', 'dark.white');
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [UserConfig] = useAppStore((state: any) => [state.UserConfig]);
    const [allProjectsData, setAllProjectsData] = React.useState<GetAllProjectsDetail[]>(AllProjectsData);
    const [searchValue, setSearchValue] = React.useState('');
    const CreateProject = useDisclosure();
    const [AllUsersData] = useAppStore((state: GetAllUsersDataAppStoreState) => [state.AllUsersData]);
    useEffect(() => {
        if (AllUsersData === null) {
            updateSpinnerInfo(true);
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        } else {
            updateSpinnerInfo(false);
        }
    }, [AllUsersData]);
    const onSearchChange = (searchVl: string) => {
        if (searchVl.length > 0) {
            setSearchValue(searchVl);
            setTabContents(searchVl);
        } else {
            setSearchValue('');
            setTabContents('');
        }
    };
    const setTabContents = async (searchVl: string) => {
        if (tabIndex === 0) {
            const search = await projectsSearch(AllProjectsData, searchVl, AllUsersData);
            setAllProjectsData(search);
        } else if (tabIndex === 1) {
            const userOnlyData = handleProjectsFilter(UserConfig, AllProjectsData, 'onlyMe');
            const search = await projectsSearch(userOnlyData, searchVl, AllUsersData);
            setAllProjectsData(search);
        } else {
            const sharedOnlyData = handleProjectsFilter(UserConfig, AllProjectsData, 'sharedWithMe');
            const search = await projectsSearch(sharedOnlyData, searchVl, AllUsersData);
            setAllProjectsData(search);
        }
    };
    const handleTabsChange = (tabIn: number) => {
        setTabIndex(tabIn);
        if (tabIn === 0) {
            const search = projectsSearch(AllProjectsData, searchValue, AllUsersData);
            setAllProjectsData(search);
        } else if (tabIn === 1) {
            const userOnlyData = handleProjectsFilter(UserConfig, AllProjectsData, 'onlyMe');
            const search = projectsSearch(userOnlyData, searchValue, AllUsersData);
            setAllProjectsData(search);
        } else if (tabIn === 2) {
            const sharedOnlyData = handleProjectsFilter(UserConfig, AllProjectsData, 'sharedWithMe');
            const search = projectsSearch(sharedOnlyData, searchValue, AllUsersData);
            setAllProjectsData(search);
        }
    };
    useEffect(() => {
        if (AllProjectsData?.length) {
            setAllProjectsData(AllProjectsData);
            updateSpinnerInfo(false);
        }
    }, [AllProjectsData]);

    useEffect(() => {
        getAndUpdateAllProjectsData();
    }, []);

    const onCreateProjectSuccess = () => {
        getAndUpdateAllProjectsData();
        CreateProject.onClose();
    };
    return (
        <>
            <Box className="project-page" marginLeft={50}>
                <Box fontSize={'24px'} fontWeight={700} mt={'24'} mb={'8'} color={textColorPage}>
                    Projects
                </Box>
                <Stack spacing={4} mb={38}>
                    <Text fontSize={14} noOfLines={[2]} color={textColorPage}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat. <br />
                        Duis aute irure dolor in reprehenderit in voluptate velit
                    </Text>
                </Stack>

                <Center mt={-20} flex="3" justifyContent={'flex-end'} zIndex={2}>
                    <Box>
                        <SearchComponent searchChange={onSearchChange} />
                    </Box>
                    <Stack direction="row" height={'30'} border={'3'}>
                        {' '}
                        <Divider orientation="vertical" ml={'20'} mr={'20'} className={'dividerCss'} />
                    </Stack>
                    <Button onClick={CreateProject.onOpen} color={'white'} bg={'default.toolbarButton'} width={'128px'} height={'36px'} borderRadius={'3'}>
                        Create Project
                    </Button>
                    {/*<Menu>*/}
                    {/*    <MenuButton color={'white'} bg={'default.toolbarButton'} width={'166px'} height={'36px'} borderRadius={'3'}>*/}
                    {/*        {' '}*/}
                    {/*        <Center>*/}
                    {/*            <Text> Create Project</Text>*/}
                    {/*            <Divider className="insideButtonDivider" orientation="vertical" h="36px" ml={'12'} mr={'12'} />*/}

                    {/*            <DownArrow color={'white'} />*/}
                    {/*        </Center>*/}
                    {/*    </MenuButton>*/}
                    {/*    <MenuList borderRadius={'0'} width={'165px'} maxHeight={'72px'} color={textColor} mt={'-8px'} pt={'0px'} pb={'0px'}>*/}
                    {/*        <MenuItem onClick={CreateProject.onOpen} pt={'0px'}>*/}
                    {/*            <Text>Start from scratch</Text>*/}
                    {/*        </MenuItem>*/}
                    {/*        <MenuItem pt={'0px'} pb={'0px'}>*/}
                    {/*            <Text mb={4} pt={2}>*/}
                    {/*                Use a template*/}
                    {/*            </Text>*/}
                    {/*        </MenuItem>*/}
                    {/*        <CreateProjectModal isOpen={CreateProject.isOpen} onClose={CreateProject.onClose} onSuccess={onCreateProjectSuccess} isEdit={{ status: false, data: {}, usersData: [] }} />*/}
                    {/*    </MenuList>*/}
                    {/*</Menu>*/}
                    {CreateProject.isOpen && (
                        <CreateProjectModal isOpen={CreateProject.isOpen} onClose={CreateProject.onClose} onSuccess={onCreateProjectSuccess} isEdit={{ status: false, data: {}, usersData: [] }} />
                    )}
                </Center>
                <Tabs index={tabIndex} onChange={handleTabsChange} width={'100%'} isLazy mt={-30} colorScheme={'tabsTheme'}>
                    <TabList width={'100%'} color={tabTextColor}>
                        <Tab pb={'14px'} fontWeight={600} pl={10}>
                            All Projects
                        </Tab>
                        <Tab pb={'14px'} ml={'26'} fontWeight={600}>
                            My Projects
                        </Tab>
                        <Tab pb={'14px'} ml={'26'} fontWeight={600}>
                            Shared With Me
                        </Tab>
                    </TabList>
                    {AllUsersData && allProjectsData && (
                        <TabPanels mr={'10px'} maxHeight="758px">
                            <TabPanel>
                                <ProjectsViews data={allProjectsData} AllUsersData={AllUsersData}></ProjectsViews>
                            </TabPanel>
                            <TabPanel>
                                <ProjectsViews data={allProjectsData} AllUsersData={AllUsersData}></ProjectsViews>
                            </TabPanel>
                            <TabPanel>
                                <ProjectsViews data={allProjectsData} AllUsersData={AllUsersData}></ProjectsViews>
                            </TabPanel>
                        </TabPanels>
                    )}
                </Tabs>
            </Box>
        </>
    );
};

export default Project;
