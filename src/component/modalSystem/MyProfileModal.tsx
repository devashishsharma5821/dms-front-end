import React from 'react';
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
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Modal,
    Divider,
    Avatar
} from '@chakra-ui/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const MyProfileModal = (props: any) => {
    const accesstextColor = useColorModeValue('default.blackText', 'default.whiteText');
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const closeButton = useColorModeValue('default.darkGrayCreate', 'default.whiteText');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    return (
        <Modal closeOnOverlayClick={false} size={'md'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent minWidth={'496px'} borderRadius={'2'} maxHeight={'551px'}>
                <ModalHeader color={shretextColor} mt={'13'} mb={'15'} ml={20}>
                    My Profile
                </ModalHeader>
                <ModalCloseButton mt={'18'} mr={'10px'} color={closeButton} />
                <Divider color={'default.dividerColor'} />
                <ModalBody width={'496px'}>
                    <Box>
                        <Center>
                            <Flex width={'454px'} maxHeight={'382px'}>
                                <Avatar
                                    fontWeight={700}
                                    borderRadius="full"
                                    size={"full"}
                                    boxSize="100px"
                                    name={`${props.userDetail?.firstName} ${props.userDetail?.lastName}`}
                                    color={'default.whiteText'}
                                    mt={'16px'}
                                    ml={'17px'}
                                />
                                <Center ml={'19px'}>
                                    <Box width={'450px'}>
                                        <Text mt={'15px'} color={textColor2} fontWeight={700}>
                                            {props.userDetail?.firstName} {props.userDetail?.lastName}
                                        </Text>
                                        <Text color={accesstextColor} fontWeight={400}>
                                            {props.userDetail?.email}
                                        </Text>
                                        <Text mt={'15px'} color={textColor2} fontWeight={600}>
                                            Your Info
                                        </Text>
                                        <Text maxWidth={'298px'} color={accesstextColor} fontWeight={400} mt={'6px'} mb={'32px'}>
                                            No Info Available.
                                        </Text>
                                    </Box>
                                </Center>
                            </Flex>
                        </Center>
                        {/* <Box ml={'20px'}>
                            <Flex flexDir={'row'} ml={'17px'}>
                                <Box>
                                    <Text color={textColor2} mt={'12px'}>
                                        User Name
                                    </Text>
                                    <Text color={accesstextColor} fontWeight={700}>
                                        GT20654
                                    </Text>
                                </Box>
                                <Box ml={'115px'}>
                                    <Text color={textColor2} mt={'12px'}>
                                        Role
                                    </Text>
                                    <Text color={accesstextColor} fontWeight={700}>
                                        Data Scientist
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex flexDir={'row'} ml={'17px'}>
                                <Box>
                                    <Text color={textColor2} mt={'12px'}>
                                        Organization
                                    </Text>
                                    <Text color={accesstextColor} fontWeight={700}>
                                        ZEBRA
                                    </Text>
                                </Box>
                                <Box ml={'40px'}>
                                    <Text color={textColor2} mt={'12px'}>
                                        Last Login
                                    </Text>
                                    <Text color={accesstextColor} fontWeight={700}>
                                        10 Mins ago
                                    </Text>
                                </Box>
                            </Flex>
                        </Box> */}
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
                    {/*<Button*/}
                    {/*    bg={'default.whiteText'}*/}
                    {/*    borderRadius={4}*/}
                    {/*    mb={19}*/}
                    {/*    mr={20}*/}
                    {/*    mt={'19'}*/}
                    {/*    width={'82px'}*/}
                    {/*    height={'36px'}*/}
                    {/*    border={'1px'}*/}
                    {/*    borderColor={'default.textButton'}*/}
                    {/*    color={'default.textButton'}*/}
                    {/*>*/}
                    {/*    Save*/}
                    {/*</Button>*/}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default MyProfileModal;
