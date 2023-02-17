import { useEffect, useMemo, useRef, useState, useContext } from 'react';
import { Box, Button, Center, Divider, Flex, Stack, Text, useColorModeValue, useDisclosure, useToast, Spinner } from '@chakra-ui/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { v4 } from 'uuid';

import { PlayIcon, ReStartIcon, EditIcon, DeleteIcon, StopCompute } from '../../assets/icons';

import client from '../../apollo-client';
import { dmsDeleteCompute, dmsEditCompute, dmsRunCompute, dmsStopComputeRun, getComputeListData } from '../../query';
import {
    ComputeDelete,
    ComputeDetailListResponse,
    ComputeRun,
    ComputeStop,
    DeleteComputeDetail,
    EditCompute,
    RunComputeDetail,
    StopComputeDetail,
    ComputeAppStoreState,
    DmsComputeData,
    agGridClickHandler,
    getComputeListQueryData
} from '../../models/computeDetails';
import { ComputeContext } from '../../context/computeContext';
import useAppStore from '../../store';

import AlertConfirmComponent from '../../component/modalSystem/AlertConfirmComponent';
import SwitchComponent from './SwitchComponent';
import SearchComponent from '../../component/search/SearchComponent';
import ComputeJsonModal from '../../component/modalSystem/ComputeJsonModal';

import { BusHelper } from '../../helpers/BusHelper';
import './compute.scss';
import { updateDmsComputeData, updateCreatedById, getAndUpdateDmsComputeData } from '../../zustandActions/computeActions';
import { submitMessage } from '../../zustandActions/socketActions';
import { Action } from '@antuit/web-sockets-gateway-client';
import { newComputeData } from './generateNewComputeData';
import { disperseMessage } from '../../models/messages';

