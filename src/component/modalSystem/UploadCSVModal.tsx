import React, { useState } from 'react';
import { Button, Divider, Modal, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, ModalFooter, useColorModeValue, Center, Flex, Box, Text, Avatar } from '@chakra-ui/react';
import TickIcon from '../../assets/icons/TickIcon';
import FileUploadComponent from '../../pages/dataset/fileUpload/FileUploadComponent';

const UploadCSVModal = (props: any) => {
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const datasetTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const titleDarkCSV = useColorModeValue('default.blackText', 'default.whiteText');
    const finalRef = React.useRef(null);
    const [loading] = useState(false);

    return (
        <Modal size={'lg'} closeOnOverlayClick={false} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />

            <ModalContent minWidth={'901px'} height={'668px'}>
                <ModalHeader color={titleDarkCSV} mt={'13px'} ml={'20px'}>
                    Create Dataset
                </ModalHeader>
                <ModalCloseButton color={textColor} mr={'10px'} mt={'12px'} />
                <Divider color={'default.dividerColor'} mt={'13px'} mb={'19px'} />
                <Center>
                    <Box>
                        <Avatar borderRadius="full" boxSize="32px" icon={<TickIcon />} bg={'default.toolbarButton'} color={'default.whiteText'} mb={'8px'} />
                        <Text ml={'-8px'}>Details</Text>
                    </Box>
                    <Divider orientation="horizontal" maxWidth={'96px'} mr={'16px'} mt={'-22px'} />
                    <Box>
                        <Avatar borderRadius="full" boxSize="32px" name={'2'} bg={'default.toolbarButton'} color={'default.whiteText'} mb={'8px'} />
                        <Text ml={'-8px'}>Source</Text>
                    </Box>
                    <Divider orientation="horizontal" maxWidth={'96px'} mr={'16px'} mt={'-22px'} colorScheme={'#929AA9'} />
                    <Box>
                        <Avatar borderRadius="full" boxSize="32px" name={'3'} bg={'default.bgDatasetLevels'} color={'default.whiteText'} mb={'8px'} />
                        <Text ml={'-8px'}> Preview</Text>
                    </Box>
                </Center>
                <Flex>
                    <Box width={'55%'} ml={'21'} mt={'17'}>
                        <Flex mb={'19px'} fontSize={'21px'}>
                            <Text color={datasetTitleColor}>Dataset ID:</Text>
                            <Text color={titleDarkCSV} ml={'8px'}>
                                f8iEY4
                            </Text>
                            <Text color={datasetTitleColor} ml={'20px'}>
                                Dataset Name:
                            </Text>
                            <Text color={titleDarkCSV} ml={'8px'}>
                                My Dataset 1
                            </Text>
                        </Flex>
                        <Text fontWeight={700} color={datasetTitleColor}>
                            Upload CSV Files
                        </Text>
                        <Box mt={'8px'} width={'856px'} height={'315px'} border={'2px'} borderRadius={4} borderColor={'#E0E3E9'} borderStyle={'dashed'}>
                            <Center>
                                <Box>
                                    <FileUploadComponent></FileUploadComponent>
                                </Box>
                            </Center>
                        </Box>
                    </Box>
                </Flex>
                <Divider color={'default.dividerColor'} mt={'24px'} width={'auto'} />
                <ModalFooter mt={'20px'} mr={'20px'}>
                    <Button
                        disabled={loading}
                        onClick={props.onClose}
                        colorScheme="gray"
                        bg={'white'}
                        color={'default.toolbarButton'}
                        width={'81px'}
                        border={'1px'}
                        borderColor={'default.toolbarButton'}
                        height={'40px'}
                        borderRadius={4}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={loading}
                        colorScheme="gray"
                        bg={'white'}
                        color={'default.toolbarButton'}
                        width={'81px'}
                        border={'1px'}
                        borderColor={'default.toolbarButton'}
                        height={'40px'}
                        borderRadius={4}
                        ml={'20px'}
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={loading}
                        colorScheme="gray"
                        bg={'white'}
                        color={'default.toolbarButton'}
                        width={'81px'}
                        border={'1px'}
                        borderColor={'default.toolbarButton'}
                        height={'40px'}
                        borderRadius={4}
                        ml={'20px'}
                    >
                        Next
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UploadCSVModal;
