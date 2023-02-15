import React, { useMemo, useRef, useState, useContext } from 'react';
import {
    Box,
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
    Stack
} from '@chakra-ui/react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import SearchComponent from '../../component/search/SearchComponent';
import { DownloadIcon } from '../../assets/icons/DownloadIcon';
import { SamplePic } from '../../assets/icons';
const LineageModal = (props: any) => {
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const { onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const gridRef = useRef<AgGridReact<any>>(null);
    const onSearchChange = (searchValue: string) => {
        gridRef.current!.api.setQuickFilter(searchValue);
    };

    return (
        <Modal size={'7xl'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent width={'1238px'} borderRadius={'2'} maxHeight={'829px'}>
                <ModalHeader color={shretextColor} mt={'13'} mb={'15'} ml={20}>
                    Lineage
                </ModalHeader>
                <ModalCloseButton mt={'18'} mr={'10px'} color={textColor2} />
                <Divider color={'default.dividerColor'} />
                <ModalBody>
                    <FormControl mt={4}>
                        <Center flex="3" mt="17" fontWeight={'700'} mb="17">
                            <Box ml={'21'} color={'textColor'}>
                                <Text>Data Lineage Details</Text>
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
                        <Box mb={'17'} ml={'21'} mr={'19'} border={'1px'} borderColor={'#D8DCDE'} width={'1189px'} height={'536px'}>
                            <SamplePic />
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

export default LineageModal;