const Compute = () => {
    const opid = v4();
    const textColor = useColorModeValue('light.header', 'dark.white');
    const textColorIcon = useColorModeValue('#666C80', 'white');
    const createModal = useDisclosure();
    const stopComputeRunning = useDisclosure();
    const refreshCompute = useDisclosure();
    const [loading, setLoading] = useState<boolean>(false);
    const [cellId, setCellId] = useState<string>();
    const [rowCount, setRowCount] = useState<number | undefined>(0);
    const [isEdit, setIsEdit] = useState<boolean | undefined>();
    const gridRef = useRef<AgGridReact<DmsComputeData>>(null);
    const deleteCompute = useDisclosure();
    const alertConfirm = useDisclosure();
    const alertConfirmForDefaultFlag = {
        title: 'Change Default',
        description: "Are you sure? You can't undo this action afterwards.",
        cancelButtonTitle: 'Cancel',
        confirmButtonTitle: 'Confirm'
    };
    const alertConfirmForDelete = {
        title: 'Delete Compute',
        description: 'Are you sure you want to delete the Compute?',
        cancelButtonTitle: 'Cancel',
        confirmButtonTitle: 'Confirm'
    };
    const alertConfirmForStop = {
        title: 'Stop Compute',
        description: 'Are you sure you want to stop the Compute?',
        cancelButtonTitle: 'Cancel',
        confirmButtonTitle: 'Confirm'
    };
    const alertConfirmForRefresh = {
        title: 'Refresh Compute',
        description: 'Are you sure you want to Refresh the Compute?',
        cancelButtonTitle: 'Cancel',
        confirmButtonTitle: 'Confirm'
    };
    const [deleteComputeId, setDeleteComputeId] = useState<string | undefined>();
    const [stopComputeId, setStopComputeId] = useState<string | undefined>();
    const [stopRefreshId, setRefreshComputeId] = useState<string>('');
    const toast = useToast();
    const context = useContext(ComputeContext);
    window.addEventListener('resize', () => {
        gridRef?.current!?.api?.sizeColumnsToFit();
    });
    const [DmsComputeData, UserConfig] = useAppStore((state: ComputeAppStoreState) => [state.DmsComputeData, state.UserConfig]);

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

        client
            .mutate<ComputeRun<RunComputeDetail>>({
                mutation: dmsRunCompute(data?.id)
            })
            .then(() => {
                setLoading(false);
                getAndUpdateDmsComputeData();
                toast({
                    title: `Compute is starting`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                // if (data?.id) {
                //     const aliveMessage = BusHelper.GetKeepAliveRequestMessage({
                //         experimentId: 1,
                //         opId: opid,
                //         userId: data?.id,
                //         //TODO Below are added just for fixing errors
                //         project_id: 12,
                //         get_datatables: undefined,
                //         az_blob_get_containers: undefined,
                //         az_blob_browse_container: undefined
                //     });
                //     submitMessage([
                //         { content: { action: Action.Subscribe, subject: `dms_pid.out.${data?.id}` } },
                //         {
                //             content: aliveMessage
                //         }
                //     ]);
                //     // submitMessage();
                // }
                // let unsubscribe = useAppStore.subscribe(onComputeStarted);
                // })
                // .catch((err: any) => console.error(err));
            })
            .catch((err: any) => {
                console.log('error ===>', err);
                setLoading(false);
                toast({
                    title: `${err}`,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    };

    const confirmAlertActionForStop = () => {
        client
            .mutate<ComputeStop<StopComputeDetail>>({
                mutation: dmsStopComputeRun(stopComputeId)
            })
            .then(() => {
                stopComputeRunning.onClose();
                toast({
                    title: `Compute will be stopped after 10 seconds`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                setTimeout(() => {
                    getAndUpdateDmsComputeData();
                    if (UserConfig && stopComputeId) {
                        const shutDownRequest = BusHelper.GetShutdownRequestMessage({
                            experimentId: parseInt(stopComputeId),
                            opId: opid,
                            userId: stopComputeId
                        });

                        submitMessage([{ content: { action: Action.Unsubscribe, subject: `dms_pid.out.${stopComputeId}` } }, { content: shutDownRequest }]);
                    }
                }, 10000);
            })
            .catch(() => {
                toast({
                    title: `Compute is not stopped`,
                    status: 'error',
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
        stopComputeRunning.onOpen();
    };

    const onRefreshClickHandler: agGridClickHandler = (data) => {
        setRefreshComputeId(data?.id);
        refreshCompute.onOpen();
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
            driver_type_id: data.resources.node_type.driver_type_id,
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
                {loading ? (
                    <Spinner />
                ) : params?.data?.status === 'STOPPED' ? (
                    <div className="icons" onClick={() => onPlayClickHandler(params.data)}>
                        <PlayIcon />
                    </div>
                ) : (
                    <div className="icons" onClick={() => onStopClickHandler(params.data)}>
                        <StopCompute />
                    </div>
                )}
                <div className="icons" onClick={() => onRefreshClickHandler(params.data)}>
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

    const defaultRowOnChange = () => {
        alertConfirm.onOpen();
    };
    const confirmAlertActionForDelete = () => {
        client
            .mutate<ComputeDelete<DeleteComputeDetail>>({
                mutation: dmsDeleteCompute(deleteComputeId)
            })
            .then(() => {
                toast({
                    title: `Compute is deleted successfully`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                getAndUpdateDmsComputeData();
                deleteCompute.onClose();
            })
            .catch(() => {
                toast({
                    title: `A running compute can't be deleted`,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                deleteCompute.onClose();
            });
    };

    const confirmAlertActionForRefresh = () => {
        const messageQue: Array<disperseMessage> = [];
        const aliveMessage = BusHelper.GetKeepAliveRequestMessage({
            experimentId: 1,
            opId: opid,
            userId: stopRefreshId
        });
        messageQue.push({ content: { action: Action.Subscribe, subject: `dms_pid.out.${stopRefreshId}` } });
        messageQue.push({ content: aliveMessage });
        submitMessage(messageQue);
        refreshCompute.onClose();
    };

    const confirmAlertAction = () => {
        // dmsEditCompute
        // Api Call here, same as edit API, but make the default true or false based on trigger
        // Remove the hardcoding
        client
            .mutate<EditCompute<any>>({
                mutation: dmsEditCompute(161, true)
            })
            .then(() => {
                alertConfirm.onClose();
                getAndUpdateDmsComputeData();
                toast({
                    title: `Your Default is changed`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    };
    const defaultRow = (params: any) => {
        getAndUpdateDmsComputeData();
        return <SwitchComponent params={params} defaultRowOnChange={defaultRowOnChange} />;
    };

    const [rowData, setRowData] = useState<DmsComputeData[]>([]);
    const [columnDefs] = useState<ColDef[]>([
        { headerName: 'Compute Id', field: 'id' },
        { headerName: 'Compute Name', field: 'name' },
        { headerName: 'Created On', field: 'created_at' },
        { headerName: 'Worker Type', field: 'resources.node_type.worker_type_id' },
        { headerName: 'Driver Type', field: 'resources.node_type.driver_type_id' },
        { headerName: 'Workers', field: 'resources.num_workers' },
        { headerName: 'Total Cores', field: 'totalCores' },
        { headerName: 'Total Memory', field: 'totalMemory' },
        { headerName: 'Status', field: 'status' },
        { headerName: 'Set As Default', field: 'default', cellRenderer: defaultRow },
        { headerName: 'Action', field: 'Actions', cellRenderer: actionsRow }
    ]);

    useEffect(() => {
        if (DmsComputeData === null) {
            const { GET_COMPUTELIST } = getComputeListData();
            client
                .query<ComputeDetailListResponse<Array<DmsComputeData>>>({
                    query: GET_COMPUTELIST
                })
                .then((response: getComputeListQueryData) => {
                    let computedata = [...response.data.dmsComputes];
                    const newComputedataa = newComputeData(computedata);
                    setRowData(newComputedataa);
                    setRowCount(newComputedataa.length);
                    gridRef?.current!?.api?.sizeColumnsToFit();
                    updateDmsComputeData(response.data.dmsComputes);
                })
                .catch((err: any) => console.error(err));
        } else if (DmsComputeData?.length > 0) {
            const newComputedataa = newComputeData(DmsComputeData);
            setRowData(newComputedataa);
            setRowCount(newComputedataa.length);
            gridRef?.current!?.api?.sizeColumnsToFit();
        } else {
            setRowData([]);
            window.removeEventListener('resize', () => {
                gridRef?.current!?.api?.sizeColumnsToFit();
            });
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
        setRowCount(gridRef.current!.api.getModel().getRowCount());
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
                                <Text ml={'14'}>{rowCount} Records</Text>
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
                                    pagination={true}
                                    paginationPageSize={10}
                                    columnDefs={columnDefs}
                                    onCellClicked={onCellClicked}
                                    onRowClicked={(e) => console.log('row clicked', e.rowIndex)}
                                    rowSelection={'single'}
                                    animateRows={true}
                                ></AgGridReact>
                            </Box>
                        </Box>
                    </Box>
                    {createModal.isOpen && <ComputeJsonModal isOpen={createModal.isOpen} isEdit={isEdit} onClose={createModal.onClose} />}
                    {alertConfirm.isOpen && <AlertConfirmComponent isOpen={alertConfirm.isOpen} onClose={alertConfirm.onClose} options={alertConfirmForDefaultFlag} confirm={confirmAlertAction} />}
                    {deleteCompute.isOpen && (
                        <AlertConfirmComponent isOpen={deleteCompute.isOpen} onClose={deleteCompute.onClose} options={alertConfirmForDelete} confirm={confirmAlertActionForDelete} />
                    )}
                    {stopComputeRunning.isOpen && (
                        <AlertConfirmComponent isOpen={stopComputeRunning.isOpen} onClose={stopComputeRunning.onClose} options={alertConfirmForStop} confirm={confirmAlertActionForStop} />
                    )}
                    {refreshCompute.isOpen && (
                        <AlertConfirmComponent isOpen={refreshCompute.isOpen} onClose={refreshCompute.onClose} options={alertConfirmForRefresh} confirm={confirmAlertActionForRefresh} />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default Compute;
