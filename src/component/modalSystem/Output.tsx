import React, { useEffect, useMemo, useRef, useState, useContext } from 'react';
import { Box, Flex, Text, useColorModeValue, Button, Center, useDisclosure, ModalOverlay, ModalContent, ModalHeader, FormControl, ModalBody, ModalCloseButton, ModalFooter, Modal, Divider, Checkbox, Stack, Spinner, } from '@chakra-ui/react';
import {  DownloadIcon } from '@chakra-ui/icons';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {  useToast } from '@chakra-ui/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import PlayIcon from '../../assets/icons/PlayIcon';
import ReStartIcon from '../../assets/icons/ReStartIcon';
import EditIcon from '../../assets/icons/EditIcon';
import DeleteIcon from '../../assets/icons/DeleteIcon';
import { StopCompute } from '../../assets/icons';
import client from '../../apollo-client';
import { dmsRunCompute, getComputeListData, wsconnect } from '../../query';
import { ComputeDetail, ComputeDetailListResponse, ComputeRun, RunComputeDetail } from '../../models/computeDetails';
import { AgGridReact } from 'ag-grid-react';
import SearchComponent from '../../component/search/SearchComponent';
import useAppStore from '../../store';
import { agGridClickHandler } from '../../models/computeDetails';
import { ComputeContext } from '../../context/computeContext';
import { BusHelper } from '../../helpers/BusHelper';
import gql from 'graphql-tag';
import { v4 } from 'uuid';
import SwitchComponent from '../../pages/compute/SwitchComponent';
const Output = (props: any) => {
    const textColorIcon = useColorModeValue('#666C80', 'white');
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const {  onClose } = useDisclosure()
    const createModal = useDisclosure();
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [loading, setLoading] = useState<boolean>(false);
    const gridRef = useRef<AgGridReact<ComputeDetail>>(null);
    const onSearchChange = (searchValue: string) => {
        gridRef.current!.api.setQuickFilter(searchValue);
    };
    const triggerCreateModal = () => {
        createModal.onOpen();
    };
    const [rowData, setRowData] = useState<ComputeDetail[]>([]);
    const [columnDefs] = useState<ColDef[]>([
        { headerName: 'File Name', field: 'name' },
        { headerName: 'Created On', field: 'created_at' },
        { headerName: 'Source Transformer', field: 'resources.num_workers' },
        { headerName: 'File Size', field: 'activeMemory' },
        { headerName: 'Actions', field: 'Actions' }
    ]);
    const opid = v4();
    const textColor = useColorModeValue('light.header', 'dark.white');
    const EditComputeJsonModal = useDisclosure();
    const StopComputeRunning = useDisclosure();
    const [cellId, setCellId] = useState<string>();
    const [isEdit, setIsEdit] = useState<boolean | undefined>();
    const deleteCompute = useDisclosure();
    const [deleteCellId, setdeleteCellId] = useState<string | undefined>();
    const [stopCellId, setStopCellId] = useState<string | undefined>();
    const toast = useToast();
    const context = useContext(ComputeContext);
    const [DmsComputeData, updateDmsComputeData, submitMessage] = useAppStore((state: any) => [state.DmsComputeData, state.updateDmsComputeData, state.submitMessage]);    const gridStyle = useMemo(() => ({ height: '500px', width: '99%' }), []);
    const onComputeStarted = () => {
        let currentValue = select(useAppStore.getState());
        if (currentValue) {
            console.log('current VLUE', currentValue);
            // setComputeStats(currentValue);
            // setConnected(true);
        }
    };
    const select = (state: any) => {
        return state.lastAliveMessage;
    };
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
                    .then((response) => {
                        let computedata = [...response.data.dmsComputes];
                        updateDmsComputeData(computedata);
                        if (cellId) {
                            const aliveMessage = BusHelper.GetKeepAliveRequestMessage({
                                experimentId: parseInt(cellId),
                                opId: opid,
                                userId: cellId
                            });
                            submitMessage({
                                content: aliveMessage
                            });
                            console.log('liveMessage', aliveMessage);
                            wsconnect(aliveMessage);
                        }
                        let unsubscribe = useAppStore.subscribe(onComputeStarted);
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
                    <DeleteIcon  height={'18px'} width={'16px'} />
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


    useEffect(() => {
        console.log('DMSCOmputrData', DmsComputeData);
        if (DmsComputeData === null) {
            const { GET_COMPUTELIST } = getComputeListData();
            client
                .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                    query: GET_COMPUTELIST
                })
                .then((response) => {
                    let computedata = [...response.data.dmsComputes];
                    setRowData(computedata);
                    gridRef?.current!?.api?.sizeColumnsToFit();
                    updateDmsComputeData(response.data.dmsComputes);
                    //updateTransformersData(transformerdata)
                })
                .catch((err) => console.error(err));
        } else if (DmsComputeData?.length > 0) {
            setRowData(DmsComputeData);
            gridRef?.current!?.api?.sizeColumnsToFit();
        } else {
            setRowData([]);
        }
    }, [DmsComputeData]);

    const onCellClicked = (params: any) => {
        setCellId(params.data.id);
        actionsRow(params.data.id);
    };

    return (
          
        <Modal size={'6xl'}
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={props.isOpen}
            onClose={props.onClose}
            isCentered
        
            >        
          <ModalOverlay />
          <ModalContent width={'1229px'} borderRadius={'2'} maxHeight={'829px'} >
            <ModalHeader  color={shretextColor} mt={'13'} mb={'15'} ml={20}>Output</ModalHeader>
                <ModalCloseButton  mt={'18'} mr={'10px'} color={textColor2} />
                <Divider color={"default.dividerColor"}/>
            <ModalBody >

                    
                <FormControl mt={4}>
                <Box borderWidth="1px" ml={'24'} borderRadius="lg" mt={'24'}  mr={'21'} >
                        <Center flex="3" mt="17" fontWeight={'700'} mb="17">
                            <Box ml={'23'} color={'textColor'} >
                                <Text>Output Details</Text>
                            </Box>
                            <Box color={'default.containerAgGridRecords'}>
                                <Text ml={'14'}>11 Records</Text>
                            </Box>

                            <Center flex="3"  justifyContent={'flex-end'} ml={'17'}  mr={'21px'}>
                                <Box>
                                    <SearchComponent searchChange={onSearchChange} />
                                </Box>
                                <Stack direction="row" height={'30'} border={'3'}>
                                    {' '}
                                    <Divider orientation="vertical" ml={'14'} mr={'14'} />
                                </Stack>

                                <Box >
                                   <DownloadIcon/>
                                </Box>
                            </Center>
                        </Center>
                        <Box  mb={'17'}  ml={'23'} mr={'12'} >
                            <Box style={gridStyle} className="ag-theme-alpine"  >
                                {loading && <Spinner ml={20}></Spinner>}
                                <AgGridReact<ComputeDetail>
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    rowSelection={'single'}
                                    animateRows={true}
                                    pagination={true}
                                    onCellClicked={onCellClicked}
                                >
                                </AgGridReact>
                            </Box>
                        </Box>
                        </Box>
                       
             
                </FormControl>    
            </ModalBody>
                
                <Divider color={"default.dividerColor"} mt={'21px'} />
                <ModalFooter >

                 <Button onClick={onClose} bg={'default.shareModalButton'} borderRadius={'2'} mb={19} mr={20} mt={'19'} width={'72px'} height={'40px'}>Close</Button>
                  
                </ModalFooter>
          </ModalContent>
        </Modal>
        
    );
};

export default Output;