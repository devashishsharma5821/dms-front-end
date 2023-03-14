import React, { useMemo, useRef, useState } from 'react';
import {
    Box,
    Flex,
    Text,
    useColorModeValue,
    Button,
    Center,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Modal,
    Divider,
    Avatar, Spinner
} from '@chakra-ui/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { OutputDetail } from '../../models/outputDetail';
import { ColDef } from 'ag-grid-community';

const DatasourcePreviewModal = (props: any) => {
    const accesstextColor = useColorModeValue('default.blackText', 'default.whiteText');
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const closeButton = useColorModeValue('default.darkGrayCreate', 'default.whiteText');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    console.log('Preivew3 Data', props.previewData);
    const gridRef = useRef<AgGridReact<any>>(null);
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
        <Modal closeOnOverlayClick={false} size={'md'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent minWidth={'496px'} borderRadius={'2'} maxHeight={'551px'}>
                <ModalHeader color={shretextColor} mt={'13'} mb={'15'} ml={20}>
                    Create Dataset
                </ModalHeader>
                <ModalCloseButton mt={'18'} mr={'10px'} color={closeButton} />
                <Divider color={'default.dividerColor'} />
                <ModalBody width={'496px'}>
                    <Box>
                        <Box ml={'23'} mr={'12'} borderColor={'light.lighterGrayishBlue'} width={'496px'} mt={'18'}>
                            <Box style={gridStyle} className="ag-theme-alpine">
                                <AgGridReact<OutputDetail> ref={gridRef} rowData={rowData} columnDefs={columnDefs} animateRows={true}></AgGridReact>
                            </Box>
                        </Box>
                    </Box>
                </ModalBody>

                <Divider color={'default.dividerColor'} mt={'16px'} />
                <ModalFooter>
                    <Button
                        onClick={props.onClose}
                        bg={'default.whiteText'}
                        borderRadius={4}
                        mb={19}
                        mr={15}
                        mt={'19'}
                        width={'82px'}
                        height={'36px'}
                        border={'1px'}
                        borderColor={'default.textButton'}
                        color={'default.textButton'}
                    >
                        Cancel
                    </Button>
                    <Button
                        bg={'default.whiteText'}
                        borderRadius={4}
                        mb={19}
                        mr={20}
                        mt={'19'}
                        width={'82px'}
                        height={'36px'}
                        border={'1px'}
                        borderColor={'default.textButton'}
                        color={'default.textButton'}
                    >
                        Create Dataset
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DatasourcePreviewModal;
