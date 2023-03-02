import React, { useEffect, useMemo, useRef, useState, useContext } from 'react';
import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    Spinner,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody
} from '@chakra-ui/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { v4 } from 'uuid';

import { PlayIcon, ReStartIcon, EditIcon, DeleteIcon, StopCompute } from '../../assets/icons';

import client from '../../apollo-client';
import { dmsDeleteCompute, dmsEditCompute, dmsStopComputeRun, getComputeListData } from '../../query';
import {
    ComputeDelete,
    ComputeDetailListResponse,
    ComputeStop,
    DeleteComputeDetail,
    EditCompute,
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
import { updateDmsComputeData, getAndUpdateDbSettingsData, onPlayClickHandler } from '../../zustandActions/computeActions';
import { submitMessage } from '../../zustandActions/socketActions';
import { Action } from '@antuit/web-sockets-gateway-client';
import { newComputeData } from './generateNewComputeData';
import { disperseMessage } from '../../models/messages';
import { useNavigate } from 'react-router-dom';
import { createStandaloneToast } from '@chakra-ui/react';
import { DeleteConfirmationModal } from '../../component/modalSystem/deleteConfirmationModal';
import { updateSpinnerInfo } from '../../zustandActions/commonActions';
const { toast } = createStandaloneToast();

const Compute = () => {
    const [DmsComputeData, UserConfig, dbSettingsData, SpinnerInfo] = useAppStore((state: ComputeAppStoreState) => [state.DmsComputeData, state.UserConfig, state.dbSettingsData, state.SpinnerInfo]);
    const opid = v4();
    const textColor = useColorModeValue('light.header', 'dark.white');
    const textColorIcon = useColorModeValue('#666C80', 'white');
    const createModal = useDisclosure();
    const stopComputeRunning = useDisclosure();
    const refreshCompute = useDisclosure();
    const stopSettingDefault = useDisclosure();
    const stopDeletingSettingDefault = useDisclosure();
    const [rowCount, setRowCount] = useState<number | undefined>(0);
    const [globalComputeId, setGlobalComputeId] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState<boolean | undefined>();
    const gridRef = useRef<AgGridReact<DmsComputeData>>(null);
    const navigate = useNavigate();
    const deleteComputeModal = useDisclosure();
    const alertConfirm = useDisclosure();
    const context = useContext(ComputeContext);
    const [rowData, setRowData] = useState<DmsComputeData[]>([]);

    // TODO Write Default Columns Definitions which is common for all

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { headerName: 'Compute Id', field: 'id', cellRenderer: computeIdHandler },
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

    const alertConfirmForDefaultFlag = {
        title: 'Change Default',
        description: "Are you sure? You can't undo this action afterwards.",
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

    const stopSettingIsDefault = {
        title: 'Not Possible',
        description: 'You must have at least 1 default compute',
        cancelButtonTitle: 'Cancel',
        confirmButtonTitle: 'Confirm'
    };

    const stopDeletingIsSettingDefault = {
        title: 'Not Possible',
        description: 'Please set a new default for compute before deleting.',
        cancelButtonTitle: 'Cancel',
        confirmButtonTitle: 'Confirm'
    };

    // TODO Convert the below and wrap it in a  lifecycle hook
    // const autoSizeAll = useCallback((skipHeader: boolean) => {
    //     const allColumnIds: string[] = [];
    //     gridRef.current!.columnApi.getColumns()!.forEach((column) => {
    //         allColumnIds.push(column.getId());
    //     });
    //     gridRef.current!.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    // }, []);

    window.addEventListener('resize', () => {
        // TODO Convert the sizeColumnsTOFIt to autosize as above
        gridRef?.current!?.api?.sizeColumnsToFit();
    });

    const gridStyle = useMemo(() => ({ height: '500px', width: '99%' }), []);

    // const onComputeStarted = () => {
    //     let currentValue = select(useAppStore.getState());
    //     if (currentValue) {
    //         console.log('current VLUE', currentValue);
    //         // setComputeStats(currentValue);
    //         // setConnected(true);
    //     }
    // };

    // const select = (state: { lastAliveMessage: string }) => {
    //     return state.lastAliveMessage;
    // };

    const confirmAlertActionForStop = () => {
        client
            .mutate<ComputeStop<StopComputeDetail>>({
                mutation: dmsStopComputeRun(globalComputeId)
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
                    const newData = DmsComputeData.map((computeData) => {
                        if (computeData.id === globalComputeId) {
                            computeData.status = 'STOPPED';
                            return computeData;
                        } else {
                            return computeData;
                        }
                    });
                    useAppStore.setState(() => ({ DmsComputeData: newData }));
                    if (UserConfig && globalComputeId) {
                        const shutDownRequest = BusHelper.GetShutdownRequestMessage({
                            experimentId: parseInt(globalComputeId),
                            opId: opid,
                            userId: globalComputeId
                        });

                        submitMessage([{ content: { action: Action.Unsubscribe, subject: `dms_pid.out.${globalComputeId}` } }, { content: shutDownRequest }]);
                    }
                    setGlobalComputeId(null);
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
                setGlobalComputeId(null);
            });
    };

    const onDeleteClickHandler: agGridClickHandler = (data) => {
        if (!data.is_default) {
            setGlobalComputeId(data?.id);
            deleteComputeModal.onOpen();
        } else {
            stopDeletingSettingDefault.onOpen();
        }
    };

    const onStopClickHandler: agGridClickHandler = (data) => {
        setGlobalComputeId(data?.id);
        stopComputeRunning.onOpen();
    };

    const onRefreshClickHandler: agGridClickHandler = (data) => {
        setGlobalComputeId(data?.id);
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
            terminate_after: data?.max_inactivity_min ? true : false,
            computeHeadingId: data?.id
        });
        setIsEdit(true);
        if (!dbSettingsData.length) {
            const check = getAndUpdateDbSettingsData();
            check && createModal.onOpen();
        } else {
            createModal.onOpen();
        }
    };

    function actionsRow(params: any) {
        return (
            <Flex height={'inherit'} justifyContent="space-between" alignItems={'center'}>
                {params?.data?.status === 'STOPPED' ? (
                    <div className="icons" onClick={() => onPlayClickHandler(params.data.id)}>
                        <PlayIcon />
                    </div>
                ) : (
                    <div className="icons" onClick={() => onStopClickHandler(params.data)}>
                        <StopCompute />
                    </div>
                )}
                <div className="icons" onClick={() => onEditClickHandler(params.data)}>
                    <EditIcon />
                </div>
                <div className="icons" onClick={() => onDeleteClickHandler(params.data)} style={{ cursor: 'pointer' }}>
                    <DeleteIcon color={textColorIcon} height={'18px'} width={'16px'} />
                </div>
                <div className="icons" onClick={() => onRefreshClickHandler(params.data)}>
                    <ReStartIcon />
                </div>
            </Flex>
        );
    }

    const defaultRowOnChange = (data: any) => {
        if (!data.is_default) {
            setGlobalComputeId(data.id);
            alertConfirm.onOpen();
        } else {
            stopSettingDefault.onOpen();
        }
    };

    const submitDeleteHandler = () => {
        client
            .mutate<ComputeDelete<DeleteComputeDetail>>({
                mutation: dmsDeleteCompute(globalComputeId)
            })
            .then(() => {
                toast({
                    title: `Compute is deleted successfully`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                const newData = DmsComputeData.filter((computeData: any) => computeData.id !== globalComputeId);
                useAppStore.setState(() => ({ DmsComputeData: newData }));
                deleteComputeModal.onClose();
                setGlobalComputeId(null);
            })
            .catch((err: any) => {
                toast({
                    title: err.message,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                deleteComputeModal.onClose();
            });
    };

    const confirmAlertActionForRefresh = () => {
        const messageQue: Array<disperseMessage> = [];
        const aliveMessage = BusHelper.GetKeepAliveRequestMessage({
            experimentId: 1,
            opId: opid,
            userId: globalComputeId
        });
        messageQue.push({ content: { action: Action.Subscribe, subject: `dms_pid.out.${globalComputeId}` } });
        messageQue.push({ content: aliveMessage });
        submitMessage(messageQue);
        setGlobalComputeId(null);
        toast({
            title: `Compute refreshed successfully`,
            status: 'success',
            isClosable: true,
            duration: 5000,
            position: 'top-right'
        });
        refreshCompute.onClose();
    };

    const confirmAlertActionForIsdefaultChange = () => {
        stopSettingDefault.onClose();
    };

    const confirmAlertActionForIsdefaultDelete = () => {
        stopDeletingSettingDefault.onClose();
    };

    const confirmAlertAction = () => {
        client
            .mutate<EditCompute<any>>({
                mutation: dmsEditCompute(globalComputeId, true)
            })
            .then(() => {
                alertConfirm.onClose();

                const newData = DmsComputeData.map((computeData) => {
                    if (globalComputeId === computeData.id) {
                        computeData.is_default = true;
                        return computeData;
                    }

                    if (computeData.is_default) {
                        computeData.is_default = false;
                        return computeData;
                    }

                    if (!(globalComputeId === computeData.id) && !computeData.is_default) {
                        return computeData;
                    }
                });

                useAppStore.setState(() => ({ DmsComputeData: newData }));
                toast({
                    title: `Your Default is changed`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                setGlobalComputeId(null);
            })
            .catch((error: any) => {
                toast({
                    title: error.message,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                setGlobalComputeId(null);
                deleteComputeModal.onClose();
            });
    };

    function defaultRow(params: any) {
        return <SwitchComponent params={params} gridRef={gridRef} defaultRowOnChange={() => defaultRowOnChange(params.data)} />;
    }

    const navigateToComputeDetails = (id: string) => {
        navigate('/computedetails/' + id);
    };

    function computeIdHandler(params: any) {
        return (
            <div className="computeIdCell" onClick={() => navigateToComputeDetails(params.data.id)}>
                {params.data.id}
            </div>
        );
    }

    const onCellClicked = (params: any) => {
        actionsRow(params.data);
    };

    const triggerCreateModal = () => {
        context.updateFormData({
            id: '',
            max_inactivity_min: 8,
            compute_name: 'My Compute',
            autoscale: false,
            workers: null,
            spot_instances: false,
            worker_type_id: 'Standard_DS3_v2',
            min_workers: 2,
            max_workers: 2,
            enable_autoscaling: false,
            terminate_after: true
        });
        setIsEdit(false);
        if (!dbSettingsData.length) {
            updateSpinnerInfo({ loading: true, to: 'dbSettingData' });
            const check = getAndUpdateDbSettingsData();
            check && createModal.onOpen();
        } else {
            createModal.onOpen();
        }
    };

    const onSearchChange = (searchValue: string) => {
        gridRef.current!.api.setQuickFilter(searchValue);
        setRowCount(gridRef.current!.api.getModel().getRowCount());
    };

    const computeData = DmsComputeData && DmsComputeData.filter((computeData: any) => computeData.id === globalComputeId);
    if (!computeData) {
        return <div>loading...</div>;
    }

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
                        {SpinnerInfo.loading && SpinnerInfo.to && <Spinner className="spinner" size="xl" thickness="4px" />}

                        <Box mr={'17'} mb={'17'}>
                            <Box style={gridStyle} className="ag-theme-alpine" ml={'23'}>
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
                    {alertConfirm.isOpen && (
                        <AlertConfirmComponent
                            isOpen={alertConfirm.isOpen}
                            onClose={() => {
                                alertConfirm.onClose();
                                setGlobalComputeId(null);
                            }}
                            options={alertConfirmForDefaultFlag}
                            confirm={confirmAlertAction}
                        />
                    )}
                    {deleteComputeModal.isOpen && (
                        <DeleteConfirmationModal
                            isOpen={deleteComputeModal.isOpen}
                            onClose={deleteComputeModal.onClose}
                            submitDeleteHandler={submitDeleteHandler}
                            options={{ name: computeData[0]?.name, label: 'compute', placeholder: 'My Compute 00' }}
                        />
                    )}

                    {stopComputeRunning.isOpen && (
                        <AlertConfirmComponent
                            isOpen={stopComputeRunning.isOpen}
                            onClose={() => {
                                setGlobalComputeId(null);
                                stopComputeRunning.onClose();
                            }}
                            options={alertConfirmForStop}
                            confirm={confirmAlertActionForStop}
                        />
                    )}
                    {refreshCompute.isOpen && (
                        <AlertConfirmComponent
                            isOpen={refreshCompute.isOpen}
                            onClose={() => {
                                setGlobalComputeId(null);
                                refreshCompute.onClose();
                            }}
                            options={alertConfirmForRefresh}
                            confirm={confirmAlertActionForRefresh}
                        />
                    )}
                    {stopSettingDefault.isOpen && (
                        <AlertConfirmComponent isOpen={stopSettingDefault.isOpen} onClose={stopSettingDefault.onClose} options={stopSettingIsDefault} confirm={confirmAlertActionForIsdefaultChange} />
                    )}
                    {stopDeletingSettingDefault.isOpen && (
                        <AlertConfirmComponent
                            isOpen={stopDeletingSettingDefault.isOpen}
                            onClose={stopDeletingSettingDefault.onClose}
                            options={stopDeletingIsSettingDefault}
                            confirm={confirmAlertActionForIsdefaultDelete}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default Compute;
