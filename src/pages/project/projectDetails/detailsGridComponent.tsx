import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Center, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
const ProjectDetailsGrid = (props: any) => {
    const tabTextColor = useColorModeValue('default.darkGrayCreate', 'dark.white');
    const gridRefDataSources = useRef<AgGridReact<any>>(null);
    const gridRefExperiment = useRef<AgGridReact<any>>(null);
    const gridStyle = useMemo(() => ({ height: '300px'}), []);
    const [rowDataDatasources, setRowDataDatasources] = useState<any[]>([]);
    const [rowDataExperiment, setRowDataExperiment] = useState<any[]>([]);
    const [columnDefsDatasource, setColumnDefsDatasource] = useState<ColDef[]>([]);
    const [columnDefsExperiment, setColumnDefsExperiment] = useState<ColDef[]>([]);
    const [tabIndex, setTabIndex] = React.useState(0);
    const navigate = useNavigate();
    useEffect(() => {
            setColumnDefsDatasource([
                {
                    'headerName': 'Asset Id',
                    'field': 'id',
                    cellRenderer: renderDatasetId
                },
                {
                    'headerName': 'Asset Name',
                    'field': 'name',
                    'minWidth': 500
                },
                {
                    'headerName': 'Asset Spec',
                    'field': 'spec.path',
                    'minWidth': 1000
                }
            ]);
            setRowDataDatasources(props.gridData.datasources);
            setColumnDefsExperiment([
                {
                    'headerName': 'Asset Id',
                    'field': 'id',
                    cellRenderer: renderExperimentId
                },
                {
                    'headerName': 'Asset Name',
                    'field': 'name',
                    'minWidth': 500
                },
            ]);
            setRowDataExperiment(props.gridData.experiments);
    }, [props.gridData]);

    const navigateToExperiment = (id: any) => {
        navigate(`/experiment/${id}`);
    }
    const navigateToDataset = (id: any) => {
        navigate(`/datasetDetails/${id}`);
    }
    const renderExperimentId = (params: any) => {
        return (
            <div style={{color: 'rgb(3, 135, 176)', cursor: 'pointer'}} onClick={() => navigateToExperiment(params.data.id)}>
                {params.data.id}
            </div>
        );
    };
    const renderDatasetId = (params: any) => {
        return (
            <div style={{color: 'rgb(3, 135, 176)', cursor: 'pointer'}} onClick={() => navigateToDataset(params.data.id)}>
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
        };
    };
    return (
        <>
            <Box className="project-details-grid-page" marginTop={50}>
                <Tabs index={tabIndex} onChange={handleTabsChange} width={'100%'} isLazy mt={-30} colorScheme={'tabsTheme'}>
                    <TabList width={'100%'} color={tabTextColor}>
                        <Tab pb={'14px'} fontWeight={600} pl={10}>
                            Dataset
                        </Tab>
                        <Tab pb={'14px'} ml={'26'} fontWeight={600}>
                            Experiment
                        </Tab>
                        {/*<Tab isDisabled pb={'14px'} ml={'26'} fontWeight={600}>*/}
                        {/*   Dataset*/}
                        {/*</Tab>*/}
                    </TabList>
                        <TabPanels mr={'10px'} maxHeight="758px">
                            <TabPanel>
                                <Box style={gridStyle} className="ag-theme-alpine">
                                    <AgGridReact<any> ref={gridRefDataSources} rowData={rowDataDatasources} columnDefs={columnDefsDatasource} animateRows={true}></AgGridReact>
                                </Box>
                            </TabPanel>
                            <TabPanel>
                                <Box style={gridStyle} className="ag-theme-alpine">
                                    <AgGridReact<any> ref={gridRefExperiment} rowData={rowDataExperiment} columnDefs={columnDefsExperiment} animateRows={true}></AgGridReact>
                                </Box>
                            </TabPanel>
                        </TabPanels>
                </Tabs>
            </Box>
        </>
    );
};

export default ProjectDetailsGrid;
