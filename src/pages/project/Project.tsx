import React, { useEffect, useRef } from 'react';
import './project.scss';
import { Box, Center, Divider, Menu, MenuButton, MenuItem, MenuList, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import useAppStore from '../../store';
import { GetAllProjectsAppStoreState, GetAllProjectsDetail } from '../../models/project';
import { getAndUpdateAllProjectsData } from '../../zustandActions/projectActions';
import SearchComponent from '../../component/search/SearchComponent';
import { DownArrow } from '../../assets/icons';
import CreateProjectModal from '../../component/modalSystem/CreateProjectModal';
import ProjectsViews from './projectsViews';
import { projectsSearch } from '../../utils/common.utils';
import { getAndUpdateAllUsersData } from '../../zustandActions/commonActions';
import { GetAllUsersDataAppStoreState } from '../../models/profile';
import { updateSpinnerInfo } from '../../zustandActions/commonActions';

const Project = () => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const textColor = useColorModeValue('light.header', 'dark.white');
    const tabTextColor = useColorModeValue('default.darkGrayCreate', 'dark.white');
    const textColorPage = useColorModeValue('default.blackText', 'dark.white');
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [UserConfig] = useAppStore((state: any) => [state.UserConfig]);
    const [allProjectsData, setAllProjectsData] = React.useState<GetAllProjectsDetail[]>(AllProjectsData);
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
    const onSearchChange = async (searchValue: string) => {
        if (searchValue.length > 0) {
            const search = await projectsSearch(AllProjectsData, searchValue, AllUsersData);
            setAllProjectsData(search);
        } else {
            setAllProjectsData(AllProjectsData);
        }
    };
    const handleTabsChange = (tabIndex: number) => {
        setTabIndex(tabIndex);
        if (tabIndex === 0) {
            setAllProjectsData(AllProjectsData);
        } else if (tabIndex === 1) {
            const userId = UserConfig.userConfiguration.user.userId;
            const userOnlyProjects = AllProjectsData.filter((project) => {
                return project.created_by === userId;
            });
            setAllProjectsData(userOnlyProjects);
        } else if (tabIndex === 2) {
            const userId = UserConfig.userConfiguration.user.userId;
            const userOnlyProjects = AllProjectsData.filter((project) => {
                return project.created_by !== userId;
            });
            setAllProjectsData(userOnlyProjects);
        }
    };
    useEffect(() => {
        if (AllProjectsData === null) {
            getAndUpdateAllProjectsData();
        } else {
            setAllProjectsData(AllProjectsData);
        }
    }, [AllProjectsData]);

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
                    <Menu>
                        <MenuButton color={'white'} bg={'default.toolbarButton'} width={'166px'} height={'36px'} borderRadius={'3'}>
                            {' '}
                            <Center>
                                <Text> Create Project</Text>
                                <Divider className="insideButtonDivider" orientation="vertical" h="36px" ml={'12'} mr={'12'} />

                                <DownArrow color={'white'} />
                            </Center>
                        </MenuButton>
                        <MenuList borderRadius={'0'} width={'165px'} height={'72px'} color={textColor} mt={'-8px'}>
                            <MenuItem onClick={CreateProject.onOpen}>
                                <Text mb={10} pt={4} lineHeight={'16px'}>
                                    Start from scratch
                                </Text>
                            </MenuItem>
                            <MenuItem>
                                <Text mb={4} pt={2}>
                                    Use a template
                                </Text>
                            </MenuItem>
                            <CreateProjectModal isOpen={CreateProject.isOpen} onClose={CreateProject.onClose} onSuccess={onCreateProjectSuccess} isEdit={{ status: false, data: {}, usersData: [] }} />
                        </MenuList>
                    </Menu>
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
