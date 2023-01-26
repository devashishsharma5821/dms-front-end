import React, { useMemo, useRef, useState } from 'react';
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
import { DownloadIcon } from '@chakra-ui/icons';
import ReactECharts from 'echarts-for-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import { OutputDetail } from '../../models/outputDetail';
import { AgGridReact } from 'ag-grid-react';
import SearchComponent from '../../component/search/SearchComponent';
import chart from '../../models/data';

const ViewData = (props: any) => {
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const { onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState<boolean>(false);
    const gridRef = useRef<AgGridReact<any>>(null);
    const onSearchChange = (searchValue: string) => {
        gridRef.current!.api.setQuickFilter(searchValue);
    };
    const viewDataColumnData = {
        data: [
            {
                variableGlobal: 'Mean',
                valueGlobal: '3.3456'
            },
            {
                variableGlobal: 'Median',
                valueGlobal: '1'
            },
            {
                variableGlobal: 'Min',
                valueGlobal: '1'
            },
            {
                variableGlobal: 'Max',
                valueGlobal: '10'
            },
            {
                variableGlobal: 'Standard Division',
                valueGlobal: '3.67843'
            },
            {
                variableGlobal: 'Unique Values',
                valueGlobal: '10'
            },
            {
                variableGlobal: 'Missing Values',
                valueGlobal: '0'
            }
        ]
    };
    const [rowData, setRowData] = useState<any[]>([
        {
            Column_1: 'Data/Number',
            Column_2: 'Data/Number',
            Column_3: 'Data/Number',
            Column_4: 'Data/Number',
            Column_5: 'Data/Number'
        },
        {
            Column_1: 'Data/Number',
            Column_2: 'Data/Number',
            Column_3: 'Data/Number',
            Column_4: 'Data/Number',
            Column_5: 'Data/Number'
        },
        {
            Column_1: 'Data/Number',
            Column_2: 'Data/Number',
            Column_3: 'Data/Number',
            Column_4: 'Data/Number',
            Column_5: 'Data/Number'
        }
    ]);
    const [columnDefs] = useState<ColDef[]>([
        { headerName: 'Column 1', field: 'Column_1' },
        { headerName: 'Column 2', field: 'Column_2' },
        { headerName: 'Column 3', field: 'Column_3' },
        { headerName: 'Column 4', field: 'Column_4' },
        { headerName: 'Column 5', field: 'Column_5' }
    ]);

    const gridStyle = useMemo(() => ({ height: '500px', width: '99%' }), []);

    return (
        <Modal size={'6x3'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent width={'1516px'} borderRadius={'8'} maxHeight={'852px'}>
                <ModalHeader color={shretextColor} mt={'13'} mb={'15'} ml={20}>
                    View Data - Join Tables
                </ModalHeader>
                <ModalCloseButton mt={'18'} mr={'10px'} color={textColor2} />
                <Divider color={'default.dividerColor'} />
                <ModalBody>
                    <FormControl mt={4}>
                        <Center>
                            <Box borderWidth="1px" ml={'24'} borderRadius="lg" mt={'18'} mb={'18'} mr={'21'} width={'917px'} height={'655px'}>
                                <Center flex="3" mt="17" fontWeight={'700'} mb="17">
                                    <Box ml={'23'} color={'textColor'}>
                                        <Text>Join Tables Details</Text>
                                    </Box>
                                    <Center color={'default.containerAgGridRecords'}>
                                        <Text ml={'14'}>1000 </Text>
                                        <Text ml={'4'} fontWeight={400}>
                                            Records
                                        </Text>
                                    </Center>
                                    <Center color={'default.containerAgGridRecords'}>
                                        <Text ml={'14'}>3245 </Text>
                                        <Text ml={'4'} fontWeight={400}>
                                            Rows
                                        </Text>
                                    </Center>
                                    <Center color={'default.containerAgGridRecords'}>
                                        <Text ml={'14'}>56 </Text>
                                        <Text ml={'4'} fontWeight={400}>
                                            Columns
                                        </Text>
                                    </Center>

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
                                <Box ml={'23'} mr={'12'} borderColor={'light.lighterGrayishBlue'} width={'868px'} mt={'18'}>
                                    <Box style={gridStyle} className="ag-theme-alpine">
                                        {loading && <Spinner ml={20}></Spinner>}
                                        <AgGridReact<OutputDetail> ref={gridRef} rowData={rowData} columnDefs={columnDefs} rowSelection={'single'} animateRows={true} pagination={true}></AgGridReact>
                                    </Box>
                                </Box>
                            </Box>
                            <Box mr={'20'}>
                                <Box width={'531px'} height={'261px'} border={'1px'} borderRadius={'8'} borderColor={'light.lighterGrayishBlue'}>
                                    <Text ml={20} color={shretextColor} mt={'20px'} fontWeight={700}>
                                        Statistics
                                    </Text>

                                    {viewDataColumnData.data.map((icons: { variableGlobal: string; valueGlobal: string }) => {
                                        return (
                                            <>
                                                <Flex>
                                                    <Center fontWeight={400}>
                                                        <Box width={'160px'}>
                                                            <Text ml={20} color={shretextColor} fontWeight={400}>
                                                                {icons.variableGlobal}
                                                            </Text>
                                                        </Box>
                                                        <Box>
                                                            <Text ml={40} color={shretextColor} mb={4} fontWeight={600}>
                                                                {icons.valueGlobal}
                                                            </Text>
                                                        </Box>
                                                    </Center>
                                                </Flex>
                                            </>
                                        );
                                    })}
                                </Box>

                                <Box width={'530px'} height={'369px'} border={'1px'} borderRadius={'8'} borderColor={'light.lighterGrayishBlue'} mt={'24'}>
                                    <Text ml={20} color={shretextColor} mt={'20px'} fontWeight={700}>
                                        Histogram
                                    </Text>
                                    <Box ml={'17'} color={shretextColor} fontWeight={400}>
                                        <Text>Data frequency and age detail</Text>
                                    </Box>
                                    <Box ml={'17'}>
                                        <ReactECharts option={chart} />
                                    </Box>
                                </Box>
                            </Box>
                        </Center>
                    </FormControl>
                </ModalBody>

                <Divider color={'default.dividerColor'} />
                <ModalFooter>
                    <Button onClick={onClose} bg={'default.shareModalButton'} borderRadius={'2'} mb={'19px'} mr={'20'} mt={'19'} width={'72px'} height={'40px'}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ViewData;
