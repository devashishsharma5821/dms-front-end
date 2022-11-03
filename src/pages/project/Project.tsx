import React, { useMemo, useRef, useState } from 'react';
import './project.scss';
import { Box, Button, Center, Divider, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import SearchComponent from '../../component/search/SearchComponent';
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

const Project = () => {
    const gridRef = useRef<AgGridReact<ICar>>(null);

    const gridStyle = useMemo(() => ({ height: '500px', width: '100%' }), []);
    const [rowData, setRowData] = useState<ICar[]>(rowDataA);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'project' },
        { field: 'created' },
        { field: 'Creator' },
        { field: 'tags' },
        { field: 'experiment' },
        { field: 'dataset' },
        { field: 'pipeline' }
    ]);

    return (
        <>
            <Box className="project_page" ml={'24'}>
                Project
            </Box>
            <Stack spacing={3}>
                <Text fontSize="md" ml={'24'} noOfLines={[2]}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat. <br />
                    Duis aute irure dolor in reprehenderit in voluptate velit
                </Text>
            </Stack>
            <Flex as="nav" align="center" justify="space-between" wrap="wrap">
                <Box w="100%" borderWidth="1px" borderRadius="lg" ml={'24'} mt={'24'}>
                    <Center flex="3" mt="17" fontWeight={'700'} mb="17">
                        <Box ml={'17'}>
                            <Text color={'default.blackText'}>Project Details</Text>
                        </Box>
                        <Box ml={'14'} color={'default.containerAgGridRecords'}>
                            <Text>4 Records</Text>
                        </Box>

                        <Center flex="3" mr={5} justifyContent={'flex-end'} ml={'17'}>
                            <Box>
                                <SearchComponent />
                            </Box>
                            <Stack direction="row" height="30px" mr={'14'} ml={'14'} border={'3'}>
                                {' '}
                                <Divider orientation="vertical" />
                            </Stack>

                            <Box>
                                <Button color={'default.whiteText'} bg={'default.hoverSideBarMenu'} variant="outline">
                                    Create Project
                                </Button>
                            </Box>
                        </Center>
                    </Center>

                    <Box ml={'17'} mr={'17'}>
                        <Box style={gridStyle} className="ag-theme-alpine" mb={'17'}>
                            <AgGridReact<ICar> ref={gridRef} rowData={rowData} columnDefs={columnDefs} rowSelection={'single'} animateRows={true}></AgGridReact>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </>
    );
};

export default Project;
