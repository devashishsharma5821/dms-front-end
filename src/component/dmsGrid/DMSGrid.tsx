import React, { useMemo, useRef, useState } from 'react';
import { Box, Button, Center, Divider, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import SearchComponent from '../search/SearchComponent';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';

interface ICar {
    project: string;
    created: string;
    Creator: string;
    tags: string;
    experiment: number;
    dataset: number;
    pipeline: number;
}

// specify the data
var rowDataA: ICar[] = [
    { project: 'My Project', created: ' 06/06/2022 02:00 PM', Creator: 'Shirin Bampoori', tags: '', experiment: 1, dataset: 1, pipeline: 3 },
    { project: 'Test Project', created: '05/12/2022 11:15 AM', Creator: 'Shirin Bampoori', tags: '', experiment: 2, dataset: 3, pipeline: 1 },
    { project: 'Test Project 2', created: '05/02/2022 11:00 AM', Creator: 'Shirin Bampoori', tags: '', experiment: 3, dataset: 1, pipeline: 2 }
];
const DMSGrid = () => {
    const gridRef = useRef<AgGridReact<ICar>>(null);
    //const textColor = useColorModeValue('light.header', 'dark.white');
    const gridStyle = useMemo(() => ({ height: '500px', width: '99%' }), []);
    const [rowData] = useState<ICar[]>(rowDataA);
    const [columnDefs] = useState<ColDef[]>([
        { field: 'project' },
        { field: 'created' },
        { field: 'Creator' },
        { field: 'tags' },
        { field: 'experiment' },
        { field: 'dataset' },
        { field: 'pipeline' }
    ]);
    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap">
            <Box w="100%" borderWidth="1px" borderRadius="lg" ml={'24'} mt={'24'}>
                <Center flex="3" mt="17" fontWeight={'700'} mb="17">
                    <Box ml={'17'} color={'textColor'}>
                        <Text>Project Details</Text>
                    </Box>
                    <Box color={'default.containerAgGridRecords'}>
                        <Text ml={'14'}>4 Records</Text>
                    </Box>

                    <Center flex="3" mr={5} justifyContent={'flex-end'} ml={'17'}>
                        <Box>
                            <SearchComponent />
                        </Box>
                        <Stack direction="row" height={'30'} border={'3'}>
                            {' '}
                            <Divider orientation="vertical" ml={'14'} mr={'14'} />
                        </Stack>

                        <Box>
                            <Button color={'default.whiteText'} bg={'default.hoverSideBarMenu'} variant="outline">
                                Create Project
                            </Button>
                        </Box>
                    </Center>
                </Center>

                <Box mr={'17'} mb={'17'}>
                    <Box style={gridStyle} className="ag-theme-alpine" ml={'17'}>
                        <AgGridReact<ICar> ref={gridRef} rowData={rowData} columnDefs={columnDefs} rowSelection={'single'} animateRows={true}></AgGridReact>
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
};

export default DMSGrid;
