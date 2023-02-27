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
    Avatar,
    useToast
} from '@chakra-ui/react';
import { CloseIcon } from '../../assets/icons';
import { CopyIcon } from '@chakra-ui/icons';
import Share from './Share';
import { CreateProject, ProjectCreate, ProjectCreateDetail, ProjectEdit, ProjectEditDetail } from '../../models/project';
import client from '../../apollo-client';
import { createProject, editProject } from '../../query';
import { getAndUpdateAllProjectsData } from '../../zustandActions/projectActions';
const CreateProjectModal = (props: any) => {
    const textColor = useColorModeValue('dark.darkGrayCreate', 'default.whiteText');
    const textColorTitle = useColorModeValue('default.titleForShare', 'default.whiteText');
    const projectId = useColorModeValue('default.blackText', 'default.whiteText');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const addShareMemberModal = useDisclosure();
    const toast = useToast();
    const isEdit = props.isEdit.status;
    const isEditData = props.isEdit.data;
    const data = {
        id: (isEdit) ? isEditData.basic.id : "",
        name: (isEdit) ? isEditData.basic.name : "",
        description: (isEdit) ? isEditData.basic.description : "",
        tags: (isEdit) ? isEditData.basic.tags : [],
        project_variables: "none"} as CreateProject;

    return (
        <Modal closeOnOverlayClick={false} size={'lg'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />

            <ModalContent>
                <ModalHeader fontSize={16} color={projectId} mt={'13px'} ml={'20px'}>
                    {(isEdit) ? 'Edit Project': 'Create Project'}
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
                                                {(isEdit) ? data.id: 'Yet to be Assigned'}
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
                                id: data.id,
                                name: data.name,
                                description: data.description,
                                tags: data.tags,
                                project_variables: data.project_variables
                            } as CreateProject
                        }
                        validateOnBlur={true}
                        validateOnChange={true}
                        onSubmit={(values) => {
                            setLoading(true);
                            if(isEdit) {
                                client
                                    .mutate<ProjectEdit<ProjectEditDetail>>({
                                        mutation: editProject(values)
                                    })
                                    .then(() => {
                                        setLoading(false);
                                        toast({
                                            title: `Project Edited successfully`,
                                            status: 'success',
                                            isClosable: true,
                                            duration: 5000,
                                            position: 'top-right'
                                        });
                                        getAndUpdateAllProjectsData();
                                        props.onSuccess();
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
                            } else {
                                client
                                    .mutate<ProjectCreate<ProjectCreateDetail>>({
                                        mutation: createProject(values)
                                    })
                                    .then(() => {
                                        setLoading(false);
                                        toast({
                                            title: `Project has being created`,
                                            status: 'success',
                                            isClosable: true,
                                            duration: 5000,
                                            position: 'top-right'
                                        });
                                        getAndUpdateAllProjectsData();
                                        props.onSuccess();
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
                            }
                        }}
                    >
                        {({ handleSubmit, errors, touched, isValid }) => (
                            <form onSubmit={handleSubmit}>
                                <VStack align="flex-start">
                                    <FormControl isInvalid={!!errors.name && touched.name} isRequired>
                                        <FormLabel htmlFor="notebookName" color={textColorTitle} mb={6}>
                                            Project Name
                                        </FormLabel>
                                        <Field
                                            borderRadius={3}
                                            border={'1px'}
                                            borderColor={'light.lighterGrayishBlue'}
                                            as={Input}
                                            id="name"
                                            name="name"
                                            variant="outline"
                                            validate={(value: any) => {
                                                let error;
                                                if (value.length === 0) {
                                                    error = 'Project name is required';
                                                }

                                                return error;
                                            }}
                                        />
                                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.description}>
                                        <FormLabel htmlFor="description" color={textColorTitle} mb={6} mt={'16px'}>
                                            Description
                                        </FormLabel>
                                        <Field
                                            borderRadius={3}
                                            border={'1px'}
                                            borderColor={'light.lighterGrayishBlue'}
                                            as={Input}
                                            id="description"
                                            name="description"
                                            variant="outline"
                                        />
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
                                                                    <CloseIcon color={'#666C80'} />
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
                                                                    <CloseIcon color={'#666C80'} />
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
