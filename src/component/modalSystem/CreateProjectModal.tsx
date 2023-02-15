import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import {
    Button,
    Divider,
    VStack,
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalCloseButton,
    ModalBody,
    FormControl,
    Input,
    FormLabel,
    ModalFooter,
    FormErrorMessage,
    useColorModeValue,
    Flex,
    Center,
    Box,
    Text,
    useDisclosure,
    Avatar
} from '@chakra-ui/react';
import { CloseIcon } from '../../assets/icons';
import { CopyIcon } from '@chakra-ui/icons';
import Share from './Share';
const CreateProjectModal = (props: any) => {
    const textColor = useColorModeValue('dark.darkGrayCreate', 'default.whiteText');
    const textColorTitle = useColorModeValue('default.titleForShare', 'default.whiteText');
    const projectId = useColorModeValue('default.blackText', 'default.whiteText');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const addShareMemberModal = useDisclosure();
    interface CreateProjectModal {
        createProject: string;
        description: string;
    }

    return (
        <Modal size={'lg'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />

            <ModalContent>
                <ModalHeader fontSize={16} color={textColor} mt={'13px'} ml={'20px'}>
                    Create Project
                </ModalHeader>
                <ModalCloseButton color={textColor} mr={'10px'} mt={'12px'} />
                <Divider color={'default.dividerColor'} mt={'13px'} mb={'20px'} />

                <ModalBody pb={6} mr={'20px'} ml={'21px'}>
                    <Flex mb={'19px'}>
                        <Center>
                            <Text color={textColor}>Project ID:</Text>
                            <Center>
                                <Box height={'24px'} borderRadius={3} minWidth={'auto'} width={'auto'}>
                                    <Flex>
                                        <Center>
                                            <Text color={projectId} fontSize={'16px'} fontWeight={400} ml={8}>
                                                b1af12
                                            </Text>
                                            <Box justifyContent={'flex-end'} ml={'10px'} mr={'6px'}>
                                                <CopyIcon color={'default.darkGrayCreate'} />
                                            </Box>
                                        </Center>
                                    </Flex>
                                </Box>
                            </Center>
                        </Center>
                    </Flex>
                    <Formik
                        initialValues={
                            {
                                validateOnMount: true,
                                createProject: '',
                                description: ''
                            } as CreateProjectModal
                        }
                        validateOnBlur={true}
                        validateOnChange={true}
                        onSubmit={(values) => {
                            setLoading(true);
                        }}
                    >
                        {({ handleSubmit, errors, touched, isValid }) => (
                            <form onSubmit={handleSubmit}>
                                <VStack align="flex-start">
                                    <FormControl isInvalid={!!errors.createProject && touched.createProject} isRequired>
                                        <FormLabel htmlFor="notebookName" color={textColorTitle} mb={6}>
                                            Project Name
                                        </FormLabel>
                                        <Field
                                            borderRadius={3}
                                            border={'1px'}
                                            borderColor={'light.lighterGrayishBlue'}
                                            as={Input}
                                            id="createProject"
                                            name="createProject"
                                            variant="outline"
                                            validate={(value: any) => {
                                                let error;
                                                if (value.length === 0) {
                                                    error = 'create a Project is required';
                                                }

                                                return error;
                                            }}
                                        />
                                        <FormErrorMessage>{errors.createProject}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.description && touched.description}>
                                        <FormLabel htmlFor="description" color={textColorTitle} mb={6} mt={'16px'}>
                                            Description
                                        </FormLabel>
                                        <Input borderRadius={3} height={'84px'} placeholder="Some text" />
                                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                                        <Flex>
                                            <Center>
                                                <Text color={textColor} mt={'20'}>
                                                    Tags:
                                                </Text>
                                                <Center>
                                                    <Box ml={14} mt={16} bg={'default.tagBoxColor'} height={'24px'} borderRadius={3} minWidth={'auto'} width={'auto'}>
                                                        <Flex>
                                                            <Center>
                                                                <Text color={'default.userCircleHeaderFont'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                    Demo
                                                                </Text>
                                                                <Box justifyContent={'flex-end'} ml={'14px'} mr={'6px'}>
                                                                    <CloseIcon color={'default.darkGrayCreate'} />
                                                                </Box>
                                                            </Center>
                                                        </Flex>
                                                    </Box>
                                                </Center>
                                                <Text cursor={'pointer'} color={'default.shareModalButton'} mt={'20'} ml={'8px'}>
                                                    + Add Tag(s)
                                                </Text>
                                            </Center>
                                        </Flex>

                                        <Flex mb={'21px'}>
                                            <Center>
                                                <Text color={projectId} mt={'20'}>
                                                    Shared with:
                                                </Text>
                                                <Center>
                                                    <Box ml={14} mt={16} bg={'default.tagBoxColor'} height={'24px'} borderRadius={3} minWidth={'auto'} width={'auto'}>
                                                        <Flex>
                                                            <Center>
                                                                <Text color={'default.userCircleHeaderFont'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                    SB
                                                                </Text>
                                                                <Box justifyContent={'flex-end'} ml={'14px'} mr={'6px'}>
                                                                    <CloseIcon color={'default.darkGrayCreate'} />
                                                                </Box>
                                                            </Center>
                                                        </Flex>
                                                    </Box>
                                                </Center>

                                                <Text cursor={'pointer'} color={'default.shareModalButton'} mt={'20'} ml={'8px'} onClick={addShareMemberModal.onOpen}>
                                                    + Add Member(s)
                                                </Text>
                                                <Share isOpen={addShareMemberModal.isOpen} onClose={addShareMemberModal.onClose}></Share>
                                            </Center>
                                        </Flex>
                                        <Flex>
                                            <Center>
                                                <Avatar p={'5px'} borderRadius="full" boxSize="42px" name={`Shirin Bampoori`} color={'default.whiteText'} />
                                            </Center>
                                        </Flex>
                                        <Divider color={'default.dividerColor'} mt={'26px'} ml={'-24px'} width={'509px'} />

                                        <ModalFooter mb={'18px'} mt={'21px'} mr={'0px'}>
                                            <Button
                                                disabled={loading}
                                                onClick={props.onClose}
                                                colorScheme="gray"
                                                bg={'white'}
                                                color={'default.shareModalButton'}
                                                width={'80px'}
                                                border={'1px'}
                                                borderColor={'default.shareModalButton'}
                                                height={'36px'}
                                                borderRadius={4}
                                            >
                                                Cancel
                                            </Button>
                                            {loading ? (
                                                <Button
                                                    width={'80px'}
                                                    height={'36px'}
                                                    ml={'11px'}
                                                    borderRadius={4}
                                                    isLoading
                                                    disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object)}
                                                    onSubmit={props.onSubmit}
                                                    type="submit"
                                                    colorScheme="blue"
                                                >
                                                    Create
                                                </Button>
                                            ) : (
                                                <Button
                                                    width={'80px'}
                                                    height={'36px'}
                                                    ml={'11px'}
                                                    borderRadius={4}
                                                    disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object)}
                                                    onSubmit={props.onSubmit}
                                                    type="submit"
                                                    colorScheme="blue"
                                                >
                                                    Create
                                                </Button>
                                            )}
                                        </ModalFooter>
                                    </FormControl>
                                </VStack>
                            </form>
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CreateProjectModal;
