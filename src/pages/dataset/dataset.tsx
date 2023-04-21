import React, { useEffect, useState } from 'react';
import './dataset.scss';
import { Box, Button, Center, Divider, Flex, FormControl, FormLabel, Select, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import SearchComponent from '../../component/search/SearchComponent';
import { DownArrowShare } from '../../assets/icons';
import DatasetViews from './datasetDetails/datasetViews';
import CreateDatasetModal from '../../component/modalSystem/CreateDatasetModal';
import { getAndUpdateAllProjectsData, updateAllProjectsData } from '../../zustandActions/projectActions';
import useAppStore from '../../store';
import { GetAllProjectsAppStoreState, GetAllProjectsDetail } from '../../models/project';
import {
    getProjectAccessList,
    getProjectNameAndLabelsForSelect,
    handleProjectsFilter,
    projectsSearch
} from '../../utils/common.utils';
import { cloneDeep } from 'lodash';
import { getAndUpdateAllUsersData, updateSpinnerInfo } from '../../zustandActions/commonActions';

const Dataset = () => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const projectTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const tabTextColor = useColorModeValue('default.darkGrayCreate', 'dark.white');
    const textColorPage = useColorModeValue('default.blackText', 'dark.white');
    const openCreateDatasetModal = useDisclosure();
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [UserConfig] = useAppStore((state: any) => [state.UserConfig]);
    const [allProjectsData, setAllProjectsData] = React.useState<GetAllProjectsDetail[]>(AllProjectsData);
    const [searchValue, setSearchValue] = React.useState('');
    const [projectNames, setProjectNames] = React.useState([{name: 'All', id: 'All'}]);
    const [projectSelected, setProjectSelected] = useState('');
    const [allUserData, setAllUserData] = React.useState([]);
    const [AllUsersData] = useAppStore((state: any) => [state.AllUsersData]);
    const handleTabsChange = (tabIn: number) => {
        setTabIndex(tabIn);
        if (tabIn === 0) {
            const allData = handleProjectsFilter(UserConfig,  AllProjectsData, 'All', projectSelected );
            setAllProjectsData(allData);
        } else if (tabIn === 1) {
            const userOnlyData = handleProjectsFilter(UserConfig,  AllProjectsData, 'onlyMe', projectSelected );
            setAllProjectsData(userOnlyData);
        } else if (tabIn === 2) {
            const sharedOnlyData = handleProjectsFilter(UserConfig, AllProjectsData, 'sharedWithMe', projectSelected );
            setAllProjectsData(sharedOnlyData);
        }
    };
    const handleProjectChange = (evt: any) => {
        setProjectSelected(evt.target.value);
    };

    useEffect(() => {
        if (projectSelected !== '') {
            handleTabsChange(tabIndex);
        };
    }, [projectSelected]);

    useEffect(() => {
        updateSpinnerInfo(true);
        if (AllProjectsData !== null) {
            setProjectNames([{name: 'All Projects', id: 'All'}, ...getProjectNameAndLabelsForSelect(AllProjectsData)]);
            setProjectSelected('All');
            setAllProjectsData(AllProjectsData);
            updateSpinnerInfo(false);
        }
    }, [AllProjectsData]);

    useEffect(() => {
        getAndUpdateAllProjectsData();
        return () => {updateAllProjectsData(null)}
    }, []);

    useEffect(() => {
        if (AllUsersData === null) {
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        } else {
            setAllUserData(AllUsersData)
        }
    }, [AllUsersData]);

    const onSearchChange = (searchValue: string) => {
        setSearchValue(searchValue);
    };
    return (
        <>
            {
                allProjectsData && AllUsersData &&
                <Box className="dataset-page" marginLeft={50}>
                    <Box fontSize={'24px'} fontWeight={700} mt={'24'} mb={'8'} color={textColorPage}>
                        Dataset
                    </Box>
                    <Stack spacing={4} mb={'24px'}>
                        <Text fontSize={16} noOfLines={[2]} color={textColorPage}>
                            Explore the datasets ingested in DMS with ease, leveraging source references and granular filtering options by project and user.
                        </Text>
                    </Stack>
                    <Flex flexDir={'row'} maxWidth={'294px'}>
                        <FormControl isRequired mr={'20px'}>
                            <FormLabel color={projectTitleColor} fontWeight={600}>
                                Project Name
                            </FormLabel>
                            <Select
                                icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                borderRadius={3}
                                width={'294px'}
                                mb={38}
                                border={'1px'}
                                borderColor={'light.lighterGrayishBlue'}
                                as={Select}
                                id="existingProject"
                                name="existingProject"
                                variant="outline"
                                onChange={handleProjectChange}
                                value={projectSelected}
                            >
                                <>
                                    {projectNames.map((project, projectIndex) => {
                                        return <option key={projectIndex} value={project.id}>{project.name}</option>
                                    })}
                                </>
                            </Select>
                        </FormControl>
                        {/*<FormControl>*/}
                        {/*    <Box>*/}
                        {/*        <FormLabel color={projectTitleColor} fontWeight={600}>*/}
                        {/*            Created by*/}
                        {/*        </FormLabel>*/}
                        {/*        <Select*/}
                        {/*            icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}*/}
                        {/*            borderRadius={3}*/}
                        {/*            width={'294px'}*/}
                        {/*            mb={38}*/}
                        {/*            border={'1px'}*/}
                        {/*            borderColor={'light.lighterGrayishBlue'}*/}
                        {/*            as={Select}*/}
                        {/*            id="userDataset"*/}
                        {/*            name="userDataset"*/}
                        {/*            variant="outline"*/}
                        {/*            validate={(value: any) => {*/}
                        {/*                let error;*/}
                        {/*                if (value.length === 0) {*/}
                        {/*                    error = ' Select here';*/}
                        {/*                }*/}
                        {/*                return error;*/}
                        {/*            }}*/}
                        {/*        >*/}
                        {/*            <>*/}
                        {/*                <option>User 1</option>*/}
                        {/*                <option>User 2</option>*/}
                        {/*            </>*/}
                        {/*        </Select>*/}
                        {/*    </Box>*/}
                        {/*</FormControl>*/}
                    </Flex>
                    <Center mt={-10} flex="3" justifyContent={'flex-end'} zIndex={2}>
                        <Box>
                            <SearchComponent searchChange={onSearchChange}  />
                        </Box>
                        <Stack direction="row" height={'30'} border={'3'}>
                            {' '}
                            <Divider orientation="vertical" ml={'20'} mr={'20'} className={'dividerCss'} />
                        </Stack>

                        <Button color={'white'} bg={'default.toolbarButton'} width={'133px'} height={'36px'} borderRadius={'3'} onClick={openCreateDatasetModal.onOpen}>
                            {' '}
                            <Text fontWeight={600}> Create Dataset</Text>
                        </Button>
                        <CreateDatasetModal isOpen={openCreateDatasetModal.isOpen} onClose={openCreateDatasetModal.onClose} />
                    </Center>
                    <Tabs onChange={handleTabsChange} index={tabIndex} width={'100%'} isLazy mt={-30} colorScheme={'tabsTheme'}>
                        <TabList width={'100%'} color={tabTextColor}>
                            <Tab pb={'14px'} fontWeight={600} pl={10}>
                                All Dataset
                            </Tab>
                            <Tab pb={'14px'} ml={'26'} fontWeight={600}>
                                My Dataset
                            </Tab>
                            <Tab pb={'14px'} ml={'26'} fontWeight={600}>
                                Shared With Me
                            </Tab>
                        </TabList>

                        <TabPanels mr={'10px'} maxHeight="758px">
                            <TabPanel>
                                <DatasetViews data={allProjectsData} search={searchValue} allUsers={AllUsersData} />
                            </TabPanel>
                            <TabPanel>
                                <DatasetViews data={allProjectsData} search={searchValue} allUsers={AllUsersData} />
                            </TabPanel>
                            <TabPanel>
                                <DatasetViews data={allProjectsData} search={searchValue} allUsers={AllUsersData} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            }
        </>
    );
};

export default Dataset;
