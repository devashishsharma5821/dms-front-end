import React, { useEffect, useMemo, useRef, useState, useContext } from 'react';
import { Box, Button, Center, Divider, Flex, Stack, Text, useColorModeValue, useDisclosure, useToast, Spinner } from '@chakra-ui/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';

import { PlayIcon, ReStartIcon, EditIcon, DeleteIcon, StopCompute } from '../../assets/icons';

import client from '../../apollo-client';
import { dmsRunCompute, getComputeListData } from '../../query';
import { ComputeDetail, ComputeDetailListResponse, ComputeRun, RunComputeDetail, ComputeAppStoreState, GetComputeListResponse, DmsComputeData } from '../../models/computeDetails';
import useAppStore from '../../store';

import SwitchComponent from './SwitchComponent';
import SearchComponent from '../../component/search/SearchComponent';
import ComputeJsonModal from '../../component/modalSystem/ComputeJsonModal';
import StopComputeRunningModals from '../../pages/compute/StopComputeRunningModals';

import DeleteComputeModal from './DeleteComputeModal';
import { agGridClickHandler } from '../../models/computeDetails';
import { ComputeContext } from '../../context/computeContext';

import { BusHelper } from '../../helpers/BusHelper';
import gql from 'graphql-tag';
import { v4 } from 'uuid';
import { Action } from '@antuit/web-sockets-gateway-client';
import './compute.scss';

