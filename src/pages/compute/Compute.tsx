import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import './compute.scss';
import { Box, Button, Center, Divider, Flex, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import path from 'path';
import PlayIcon from '../../assets/icons/PlayIcon';
import ReStartIcon from '../../assets/icons/ReStartIcon';
import EditIcon from '../../assets/icons/EditIcon';
import DeleteIcon from '../../assets/icons/DeleteIcon';
import SwitchComponent from './SwitchComponent';
import { SwitchOff } from '../../assets/icons';
import client from '../../apollo-client';
import { getComputeListData } from '../../query';
import { ComputeDetail, ComputeDetailListResponse } from '../../models/computeDetails';
import { AgGridReact } from 'ag-grid-react';
import SearchComponent from '../../component/search/SearchComponent';
import ComputeJsonModal from '../../component/sideBarMenu/ComputeJsonModal';
import StopComputeRunningModals from '../../pages/compute/StopComputeRunningModals';
import useAppStore from '../../store';
import { gql } from '@apollo/client';

import { Spinner } from '@chakra-ui/react';
import DeleteComputeModal from './DeleteComputeModal';

interface ComputeData {
    computeName: string;
    created: string;
    activeCores: number;
    activeMemory: number;
    status: string;
    default: boolean;
}
const Compute = () => {
    const textColor = useColorModeValue('light.header', 'dark.white');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const StopComputeRunning = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [updateDmsComputeStatus, DmsComputeStatus] = useAppStore((state: any) => [state.updateDmsComputeStatus, state.DmsComputeStatus]);
    const [cellId, setCellId] = useState<any>();
    const gridRef = useRef<AgGridReact<ComputeDetail>>(null);
    const deleteCompute = useDisclosure();
    const [deleteCellId, setdeleteCellId] = useState<any>();
    const [stopCellId, setStopCellId] = useState<any>();

    const gridStyle = useMemo(() => ({ height: '500px', width: '99%' }), []);

    const onPlayClickHandler: any = (cellId: string | undefined) => {
        setLoading(true);
        console.log('running', cellId);
        const mutation = gql` 
        mutation {
            dmsRunCompute(  
               id: "${cellId}"  
                  ) {
                    job_id,
                    job_run_id
                  }
            }`;

        client
            .mutate<any>({
                mutation: mutation
            })
            .then((response) => {
                setLoading(false);
                const { GET_COMPUTELIST } = getComputeListData();
                client
                    .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                        query: GET_COMPUTELIST
                    })
                    .then((response) => {
                        console.log('response data of get ===>', response);
                        let computedata = [...response.data.dmsComputes];
                        updateDmsComputeStatus(computedata);
                    })
                    .catch((err) => console.error(err));
            });
    };

    const onDeleteClickHandler: any = (cellId: string | undefined) => {
        setdeleteCellId(cellId);
        deleteCompute.onOpen();
    };

    const onStopClickHandler: any = (cellId: string | undefined) => {
        setStopCellId(cellId);
        StopComputeRunning.onOpen();
    };

    const actionsRow = (params: any) => {
        return (
            <Flex height={'inherit'} justifyContent="space-between" alignItems={'center'}>
                {params.data.status === 'STOPPED' ? (
                    <div onClick={() => onPlayClickHandler(params.data.id)}>
                        <PlayIcon />
                    </div>
                ) : (
                    <div onClick={() => onStopClickHandler(params.data.id)}>
                        <SwitchOff />
                    </div>
                )}
                <ReStartIcon />
                <EditIcon />
                <div onClick={() => onDeleteClickHandler(params.data.id)}>
                    <DeleteIcon />
                </div>
            </Flex>
        );
    };
    const defaultChange = (checked: boolean) => {
        checked = !checked;
    };
    const defaultRow = (params: any) => {
        let isChecked = params.data.default;
        return <SwitchComponent params={params} />;
    };
    const [rowData, setRowData] = useState<ComputeDetail[]>();
    const [columnDefs] = useState<ColDef[]>([
        { headerName: 'Compute Name', field: 'name' },
        { headerName: 'created On', field: 'created_at' },
        { headerName: 'Active Cores', field: 'resources.num_workers' },
        { headerName: 'Active Memory', field: 'activeMemory' },
        { headerName: 'Status', field: 'status' },
        { headerName: 'Set As Default', field: 'default', cellRenderer: defaultRow },
        { headerName: 'Actions', field: 'Actions', cellRenderer: actionsRow }
    ]);

    useEffect(() => {
        if (DmsComputeStatus.length === 0) {
            const { GET_COMPUTELIST } = getComputeListData();
            client
                .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                    query: GET_COMPUTELIST
                })
                .then((response) => {
                    let computedata = [...response.data.dmsComputes];
                    setRowData(computedata);
                    updateDmsComputeStatus(response.data.dmsComputes);
                    //updateTransformersData(transformerdata)
                })
                .catch((err) => console.error(err));
        } else {
            setRowData(DmsComputeStatus);
        }
    }, [DmsComputeStatus]);

    const onCellClicked = (params: any) => {
        setCellId(params.data.id);
        actionsRow(params.data.id);
    };

    const onSearchChange = (searchValue: string) => {
        gridRef.current!.api.setQuickFilter(searchValue);
    };
    return (
        <>
            <Box marginLeft={36}>
                <Box className="compute_page" color={textColor}>
                    Compute
                </Box>
                <Stack spacing={3}>
                    <Text fontSize="md" ml={'38'} noOfLines={[2]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat. <br /> Duis aute irure dolor in reprehenderit in voluptate velit
                    </Text>
                </Stack>
                <Box>
                    <Box borderWidth="1px" ml={'24'} borderRadius="lg" mt={'24'}>
                        <Center flex="3" mt="17" fontWeight={'700'} mb="17">
                            <Box ml={'23'} color={'textColor'}>
                                <Text>Compute Details</Text>
                            </Box>
                            <Box color={'default.containerAgGridRecords'}>
                                <Text ml={'14'}>4 Records</Text>
                            </Box>

                            <Center flex="3" mr={5} justifyContent={'flex-end'} ml={'17'}>
                                <Box>
                                    <SearchComponent searchChange={onSearchChange} />
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
                                {loading && <Spinner></Spinner>}
                                <AgGridReact<ComputeDetail>
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    onCellClicked={onCellClicked}
                                    onRowClicked={(e) => console.log('row clicked', e.rowIndex)}
                                    rowSelection={'single'}
                                    animateRows={true}
                                ></AgGridReact>
                            </Box>
                        </Box>
                    </Box>
                    <ComputeJsonModal isOpen={isOpen} onClose={onClose}></ComputeJsonModal>
                    <DeleteComputeModal cellId={deleteCellId} isOpen={deleteCompute.isOpen} onClose={deleteCompute.onClose} />
                    <StopComputeRunningModals cellId={stopCellId} isOpen={StopComputeRunning.isOpen} onClose={StopComputeRunning.onClose} />
                </Box>
            </Box>
        </>
    );
};

export default Compute;
