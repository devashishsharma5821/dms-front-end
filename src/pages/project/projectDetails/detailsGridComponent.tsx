import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Center, Text, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue, Flex, Stack, Divider, Menu, MenuList, MenuItem, MenuButton, useDisclosure } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import SearchComponent from '../../../component/search/SearchComponent';
import { DownArrow } from '../../../assets/icons';
import ExperimentModal from '../../../component/modalSystem/ExperimentModal';
import CreateDatasetModal from '../../../component/modalSystem/CreateDatasetModal';
import CreateProjectModal from '../../../component/modalSystem/CreateProjectModal';

const ProjectDetailsGrid = (props: any) => {
    const tabTextColor = useColorModeValue('default.darkGrayCreate', 'dark.white');
    const gridRefDataSources = useRef<AgGridReact<any>>(null);
    const gridRefExperiment = useRef<AgGridReact<any>>(null);
    const accesstextColor = useColorModeValue('default.blackText', 'default.whiteText');
    const gridStyle = useMemo(() => ({ height: '300px' }), []);
    const [rowDataDatasources, setRowDataDatasources] = useState<any[]>([]);
    const [rowDataExperiment, setRowDataExperiment] = useState<any[]>([]);
    const [columnDefsDatasource, setColumnDefsDatasource] = useState<ColDef[]>([]);
    const [columnDefsExperiment, setColumnDefsExperiment] = useState<ColDef[]>([]);
    const [tabIndex, setTabIndex] = React.useState(0);
    const navigate = useNavigate();
    const CreateExperiment = useDisclosure();
    const CreateDataset = useDisclosure();
    const CreateProject = useDisclosure();
    const [rowCount, setRowCount] = useState<number | undefined>(0);

    useEffect(() => {
        setColumnDefsDatasource([
            {
                headerName: 'Asset Id',
                field: 'id',
                cellRenderer: renderDatasetId,
                minWidth: 200
            },
            {
                headerName: 'Asset Name',
                field: 'name',
                minWidth: 500
            },
            {
                headerName: 'Asset Spec',
                field: 'spec.path',
                minWidth: 1000
            }
        ]);
        setRowDataDatasources(props.gridData.datasources);
        setColumnDefsExperiment([
            {
                headerName: 'Asset Id',
                field: 'id',
                cellRenderer: renderExperimentId
            },
            {
                headerName: 'Asset Name',
                field: 'name',
                minWidth: 500
            }
        ]);
        setRowDataExperiment(props.gridData.experiments);
    }, [props.gridData]);

    const navigateToExperiment = (id: any) => {
        navigate(`/projectDetails/${props?.projectId}/experiment/${id}`);
    };

    const navigateToDataset = (id: any) => {
        navigate(`/datasetDetails/${id}`);
    };

    const renderExperimentId = (params: any) => {
        return (
            <div style={{ color: 'rgb(3, 135, 176)', cursor: 'pointer' }} onClick={() => navigateToExperiment(params.data.id)}>
                {params.data.id}
            </div>
        );
    };

    const renderDatasetId = (params: any) => {
        return (
            <div style={{ color: 'rgb(3, 135, 176)', cursor: 'pointer' }} onClick={() => navigateToDataset(params.data.id)}>
                {params.data.id}
            </div>
        );
    };
    const handleTabsChange = (tabIndex: number) => {
        setTabIndex(tabIndex);
        if (tabIndex === 0) {
            setRowDataDatasources(props.gridData.datasources);
        } else if (tabIndex === 1) {
            setRowDataExperiment(props.gridData.experiments);
        }
    };
    const onFirstDataRendered = () => {
        gridRefExperiment?.current!?.api?.sizeColumnsToFit();
    };
    const onFirstDataRenderedDataSources = () => {
        gridRefDataSources?.current!?.api?.sizeColumnsToFit();
    };
    const onSearchChange = (searchValue: string) => {
        if (tabIndex === 0) {
            gridRefDataSources?.current!.api.setQuickFilter(searchValue);
            setRowCount(gridRefDataSources?.current!.api.getModel().getRowCount());
        } else if (tabIndex === 1) {
            gridRefExperiment?.current!.api.setQuickFilter(searchValue);
            setRowCount(gridRefExperiment?.current!.api.getModel().getRowCount());
        }
    };

    return (
        <>
            <Box className="project-details-grid-page" marginTop={50} width={'auto'} marginLeft={6} mr={'20px'}>
                <Tabs index={tabIndex} onChange={handleTabsChange} width={'100%'} isLazy mt={-30} colorScheme={'tabsTheme'}>
                    <TabList width={'100%'} color={tabTextColor}>
                        <Tab pb={'14px'} fontWeight={600} pl={10}>
                            Dataset
                            <Box ml={8} bg={tabIndex === 0 ? 'default.toolbarButton' : 'default.tagBoxColor'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                <Text color={tabIndex === 0 ? 'default.whiteText' : 'default.accessByNumber'} fontSize={'14px'} pt={2} fontWeight={600} cursor={'pointer'}>
                                    {rowDataDatasources.length}
                                </Text>
                            </Box>
                        </Tab>
                        <Tab pb={'14px'} ml={'26'} fontWeight={600}>
                            Experiment
                            <Box ml={8} bg={tabIndex === 1 ? 'default.toolbarButton' : 'default.tagBoxColor'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                <Text color={tabIndex === 1 ? 'default.whiteText' : 'default.accessByNumber'} fontSize={'14px'} pt={2} fontWeight={600} cursor={'pointer'}>
                                    {rowDataExperiment.length}
                                </Text>
                            </Box>
                        </Tab>
                        {/*<Tab isDisabled pb={'14px'} ml={'26'} fontWeight={600}>*/}
                        {/*   Dataset*/}
                        {/*</Tab>*/}
                    </TabList>

                    <Center mt={-44} flex="3" justifyContent={'flex-end'} zIndex={2}>
                        <Box>
                            <SearchComponent searchChange={onSearchChange} />
                        </Box>
                        <Stack direction="row" height={'30'} border={'3'}>
                            {' '}
                            <Divider orientation="vertical" ml={'20'} mr={'20'} className={'dividerCss'} />
                        </Stack>
                        <Menu>
                            <MenuButton color={'white'} bg={'default.toolbarButton'} width={'110px'} height={'36px'} borderRadius={'3'}>
                                <Center>
                                    <Text fontWeight={600}> Create </Text>
                                    <Divider className="insideButtonDivider" orientation="vertical" h="36px" ml={'12'} mr={'12'} borderColor={'#076F8F'} />

                                    <DownArrow color={'white'} />
                                </Center>
                            </MenuButton>
                            <MenuList borderRadius={'0'} width={'122px'} maxHeight={'180px'} mt={'-7px'} pb={'0px'} ml={'-12px'}>
                                <MenuItem pt={'0px'} onClick={CreateExperiment.onOpen}>
                                    <Text>Experiment</Text>
                                </MenuItem>
                                <MenuItem pt={'0px'} pb={'0px'} onClick={CreateDataset.onOpen}>
                                    <Text mb={4} pt={2}>
                                        Dataset
                                    </Text>
                                </MenuItem>
                                {/* <MenuItem pt={'0px'} pb={'0px'}>
                                    <Text mb={4} pt={2}>
                                      Project
                                    </Text>
                                </MenuItem> */}
                                <MenuItem pt={'0px'} pb={'0px'} onClick={CreateProject.onOpen}>
                                    <Text mb={4} pt={2}>
                                        Project
                                    </Text>
                                </MenuItem>
                                {/* <MenuItem pt={'0px'} pb={'0px'}>
                                    <Text mb={4} pt={2}>
                                        Variable
                                    </Text>
                                </MenuItem> */}
                                <ExperimentModal isOpen={CreateExperiment.isOpen} onClose={CreateExperiment.onClose} />
                                <CreateDatasetModal isOpen={CreateDataset.isOpen} onClose={CreateDataset.onClose} />
                                <CreateProjectModal isOpen={CreateProject.isOpen} onClose={CreateProject.onClose} isEdit={{ status: false, data: {}, usersData: [] }} />
                            </MenuList>
                        </Menu>
                    </Center>

                    <TabPanels mr={'10px'} maxHeight="758px">
                        <TabPanel>
                            <Box
                                style={gridStyle}
                                className="ag-theme-alpine"
                                mt={'22px'}
                                width={'1823px'}
                                height={'423px'}
                                border={'1px'}
                                borderColor={'#D8DCDE'}
                                borderRadius={8}
                                pl={'23px'}
                                pr={'9px'}
                                pb={'25px'}
                                ml={'-10px'}
                            >
                                <Box style={gridStyle} className="ag-theme-alpine">
                                    <Flex>
                                        <Text fontWeight={700} fontSize={'16px'} mt={'21px'} mb={'16px'} color={accesstextColor}>
                                            My Project Details
                                        </Text>

                                        <Text mt={'21px'} ml={'8px'}>
                                            {rowDataDatasources.length} Records
                                        </Text>
                                    </Flex>
                                    <Box height={'75%'} width={'100%'}>
                                        <AgGridReact<any>
                                            onFirstDataRendered={onFirstDataRenderedDataSources}
                                            ref={gridRefDataSources}
                                            rowData={rowDataDatasources}
                                            columnDefs={columnDefsDatasource}
                                            animateRows={true}
                                            pagination={true}
                                            paginationPageSize={10}
                                        ></AgGridReact>
                                    </Box>
                                </Box>
                            </Box>
                        </TabPanel>

                        <TabPanel>
                            <Box
                                style={gridStyle}
                                className="ag-theme-alpine"
                                mt={'22px'}
                                width={'1823px'}
                                height={'423px'}
                                border={'1px'}
                                borderColor={'#D8DCDE'}
                                borderRadius={8}
                                pl={'23px'}
                                pr={'9px'}
                                pb={'25px'}
                                ml={'-10px'}
                            >
                                <Box style={gridStyle} className="ag-theme-alpine">
                                    <Flex>
                                        <Text fontWeight={700} fontSize={'16px'} mt={'21px'} mb={'16px'} color={accesstextColor}>
                                            Experiment Details
                                        </Text>

                                        <Text mt={'21px'} ml={'10px'}>
                                            {rowDataExperiment.length} Records
                                        </Text>
                                    </Flex>
                                    <Box height={'75%'} width={'100%'}>
                                        <AgGridReact<any>
                                            onFirstDataRendered={onFirstDataRendered}
                                            ref={gridRefExperiment}
                                            rowData={rowDataExperiment}
                                            columnDefs={columnDefsExperiment}
                                            animateRows={true}
                                            pagination={true}
                                            paginationPageSize={10}
                                        ></AgGridReact>
                                    </Box>
                                </Box>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    );
};

export default ProjectDetailsGrid;
