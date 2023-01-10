import React, { useEffect, useMemo, useRef, useState, useCallback, useContext } from 'react';
import './compute.scss';
import { Box, Button, Center, Divider, Flex, Stack, Text, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import path from 'path';
import PlayIcon from '../../assets/icons/PlayIcon';
import ReStartIcon from '../../assets/icons/ReStartIcon';
import EditIcon from '../../assets/icons/EditIcon';
import DeleteIcon from '../../assets/icons/DeleteIcon';
import SwitchComponent from './SwitchComponent';
import { SwitchOff, StopCompute } from '../../assets/icons';
import client from '../../apollo-client';
import { dmsRunCompute, getComputeListData } from '../../query';
import { ComputeDetail, ComputeDetailListResponse, ComputeRun, RunComputeDetail } from '../../models/computeDetails';
import { AgGridReact } from 'ag-grid-react';
import SearchComponent from '../../component/search/SearchComponent';
import ComputeJsonModal from '../../component/sideBarMenu/ComputeJsonModal';
import StopComputeRunningModals from '../../pages/compute/StopComputeRunningModals';
import useAppStore from '../../store';
import { gql } from '@apollo/client';

import { Spinner } from '@chakra-ui/react';
import DeleteComputeModal from './DeleteComputeModal';
import { agGridClickHandler } from '../../models/computeDetails';
import { ComputeContext } from '../../context/computeContext';

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
    const EditComputeJsonModal = useDisclosure();
    const StopComputeRunning = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [updateDmsComputeStatus, DmsComputeStatus] = useAppStore((state: any) => [state.updateDmsComputeStatus, state.DmsComputeStatus]);
    const [cellId, setCellId] = useState<string>();
    const [isEdit, setIsEdit] = useState<boolean | undefined>();
    const gridRef = useRef<AgGridReact<ComputeDetail>>(null);
    const deleteCompute = useDisclosure();
    const [deleteCellId, setdeleteCellId] = useState<string | undefined>();
    const [stopCellId, setStopCellId] = useState<string | undefined>();
    const toast = useToast();
    const context = useContext(ComputeContext);

    const gridStyle = useMemo(() => ({ height: '500px', width: '99%' }), []);

    const onPlayClickHandler: agGridClickHandler = (cellId) => {
        setLoading(true);
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
            .mutate<ComputeRun<RunComputeDetail>>({
                mutation: dmsRunCompute(cellId)
            })
            .then((response) => {
                console.log('run compute response', response);
                setLoading(false);
                const { GET_COMPUTELIST } = getComputeListData();
                console.log('starting get api');
                toast({
                    title: `Compute is starting`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                client
                    .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                        query: GET_COMPUTELIST
                    })
                    .then((response) => {
                        let computedata = [...response.data.dmsComputes];
                        updateDmsComputeStatus(computedata);
                    })
                    .catch((err) => console.error(err));
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                toast({
                    title: `${err}`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    };

    const onDeleteClickHandler: agGridClickHandler = (cellId) => {
        setdeleteCellId(cellId);
        deleteCompute.onOpen();
    };

    const onStopClickHandler: agGridClickHandler = (cellId) => {
        setStopCellId(cellId);
        StopComputeRunning.onOpen();
    };

    const onEditClickHandler: any = (data: any) => {
        context.updateFormData({
            id: data.id,
            max_inactivity_min: data?.max_inactivity_min,
            name: data.name,
            autoscale: data.resources.autoscale,
            num_workers: data.resources?.num_workers,
            spot_instances: data.resources.spot_instances,
            worker_type_id: data.resources.node_type.worker_type_id,
            min_workers: data.resources?.autoscale?.min_workers,
            max_workers: data.resources?.autoscale?.max_workers
        });
        setIsEdit(true);
        EditComputeJsonModal.onOpen();
    };

    const actionsRow = (params: any) => {
        // console.log('inside action row params ===>', params);
        return (
            <Flex height={'inherit'} justifyContent="space-between" alignItems={'center'}>
                {params?.data?.status === 'STOPPED' ? (
                    loading ? (
                        <Spinner />
                    ) : (
                        <div onClick={() => onPlayClickHandler(params.data.id)}>
                            <PlayIcon />
                        </div>
                    )
                ) : (
                    <div onClick={() => onStopClickHandler(params.data.id)}>
                        <StopCompute />
                    </div>
                )}
                <ReStartIcon />
                <div onClick={() => onEditClickHandler(params.data)}>
                    <EditIcon />
                </div>
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
        // console.log('default row ===>', params);
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
                    gridRef.current!.api.sizeColumnsToFit();
                    updateDmsComputeStatus(response.data.dmsComputes);
                    //updateTransformersData(transformerdata)
                })
                .catch((err) => console.error(err));
        } else {
            setRowData(DmsComputeStatus);
            gridRef.current!.api.sizeColumnsToFit();
        }
    }, [DmsComputeStatus]);

    const onCellClicked = (params: any) => {
        // console.log('onCellClicked params ===>', params);
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
                                    <Button
                                        color={'default.whiteText'}
                                        bg={'default.hoverSideBarMenu'}
                                        variant="outline"
                                        onClick={() => {
                                            setIsEdit(false);
                                            EditComputeJsonModal.onOpen();
                                        }}
                                    >
                                        Create Compute
                                    </Button>
                                </Box>
                            </Center>
                        </Center>

                        <Box mr={'17'} mb={'17'}>
                            <Box style={gridStyle} className="ag-theme-alpine" ml={'23'}>
                                {loading && <Spinner ml={20}></Spinner>}
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
                    <ComputeJsonModal isEdit={isEdit} isOpen={EditComputeJsonModal.isOpen} onClose={EditComputeJsonModal.onClose} />
                    <DeleteComputeModal cellId={deleteCellId} isOpen={deleteCompute.isOpen} onClose={deleteCompute.onClose} />
                    <StopComputeRunningModals cellId={stopCellId} isOpen={StopComputeRunning.isOpen} onClose={StopComputeRunning.onClose} />
                </Box>
            </Box>
        </>
    );
};

export default Compute;