const Compute = () => {
    const opid = v4();
    const textColor = useColorModeValue('light.header', 'dark.white');
    const textColorIcon = useColorModeValue('#666C80', 'white');
    const createModal = useDisclosure();
    const StopComputeRunning = useDisclosure();
    const [loading, setLoading] = useState<boolean>(false);
    const [cellId, setCellId] = useState<string>();
    const [isEdit, setIsEdit] = useState<boolean | undefined>();
    const gridRef = useRef<AgGridReact<DmsComputeData>>(null);
    const deleteCompute = useDisclosure();
    const [deleteComputeId, setDeleteComputeId] = useState<string | undefined>();
    const [stopComputeId, setStopComputeId] = useState<string | undefined>();
    const toast = useToast();
    const context = useContext(ComputeContext);

    const [DmsComputeData, updateDmsComputeData, submitMessage, updateCreatedById, UserConfig, createdById] = useAppStore((state: ComputeAppStoreState) => [
        state.DmsComputeData,
        state.updateDmsComputeData,
        state.submitMessage,
        state.updateCreatedById,
        state.UserConfig,
        state.createdById
    ]);

    const gridStyle = useMemo(() => ({ height: '500px', width: '99%' }), []);
    // const onComputeStarted = () => {
    //     let currentValue = select(useAppStore.getState());
    //     if (currentValue) {
    //         console.log('current VLUE', currentValue);
    //         // setComputeStats(currentValue);
    //         // setConnected(true);
    //     }
    // };
    const select = (state: { lastAliveMessage: string }) => {
        return state.lastAliveMessage;
    };
    const onPlayClickHandler: agGridClickHandler = (data) => {
        updateCreatedById(data?.created_by);
        setLoading(true);
        const mutation = gql` 
        mutation {
            dmsRunCompute(  
               id: "${data?.id}"  
                  ) {
                    job_id,
                    job_run_id
                  }
            }`;

        client
            .mutate<ComputeRun<RunComputeDetail>>({
                mutation: dmsRunCompute(data?.id)
            })
            .then((res: any) => {
                setLoading(false);
                const { GET_COMPUTELIST } = getComputeListData();
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
                    .then((response: GetComputeListResponse) => {
                        let computedata = [...response.data.dmsComputes];
                        updateDmsComputeData(computedata);
                        if (data?.id) {
                            const aliveMessage = BusHelper.GetKeepAliveRequestMessage({
                                experimentId: 1,
                                opId: opid,
                                userId: data?.id,
                                //TODO Below are added just for fixing errors
                                project_id: 12,
                                get_datatables: undefined,
                                az_blob_get_containers: undefined,
                                az_blob_browse_container: undefined
                            });
                            submitMessage({
                                content: aliveMessage
                            });
                        }
                        // let unsubscribe = useAppStore.subscribe(onComputeStarted);
                    })
                    .catch((err: any) => console.error(err));
            })
            .catch((err: any) => {
                setLoading(false);
                toast({
                    title: `${err}`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    };

    const onDeleteClickHandler: agGridClickHandler = (data) => {
        setDeleteComputeId(data?.id);
        deleteCompute.onOpen();
    };

    const onStopClickHandler: agGridClickHandler = (data) => {
        setStopComputeId(data?.id);
        StopComputeRunning.onOpen();
    };

    const onEditClickHandler: agGridClickHandler = (data) => {
        context.updateFormData({
            id: data.id,
            max_inactivity_min: data?.max_inactivity_min,
            compute_name: data.name,
            autoscale: data.resources.autoscale,
            workers: data.resources.num_workers ? data.resources.num_workers : '0',
            spot_instances: data.resources.spot_instances,
            worker_type_id: data.resources.node_type.worker_type_id,
            min_workers: data.resources?.autoscale?.min_workers,
            max_workers: data.resources?.autoscale?.max_workers,
            enable_autoscaling: data.resources.autoscale ? true : false,
            terminate_after: data?.max_inactivity_min ? true : false
        });
        setIsEdit(true);
        createModal.onOpen();
    };

    const actionsRow = (params: any) => {
        return (
            <Flex height={'inherit'} justifyContent="space-between" alignItems={'center'}>
                {params?.data?.status === 'STOPPED' ? (
                    loading ? (
                        <Spinner />
                    ) : (
                        <div className="icons" onClick={() => onPlayClickHandler(params.data)}>
                            <PlayIcon />
                        </div>
                    )
                ) : (
                    <div className="icons" onClick={() => onStopClickHandler(params.data)}>
                        <StopCompute />
                    </div>
                )}
                <div className="icons">
                    <ReStartIcon />
                </div>
                <div className="icons" onClick={() => onEditClickHandler(params.data)}>
                    <EditIcon />
                </div>
                <div className="icons" onClick={() => onDeleteClickHandler(params.data)} style={{ cursor: 'pointer' }}>
                    <DeleteIcon color={textColorIcon} height={'18px'} width={'16px'} />
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
    const [rowData, setRowData] = useState<DmsComputeData[]>([]);
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
        if (DmsComputeData === null) {
            const { GET_COMPUTELIST } = getComputeListData();
            client
                .query<ComputeDetailListResponse<Array<DmsComputeData>>>({
                    query: GET_COMPUTELIST
                })
                .then((response: { data: { dmsComputes: any } }) => {
                    let computedata = [...response.data.dmsComputes];
                    setRowData(computedata);
                    console.log('computedata ===>', computedata);
                    gridRef?.current!?.api?.sizeColumnsToFit();
                    updateDmsComputeData(response.data.dmsComputes);
                })
                .catch((err: any) => console.error(err));
        } else if (DmsComputeData?.length > 0) {
            setRowData(DmsComputeData);
            gridRef?.current!?.api?.sizeColumnsToFit();
        } else {
            setRowData([]);
        }
    }, [DmsComputeData]);

    const onCellClicked = (params: any) => {
        setCellId(params.data.id);
        actionsRow(params.data);
    };

    const triggerCreateModal = () => {
        context.updateFormData({
            id: '',
            max_inactivity_min: null,
            compute_name: '',
            autoscale: false,
            workers: null,
            spot_instances: false,
            worker_type_id: '',
            min_workers: null,
            max_workers: null,
            enable_autoscaling: false,
            terminate_after: false
        });
        setIsEdit(false);
        createModal.onOpen();
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
                                    <Button color={'default.whiteText'} bg={'default.hoverSideBarMenu'} variant="outline" onClick={triggerCreateModal}>
                                        Create Compute
                                    </Button>
                                </Box>
                            </Center>
                        </Center>

                        <Box mr={'17'} mb={'17'}>
                            <Box style={gridStyle} className="ag-theme-alpine" ml={'23'}>
                                {loading && <Spinner ml={20} />}
                                <AgGridReact<DmsComputeData>
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    onCellClicked={onCellClicked}
                                    onRowClicked={(e: { rowIndex: any }) => console.log('row clicked', e.rowIndex)}
                                    rowSelection={'single'}
                                    animateRows={true}
                                ></AgGridReact>
                            </Box>
                        </Box>
                    </Box>
                    {createModal.isOpen && <ComputeJsonModal isOpen={createModal.isOpen} isEdit={isEdit} onClose={createModal.onClose} />}
                    <DeleteComputeModal computeId={deleteComputeId} isOpen={deleteCompute.isOpen} onClose={deleteCompute.onClose} />
                    <StopComputeRunningModals computeId={stopComputeId} isOpen={StopComputeRunning.isOpen} onClose={StopComputeRunning.onClose} />
                </Box>
            </Box>
        </>
    );
};

export default Compute;
