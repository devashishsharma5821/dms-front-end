import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Center, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { OutputDetail } from '../../../models/outputDetail';
const ProjectDetailsGrid = (props: any) => {
    const tabTextColor = useColorModeValue('default.darkGrayCreate', 'dark.white');
    const gridRef = useRef<AgGridReact<any>>(null);
    const gridStyle = useMemo(() => ({ height: '300px'}), []);
    const [rowData, setRowData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    useEffect(() => {
        setColumnDefs([
            {
                'headerName': 'Asset Id',
                'field': 'id'
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
        setRowData(props.gridData);
        console.log('Props.grid', props.gridData)
    }, [props.gridData]);

    return (
        <>
            <Box className="project-details-grid-page" marginTop={50}>
                <Tabs width={'100%'} isLazy mt={-30} colorScheme={'tabsTheme'}>
                    <TabList width={'100%'} color={tabTextColor}>
                        <Tab pb={'14px'} fontWeight={600} pl={10}>
                            Dataset
                        </Tab>
                        <Tab isDisabled pb={'14px'} ml={'26'} fontWeight={600}>
                            Experiment
                        </Tab>
                        {/*<Tab isDisabled pb={'14px'} ml={'26'} fontWeight={600}>*/}
                        {/*   Dataset*/}
                        {/*</Tab>*/}
                    </TabList>
                        <TabPanels mr={'10px'} maxHeight="758px">
                            <TabPanel>
                                <Box style={gridStyle} className="ag-theme-alpine">
                                    <AgGridReact<any> ref={gridRef} rowData={rowData} columnDefs={columnDefs} animateRows={true}></AgGridReact>
                                </Box>

                            </TabPanel>
                        </TabPanels>
                </Tabs>
            </Box>
        </>
    );
};

export default ProjectDetailsGrid;
