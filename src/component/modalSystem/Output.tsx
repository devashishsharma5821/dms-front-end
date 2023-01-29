import React, { useMemo, useRef, useState, useContext } from 'react';
import {
    Box,
    Flex,
    Text,
    useColorModeValue,
    Button,
    Center,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    FormControl,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Modal,
    Divider,
    Stack,
    Spinner
} from '@chakra-ui/react';
import { AttachmentIcon, DownloadIcon } from '@chakra-ui/icons';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import EditIcon from '../../assets/icons/EditIcon';
import { OutputDetail } from '../../models/outputDetail';
import { AgGridReact } from 'ag-grid-react';
import SearchComponent from '../../component/search/SearchComponent';
import { ComputeContext } from '../../context/computeContext';
import { v4 } from 'uuid';
const Output = (props: any) => {
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const { onClose } = useDisclosure();
    const createModal = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState<boolean>(false);
    const gridRef = useRef<AgGridReact<any>>(null);
    const onSearchChange = (searchValue: string) => {
        gridRef.current!.api.setQuickFilter(searchValue);
    };
    const actionsRow = (params: any) => {
        return (
            <Flex height={'inherit'}>
                <Box ml={'-10px'} onClick={() => onEditClickHandler(params.data)}>
                    <EditIcon />
                </Box>
                <Box ml={'18px'}>
                    <AttachmentIcon color={'#666C80'} />
                </Box>
                <Box ml={'18px'}>
                    <DownloadIcon color={'#666C80'} />
                </Box>
            </Flex>
        );
    };
    const [rowData, setRowData] = useState<any[]>([
        {
            name: 'Zubin',
            created_at: '2023-01-18 15:00 PM',
            resources_num_workers: 'Extract Dataframe',
            activeMemory: '25KB'
        },
        {
            name: 'Zubin',
            created_at: '2023-01-18 15:00 PM',
            resources_num_workers: ' Load Dataframe',
            activeMemory: '25KB'
        }
    ]);
    const [columnDefs] = useState<ColDef[]>([
        { headerName: 'File Name', field: 'name', editable: true },
        { headerName: 'Created On', field: 'created_at', editable: true },
        { headerName: 'Source Transformer', field: 'resources_num_workers', editable: true },
        { headerName: 'File Size', field: 'activeMemory', editable: true },
        { headerName: 'Actions', field: 'actionsRow', cellRenderer: actionsRow }
    ]);
    const opid = v4();
    const textColor = useColorModeValue('light.header', 'dark.white');
    const EditComputeJsonModal = useDisclosure();
    const [cellId, setCellId] = useState<string>();
    const [isEdit, setIsEdit] = useState<boolean | undefined>();
    const context = useContext(ComputeContext);
    const gridStyle = useMemo(() => ({ height: '500px', width: '99%' }), []);
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
    const onCellClicked = (params: any) => {
        setCellId(params.data.id);
        actionsRow(params.data.id);
    };

    return (
        <Modal size={'6xl'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent width={'1229px'} borderRadius={'2'} maxHeight={'829px'}>
                <ModalHeader color={shretextColor} mt={'13'} mb={'15'} ml={20}>
                    Output
                </ModalHeader>
                <ModalCloseButton mt={'18'} mr={'10px'} color={textColor2} />
                <Divider color={'default.dividerColor'} />
                <ModalBody>
                    <FormControl mt={4}>
                        <Box borderWidth="1px" ml={'24'} borderRadius="lg" mt={'24'} mr={'21'}>
                            <Center flex="3" mt="17" fontWeight={'700'} mb="17">
                                <Box ml={'23'} color={'textColor'}>
                                    <Text>Output Details</Text>
                                </Box>
                                <Box color={'default.containerAgGridRecords'}>
                                    <Text ml={'14'}>11 Records</Text>
                                </Box>

                                <Center flex="3" justifyContent={'flex-end'} ml={'17'} mr={'21px'}>
                                    <Box>
                                        <SearchComponent searchChange={onSearchChange} />
                                    </Box>
                                    <Stack direction="row" height={'30'} border={'3'}>
                                        {' '}
                                        <Divider orientation="vertical" ml={'14'} mr={'14'} />
                                    </Stack>

                                    <Box>
                                        <DownloadIcon color={'#666C80'} />
                                    </Box>
                                </Center>
                            </Center>
                            <Box mb={'17'} ml={'23'} mr={'12'} borderColor={'#D8DCDE'}>
                                <Box style={gridStyle} className="ag-theme-alpine">
                                    {loading && <Spinner ml={20}></Spinner>}
                                    <AgGridReact<OutputDetail>
                                        ref={gridRef}
                                        rowData={rowData}
                                        columnDefs={columnDefs}
                                        rowSelection={'single'}
                                        animateRows={true}
                                        pagination={true}
                                        onCellClicked={onCellClicked}
                                    ></AgGridReact>
                                </Box>
                            </Box>
                        </Box>
                    </FormControl>
                </ModalBody>

                <Divider color={'default.dividerColor'} mt={'21px'} />
                <ModalFooter>
                    <Button onClick={onClose} bg={'default.shareModalButton'} borderRadius={'2'} mb={19} mr={20} mt={'19'} width={'72px'} height={'40px'}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Output;
