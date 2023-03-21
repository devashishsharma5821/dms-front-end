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
    Textarea,
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
    Tag,
    TagLabel,
    TagCloseButton,
    HStack, PopoverContent, Stack, ButtonGroup, Popover, createStandaloneToast
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import Share from './Share';
import { CreateProject, ProjectCreate, ProjectCreateDetail, ProjectEdit, ProjectEditDetail } from '../../models/project';
import client from '../../apollo-client';
import { createAccess, createProject, editProject } from '../../query';
import { getAndUpdateAllProjectsData, getAndUpdateSingleProjectData } from '../../zustandActions/projectActions';
import { AllUsers, DMSAccessLevel } from '../../models/profile';
import { ShareCreate, ShareCreateDetail } from '../../models/share';
import { updateSpinnerInfo } from '../../zustandActions/commonActions';
import { getToastOptions } from '../../models/toastMessages';
const CreateProjectModal = (props: any) => {
    const textColor = useColorModeValue('dark.darkGrayCreate', 'default.whiteText');
    const textColorTitle = useColorModeValue('default.titleForShare', 'default.whiteText');
    const projectId = useColorModeValue('default.blackText', 'default.whiteText');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const [addTagClicked, setAddTagClicked] = useState(false);
    const addShareMemberModal = useDisclosure();
    const tagPopOver = useDisclosure()
    const [accessUserListCreateMode, setAccessUserListCreateMode] = React.useState<any>([]);
    const { toast } = createStandaloneToast();
    const isEdit = props.isEdit.status;
    const isEditData = props.isEdit.data;
    const isAllUsersData = props.isEdit.usersData;
    const [data, setData] = useState({
        id: (isEdit) ? isEditData.basic.id : "",
        name: (isEdit) ? isEditData.basic.name : "",
        description: (isEdit) ? isEditData.basic.description : "",
        tags: (isEdit) ? (isEditData.basic.tags !== null && isEditData.basic.tags.length > 0) ? isEditData.basic.tags.join(','): "" : "",
        project_variables: "none",
        project_access: (isEdit) ? isEditData.basic.project_access : ""
    } as CreateProject);
    const addTagHandler = (type: string, formikValues: any) => {
        if(type === 'trigger') {
            setAddTagClicked(!addTagClicked);
            tagPopOver.onOpen();
        } else {
            setAddTagClicked(false);
        }
    };
    const removeTag = (tag: string, tagIndex: number, formikValues: any) => {
        const formicValuesTags = formikValues.tags.split(',');
        const newFormikValuesTags = formicValuesTags.filter((newTag: string) => {return newTag !== tag})
        formikValues.tags = newFormikValuesTags.join(',');
        editProjectQuery(formikValues);
    };
    const editProjectQuery = (formikValues: any) => {
        updateSpinnerInfo(true);
        client
            .mutate<ProjectEdit<ProjectEditDetail>>({
                mutation: editProject(formikValues)
            })
            .then(() => {
                setLoading(false);
                toast(getToastOptions(`Project Edited successfully`, 'success'));
                getAndUpdateAllProjectsData();
                getAndUpdateSingleProjectData(data.id);
                updateSpinnerInfo(false);
            })
            .catch((err: any) => {
                updateSpinnerInfo(false);
                setLoading(false);
                toast(getToastOptions(`${err}`, 'error'));
            });
    }
    const createUserAccessForCreateProjectMode = (userList:AllUsers) => {
        setAccessUserListCreateMode(userList);
    }
    const setCreateProjectSuccess = (projectName: any, projectId: any) => {
        getAndUpdateAllProjectsData();
        toast(getToastOptions(`Project has being created`, 'success'));
        setLoading(false);
        props.onSuccess(projectName, projectId);
    };
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
                    {
                        isEdit &&
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
                    }

                    <Formik
                        initialValues={
                            {
                                validateOnMount: true,
                                id: data.id,
                                name: data.name,
                                description: data.description,
                                tags: data.tags,
                                project_variables: data.project_variables,
                                project_access: data.project_access
                            } as CreateProject
                        }
                        validateOnBlur={true}
                        validateOnChange={true}
                        onSubmit={(values) => {
                            setLoading(true);
                            updateSpinnerInfo(true);
                            if(isEdit) {
                                client
                                    .mutate<ProjectEdit<ProjectEditDetail>>({
                                        mutation: editProject(values)
                                    })
                                    .then(() => {
                                        setLoading(false);
                                        toast(getToastOptions(`Project Edited successfully`, 'success'));
                                        getAndUpdateAllProjectsData();
                                        props.onSuccess();
                                        updateSpinnerInfo(false);
                                    })
                                    .catch((err: any) => {
                                        setLoading(false);
                                        toast(getToastOptions(`${err}`, 'error'));
                                    });
                            } else {
                                client
                                    .mutate<ProjectCreate<ProjectCreateDetail>>({
                                        mutation: createProject(values)
                                    })
                                    .then((response) => {
                                        // Here we are checking if any of the users have given access if they have, execute apis to give user access to that project.
                                        if(accessUserListCreateMode.length > 0) {
                                            let mutationVariables = {};
                                                mutationVariables = {
                                                    access: accessUserListCreateMode.map((user: any, userIndex: any) => {
                                                        return {
                                                            user_id: user.userId,
                                                            access_level: DMSAccessLevel[0]
                                                        }
                                                    }),
                                                    project_id: response?.data?.dmsCreateProject
                                                };
                                                client
                                                    .mutate<ShareCreate<ShareCreateDetail>>({
                                                        mutation: createAccess(),
                                                        variables: {input: mutationVariables}
                                                    })
                                                    .then(() => {
                                                        toast(getToastOptions('Project Was created Successfully', 'success'));
                                                            setCreateProjectSuccess(values['name'], response?.data?.dmsCreateProject);
                                                            setAccessUserListCreateMode([]);
                                                            updateSpinnerInfo(false);
                                                    })
                                                    .catch((err) => {
                                                        toast(getToastOptions(`${err}`, 'error'));
                                                    });
                                        } else {
                                            updateSpinnerInfo(false);
                                            setCreateProjectSuccess(values['name'], response?.data?.dmsCreateProject);
                                        }
                                    })
                                    .catch((err: any) => {
                                        setLoading(false);
                                        toast(getToastOptions(`${err}`, 'error'));
                                    });
                            }
                        }}
                    >
                        {({ handleSubmit, errors, touched, isValid, values }) => (
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
                                            as={Textarea}
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
                                                    {
                                                        addTagClicked &&
                                                        <Box ml={14} mt={16} minWidth={'auto'} width={'auto'}>
                                                            <Popover
                                                                isOpen={tagPopOver.isOpen}
                                                                onOpen={tagPopOver.onOpen}
                                                                onClose={tagPopOver.onClose}
                                                                placement='right'
                                                                closeOnBlur={false}
                                                            >
                                                                <PopoverContent p={5}>
                                                                    <Stack spacing={4}>
                                                                        <FormControl>
                                                                            <Field
                                                                                borderRadius={3}
                                                                                border={'1px'}
                                                                                borderColor={'light.lighterGrayishBlue'}
                                                                                as={Input}
                                                                                id="tags"
                                                                                name="tags"
                                                                                variant="outline"
                                                                                placeholder="Type here"
                                                                            />
                                                                            <FormErrorMessage>{errors.description}</FormErrorMessage>
                                                                        </FormControl>
                                                                        <ButtonGroup display='flex' justifyContent='flex-end'>
                                                                            <Button variant='outline' onClick={tagPopOver.onClose}>
                                                                                Cancel
                                                                            </Button>
                                                                            <Button onClick={() => addTagHandler('add', values)} colorScheme='teal'>
                                                                                Add Tag
                                                                            </Button>
                                                                        </ButtonGroup>
                                                                    </Stack>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </Box>

                                                    }
                                                    {
                                                        !addTagClicked &&
                                                        <Box ml={14} mt={16} minWidth={'auto'} width={'auto'}>
                                                            <HStack spacing={4}>
                                                                {
                                                                    values && values.tags && values.tags.split(',').length > 0 &&
                                                                    values.tags.split(',').map((tag, tagIndex) => {
                                                                        return (
                                                                            <Tag
                                                                                size={'sm'}
                                                                                key={tag}
                                                                                borderRadius='none'
                                                                                variant='solid'
                                                                            >
                                                                                <TagLabel>{tag}</TagLabel>
                                                                                <TagCloseButton onClick={() => removeTag(tag, tagIndex, values)} />
                                                                            </Tag>
                                                                        )
                                                                    })
                                                                }
                                                            </HStack>
                                                        </Box>
                                                    }
                                                </Center>
                                                {
                                                    !addTagClicked &&
                                                    <Text onClick={() => addTagHandler('trigger', values)} cursor={'pointer'} color={'default.shareModalButton'} mt={'20'} ml={'8px'}>
                                                        + Add Tag(s)
                                                    </Text>
                                                }
                                                {  addTagClicked &&
                                                <Text onClick={() => addTagHandler('add', values)} cursor={'pointer'} color={'default.shareModalButton'} mt={'20'} ml={'8px'}>
                                                    Add Tag
                                                </Text>
                                                }

                                            </Center>
                                        </Flex>

                                        <Flex mb={'21px'}>
                                            <Center>
                                                <Text color={projectId} mt={'20'}>
                                                    Shared with:
                                                </Text>
                                                <Text cursor={'pointer'} color={'default.shareModalButton'} mt={'20'} ml={'8px'} onClick={addShareMemberModal.onOpen}>
                                                    + Add Member(s)
                                                </Text>
                                                {addShareMemberModal.isOpen &&
                                                <Share isOpen={addShareMemberModal.isOpen} retainData={accessUserListCreateMode} onClose={addShareMemberModal.onClose} isEdit={isEdit} onCreateUserAccess={(userList: AllUsers) => createUserAccessForCreateProjectMode(userList)}></Share>
                                                }

                                            </Center>
                                        </Flex>
                                        {
                                            isEdit &&
                                            <Flex>
                                                <Center>
                                                    {
                                                        isEditData && isEditData.project_access &&
                                                        isEditData.project_access.map((userAccess: any, userAccessIndex: any) => {
                                                            const sharedUser = isAllUsersData?.filter((singleUser: any) => {
                                                                return singleUser.userId === userAccess.user_id;
                                                            });
                                                            const avatarName = (sharedUser.length > 0) ? `${sharedUser[0].firstName} ${sharedUser[0].lastName}` : '';
                                                          return(
                                                              <Avatar key={userAccessIndex} mr={'5px'} p={'5px'} borderRadius="full" boxSize="42px" name={avatarName} color={'default.whiteText'} />
                                                          )
                                                        })
                                                    }
                                                </Center>
                                            </Flex>
                                        }
                                        {
                                            !isEdit &&
                                            <Flex>
                                                <Center>
                                                    {
                                                        accessUserListCreateMode && accessUserListCreateMode.map((user: any, userIndex: any) => {
                                                            return (
                                                                <Avatar mr={'5px'} key={userIndex} p={'5px'} borderRadius="full" boxSize="42px" name={`${user.firstName} ${user.lastName}`} color={'default.whiteText'} />
                                                            )
                                                        })
                                                    }
                                                </Center>
                                            </Flex>
                                        }
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
                                                    {(!isEdit) ? 'Create' : 'Edit'}
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
                                                    {(!isEdit) ? 'Create' : 'Edit'}
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
