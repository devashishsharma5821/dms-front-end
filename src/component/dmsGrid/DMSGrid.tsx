import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Center, Divider, Flex, Stack, Text, Switch } from '@chakra-ui/react';
import SearchComponent from '../search/SearchComponent';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import path from 'path';
import PlayIcon from '../../assets/icons/PlayIcon';
import ReStartIcon from '../../assets/icons/ReStartIcon';
import EditIcon from '../../assets/icons/EditIcon';
import DeleteIcon from '../../assets/icons/DeleteIcon';
import SwitchComponent from './SwitchComponent';

import client from '../../apollo-client';
import { getComputeListData } from '../../query';
import { ComputeDetail, ComputeDetailListResponse } from '../../models/computeDetails';


interface ComputeData {
    computeName: string;
    created: string;
    activeCores: number;
    activeMemory: number;
    status: string;
    default: boolean;
}

// specify the data
var rowDataA: ComputeData[] = [
    { computeName: 'My-Compute 1', created: ' 06/06/2022 02:00 PM',  activeCores: 4, activeMemory: 1, status: "Active", default: true },
    { computeName: 'My-Compute 2', created: '05/12/2022 11:15 AM',  activeCores: 3, activeMemory: 2, status: "In Active", default: false },
    { computeName: 'My-Compute 3', created: '05/02/2022 11:00 AM',  activeCores: 2, activeMemory: 3, status: "Active", default: true }
];
const DMSGrid = () => {
    const gridRef = useRef<AgGridReact<ComputeDetail>>(null);
    //const textColor = useColorModeValue('light.header', 'dark.white');
    const gridStyle = useMemo(() => ({ height: '500px', width: '99%' }), []);
    const actionsRow = (params: any) =>{
        console.log(params);
        return (
            <Flex height={'inherit'} justifyContent='space-between' alignItems={'center'}>
                <PlayIcon />
                <ReStartIcon />
                <EditIcon />
                <DeleteIcon />
            </Flex>
        )
    }
    const defaultChange = (checked:boolean) =>{
        checked = !checked
    }
    const defaultRow = (params: any) => {
        console.log(params);
        let isChecked = params.data.default;
        return (
            <SwitchComponent params={params}/>
        )
    }
    const [rowData, setRowData] = useState<ComputeDetail[]>();
    const [columnDefs] = useState<ColDef[]>([
        { headerName:"Compute Name", field: 'name' },
        { headerName:"created On", field: 'created_at' },
        { headerName:"Active Cores", field: 'resources.num_workers' },
        { headerName:"Active Memory", field: 'activeMemory' },
        { headerName:"Status", field: 'status' },
        { headerName:"Set As Default", field: 'default', cellRenderer:defaultRow },
        { headerName:"Actions", field: 'Actions', cellRenderer:actionsRow}
    ]);

    useEffect(() => {
        const { GET_COMPUTELIST } = getComputeListData();
        client.query<ComputeDetailListResponse<Array<ComputeDetail>>>({
            query: GET_COMPUTELIST
        })
            .then((response) => {
                let computedata = [...response.data.dmsComputes];   
                setRowData(computedata);
                //updateTransformersData(transformerdata)
            })
            .catch((err) => console.error(err));
    }, [])
    
    return (
        <Box >
            <Box borderWidth="1px"  ml={'24'} borderRadius="lg" mt={'24'}>
                <Center flex="3" mt="17" fontWeight={'700'} mb="17">
                    <Box ml={'23'} color={'textColor'}>
                        <Text>Compute Details</Text>
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
                                Create Compute
                            </Button>
                        </Box>
                    </Center>
                </Center>

                <Box mr={'17'} mb={'17'}>
                    <Box style={gridStyle} className="ag-theme-alpine" ml={'23'}>
                        <AgGridReact<ComputeDetail> ref={gridRef} rowData={rowData} columnDefs={columnDefs} rowSelection={'single'} animateRows={true}></AgGridReact>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};


export default DMSGrid;


