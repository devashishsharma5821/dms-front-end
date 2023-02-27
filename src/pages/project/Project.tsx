import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './project.scss';
import { Avatar, Box, Center, Divider, Flex, Menu, MenuButton, MenuItem, MenuList, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import useAppStore from '../../store';
import { GetAllProjectsAppStoreState, GetAllProjectsDetail } from '../../models/project';
import { getAndUpdateAllProjectsData } from '../../zustandActions/projectActions';
import SearchComponent from '../../component/search/SearchComponent';
import { DownArrow } from '../../assets/icons';
import CreateProjectModal from '../../component/modalSystem/CreateProjectModal';
import ProjectsViews from './projectsViews';

const Project = () => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const textColor = useColorModeValue('light.header', 'dark.white');
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [UserConfig] = useAppStore((state: any) => [state.UserConfig]);
    const [allProjectsData, setAllProjectsData] = React.useState<GetAllProjectsDetail[]>(AllProjectsData);
    const navigate = useNavigate();
    const accessTextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const CreateProject = useDisclosure();
    const onSearchChange = (searchValue: string) => {
      // TODO Manipulate the data to get the search values back
    };
    const handleTabsChange = (tabIndex: number) => {
        setTabIndex(tabIndex);
        if(tabIndex === 0) {
            setAllProjectsData(AllProjectsData);
        } else if(tabIndex === 1) {
            const userId = UserConfig.userConfiguration.user.userId;
            const userOnlyProjects = AllProjectsData.filter((project) => {
               return project.created_by === userId;
            });
            setAllProjectsData(userOnlyProjects);
        } else if(tabIndex === 2) {
            const userId = UserConfig.userConfiguration.user.userId;
            const userOnlyProjects = AllProjectsData.filter((project) => {
                return project.created_by !== userId;
            });
            setAllProjectsData(userOnlyProjects);
        }
    }
    useEffect(() => {
        if (AllProjectsData === null) {
            getAndUpdateAllProjectsData();
        } else {
            setAllProjectsData(AllProjectsData);
            console.log('Here is your Projects Data', AllProjectsData);
        }
    }, [AllProjectsData]);

    const onCreateProjectSuccess = () => {
        getAndUpdateAllProjectsData();
        CreateProject.onClose();
    }
    return (
        <>
            <Box marginLeft={36}>
                <Box fontSize={'24px'} fontWeight={700} ml={'24'} mt={'35'} mb={'24'}>
                    Projects
                </Box>
                <Stack spacing={4}>
                    <Text fontSize="md" ml={'24'} noOfLines={[2]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat. <br />
                        Duis aute irure dolor in reprehenderit in voluptate velit
                    </Text>
                </Stack>
                <Center flex="3" mr={5} justifyContent={'flex-end'} ml={'17'} mb={'-56px'} mt={'30px'} zIndex={2}>
                    <Box>
                        <SearchComponent searchChange={onSearchChange} />
                    </Box>
                    <Stack direction="row" height={'30'} border={'3'}>
                        {' '}
                        <Divider orientation="vertical" ml={'14'} mr={'14'} />
                    </Stack>
                    <Menu>
                        <MenuButton color={'white'} bg={'#2180C2'} width={'165px'} height={'36px'} borderRadius={'3'}>
                            {' '}
                            <Center>
                                <Text> Create Project</Text>
                                <Divider orientation="vertical" ml={'12'} mr={'12'} colorScheme="black" size="4px" />
                                <DownArrow color={'white'} />
                            </Center>
                        </MenuButton>
                        <MenuList borderRadius={'0'} width={'195px'} height={'72px'} color={textColor} ml={'-16'}>
                            <MenuItem mt={'5px'} onClick={CreateProject.onOpen}>
                                <Text ml={'12'}>Start from scratch</Text>
                            </MenuItem>
                            <MenuItem>
                                <Text ml={'12'}>Use a template</Text>
                            </MenuItem>
                            <CreateProjectModal isOpen={CreateProject.isOpen} onClose={CreateProject.onClose} onSuccess={onCreateProjectSuccess} isEdit={{status: false, data: {}}}  />
                        </MenuList>
                    </Menu>
                </Center>
                <Tabs index={tabIndex} onChange={handleTabsChange} width={'96%'} isLazy>
                    <TabList ml={'44px'} mt={'34px'} width={'100%'}>
                        <Tab>All Projects</Tab>
                        <Tab ml={'26'}>My Projects</Tab>
                        <Tab ml={'26'}>Shared With Me</Tab>
                    </TabList>

                    <TabPanels ml={'44px'} mr={'10px'}>
                        <TabPanel>
                            <ProjectsViews data={allProjectsData}></ProjectsViews>
                        </TabPanel>
                        <TabPanel>
                            <ProjectsViews data={allProjectsData}></ProjectsViews>
                        </TabPanel>
                        <TabPanel>
                            <ProjectsViews data={allProjectsData}></ProjectsViews>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    );
};

export default Project;
