import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    Button,
    useDisclosure,
    Flex,
    Center,
    Input,
    Editable,
    Avatar,
    useColorModeValue,
    useEditableControls,
    ButtonGroup,
    EditablePreview,
    EditableInput,
    Toast,
    Tag,
    TagLabel,
    TagCloseButton,
    HStack,
    FormControl,
    Stack,
    Popover,
    PopoverTrigger,
    PopoverBody,
    PopoverContent
} from '@chakra-ui/react';
import useAppStore from '../../../store';
import {
    DeleteProjectDetail,
    GetSingleProjectAppStoreState,
    ProjectDelete,
    ProjectEdit, ProjectEditDetail
} from '../../../models/project';
import { getAndUpdateAllProjectsData, getAndUpdateSingleProjectData, updateSingleProjectData } from '../../../zustandActions/projectActions';
import { useNavigate, useParams } from 'react-router-dom';
import CreateProjectModal from '../../../component/modalSystem/CreateProjectModal';
import { CloseIcon, PencilIcon } from '../../../assets/icons';
import { getUserNameFromId, getTruncatedText, getFormattedUserData } from '../../../utils/common.utils';
import { getAndUpdateAllUsersData } from '../../../zustandActions/commonActions';
import { AllUsers, GetAllUsersDataAppStoreState, User } from '../../../models/profile';
import { DeleteConfirmationModal } from '../../../component/modalSystem/deleteConfirmationModal';
import client from '../../../apollo-client';
import { deleteProject, editProject } from '../../../query';
import Share from '../../../component/modalSystem/Share';
const ProjectDetails = (props: any) => {
    const textColor2 = useColorModeValue('default.titleForShare', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.blackText', 'default.whiteText');
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    const [AllUsersData] = useAppStore((state: GetAllUsersDataAppStoreState) => [state.AllUsersData]);
    const [deleteId, setDeleteId] = useState<string>('');
    const [inlineDescription, setInlineDescription] = useState<string>('');
    const [accessUserList, setAccessUserList] = React.useState<any>([]);
    const [popOverTag, setPopOverTag] = React.useState('');
    const deleteConfirmationModal = useDisclosure();
    const [accessUserListCreateMode, setAccessUserListCreateMode] = React.useState<any>([]);
    const navigate = useNavigate();
    const params = useParams();
    const createProjectModal = useDisclosure();
    const tagPopOver = useDisclosure()
    const editAccessModal = useDisclosure();
    function EditableControls() {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

        return isEditing ? (
            <ButtonGroup justifyContent="center">
                <PencilIcon {...getSubmitButtonProps()} />
                <PencilIcon {...getCancelButtonProps()} />
            </ButtonGroup>
        ) : (
            <Flex justifyContent="center">
                <Button {...getEditButtonProps()} bg={'textColor'} mt={'10px'} ml={'12px'} width={'33px'} height={'33px'}>
                    <Text color={'default.toolbarButton'}>Edit</Text>
                </Button>
            </Flex>
        );
    }
    useEffect(() => {
        if (SingleProjectData === null || params.projectId !== SingleProjectData.basic.id) {
            getAndUpdateSingleProjectData(params.projectId as string);
        } else {

            setInlineDescription((SingleProjectData.basic.description === null) ? "" : SingleProjectData.basic.description);
                if(AllUsersData && SingleProjectData) {
                    setAccessUserList(getFormattedUserData(AllUsersData, SingleProjectData));
                }

        }
    }, [SingleProjectData]);
    useEffect(() => {
        if (AllUsersData === null) {
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        } else {
            if(AllUsersData && SingleProjectData) {
                setAccessUserList(getFormattedUserData(AllUsersData, SingleProjectData));
            }
        }
    }, [AllUsersData]);
    const editProjectModal = () => {
        createProjectModal.onOpen();
    };
    const onCreateProjectSuccess = () => {
        getAndUpdateSingleProjectData(SingleProjectData.basic.id);
        createProjectModal.onClose();
    };
    const navigateToDetails = () => {
        navigate(`/project`);
    };
    const onDeleteHandler = (id: string) => {
        deleteConfirmationModal.onOpen();
        setDeleteId(id);
    };
    const submitDeleteHandler = () => {
        client
            .mutate<ProjectDelete<DeleteProjectDetail>>({
                mutation: deleteProject(deleteId)
            })
            .then(() => {
                Toast({
                    title: `Project is deleted successfully`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                getAndUpdateAllProjectsData();
                navigate('/project');
                deleteConfirmationModal.onClose();
            })
            .catch(() => {
                Toast({
                    title: `ProjectCannot be Deleted`,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    };
    const handleEditDescriptionChange = (editChangeValue: string) => {
        setInlineDescription(editChangeValue);
    };
    const handleEditProject = (variables: any, toastMessages: any) => {
        client
            .mutate<ProjectEdit<ProjectEditDetail>>({
                mutation: editProject(variables)
            })
            .then(() => {
                Toast({
                    title: toastMessages.successMessage,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-left'
                });
                getAndUpdateAllProjectsData();
            })
            .catch(() => {
                Toast({
                    title: toastMessages.errorMessage,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-left'
                });
            });
    }
    const handleAddTag = () => {
        console.log('PopTag', popOverTag);
        tagPopOver.onClose();
        setPopOverTag('');
        SingleProjectData.basic.tags.push(popOverTag);
        const variables = {
            id: SingleProjectData.basic.id,
            name: SingleProjectData.basic.name,
            project_variables: SingleProjectData.basic.project_variables,
            description: SingleProjectData.basic.description,
            tags: [...SingleProjectData.basic.tags]
        };
        handleEditProject(variables, {
            successMessage: 'Project Tags Edited Successfully',
            errorMessage: 'Project Tags Failed To edit'
        })
    }
    const handleEditDescription = (nextDescription: string) => {
        if (nextDescription !== SingleProjectData.basic.description) {
            const variables = {
                id: SingleProjectData.basic.id,
                name: SingleProjectData.basic.name,
                project_variables: SingleProjectData.basic.project_variables,
                description: nextDescription,
                tags: SingleProjectData.basic.tags === null ? [] : SingleProjectData.basic.tags
            };
            handleEditProject(variables, {
                successMessage: 'Project Description Edited Successfully',
                errorMessage: 'Project Description Failed To edit'
            })
        }
    };
    const createUserAccessForCreateProjectMode = (userList:AllUsers) => {
        setAccessUserListCreateMode(userList);
    }
    return (
        <>
            {AllUsersData && SingleProjectData && (
                <Box marginLeft={36}>
                    <Box fontSize={16} fontWeight={700} ml={'44'} mt={'35'} color={'default.darkGrayCreate'}>
                        <Text>Projects / My Project</Text>
                    </Box>

                    <Box fontSize={16} fontWeight={700} ml={'44'} mt={'6px'} mb={'24'} color={'default.darkGrayCreate'}>
                        <Flex flexDir={'row'}>
                            <Button mr={'8px'} color={'default.accessByNumber'} border={'1px'} borderColor={'light.lighterGrayishBlue'} bg={'white'} onClick={navigateToDetails}>
                                {' '}
                                <> {'<'} </>
                            </Button>
                            <Text fontSize={24} color={accesstextColor}>
                                {' '}
                                {SingleProjectData && SingleProjectData.basic.name}
                            </Text>
                            {SingleProjectData && (
                                <>
                                    <Flex mt={'8px'} ml={'2px'}>
                                        <Box bg={'none'} color={'default.shareModalButton'} width={'80px'} height={'36px'} onClick={editProjectModal}>
                                            <PencilIcon color={'#666C80'} height={'20px'} Height={'20px'} />
                                        </Box>
                                        <Button
                                            colorScheme="gray"
                                            bg={'white'}
                                            color={'default.hoverSideBarMenu'}
                                            border={'1px'}
                                            borderColor={'default.shareModalButton'}
                                            borderRadius={4}
                                            ml={'-38px'}
                                            mt={'-10px'}
                                            onClick={() => onDeleteHandler(SingleProjectData.basic.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Flex>
                                </>
                            )}
                        </Flex>
                        <Box width={'883px'} height={'320px'} borderRadius={8} border={'1px'} borderColor={'light.lighterGrayishBlue'} mt={'32px'}>
                            <Center>
                                <Flex ml={'24px'} width={'500px'} maxHeight={'320px'}>
                                    <Avatar
                                        p={'5px'}
                                        borderRadius="full"
                                        boxSize="42px"
                                        name={getUserNameFromId(AllUsersData, SingleProjectData && SingleProjectData.basic.created_by)}
                                        color={'default.whiteText'}
                                        mt={'21px'}
                                    />
                                    <Center>
                                        <Box width={'450px'}>
                                            <Text ml={12} mt={'21px'} color={textColor2} fontWeight={400}>
                                                Created by
                                            </Text>
                                            <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                {getUserNameFromId(AllUsersData, SingleProjectData && SingleProjectData.basic.created_by)}
                                            </Text>

                                            <Flex flexDir={'row'}>
                                                <Box>
                                                    <Text ml={12} color={textColor2} mt={'12px'} fontWeight={400}>
                                                        Project ID
                                                    </Text>
                                                    <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                        {SingleProjectData && SingleProjectData.basic.id}
                                                    </Text>
                                                </Box>
                                                <Box ml={'115px'}>
                                                    <Text ml={12} color={textColor2} mt={'12px'} fontWeight={400}>
                                                        Project Name
                                                    </Text>
                                                    <Text title={SingleProjectData && SingleProjectData.basic.name} ml={12} color={accesstextColor} fontWeight={700}>
                                                        {getTruncatedText(SingleProjectData && SingleProjectData.basic.name)}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Flex flexDir={'row'}>
                                                <Box>
                                                    <Text ml={12} color={textColor2} mt={'12px'} fontWeight={400}>
                                                        Created On
                                                    </Text>
                                                    <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                        {SingleProjectData && SingleProjectData.basic.created_at.replace('T', ' ')}
                                                    </Text>
                                                </Box>
                                                <Box ml={'40px'}>
                                                    <Text ml={12} color={textColor2} mt={'12px'} fontWeight={400}>
                                                        Last Modified
                                                    </Text>
                                                    <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                        10 Mins ago
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Flex ml={'12px'} mt={'-6px'}>
                                                <Text color={textColor2} mt={'15'} fontWeight={400}>
                                                    Tag:
                                                </Text>
                                                <Center>
                                                    <>
                                                        <HStack spacing={4}>
                                                            {SingleProjectData &&
                                                                SingleProjectData.basic.tags !== null &&
                                                                SingleProjectData.basic.tags.map((tag: string) => {
                                                                    return (
                                                                        <Tag size={'sm'} key={tag} borderRadius="none" variant="solid">
                                                                            <TagLabel>{tag}</TagLabel>
                                                                            <TagCloseButton />
                                                                        </Tag>
                                                                    );
                                                                })}
                                                        </HStack>
                                                        <HStack spacing={4}>
                                                            {SingleProjectData && SingleProjectData.basic.tags === null && (
                                                                <Tag size={'sm'} borderRadius="none" variant="solid">
                                                                    <TagLabel>No Tags available</TagLabel>
                                                                </Tag>
                                                            )}
                                                        </HStack>
                                                    </>
                                                </Center>
                                                <Popover
                                                    isOpen={tagPopOver.isOpen}
                                                    onOpen={tagPopOver.onOpen}
                                                    onClose={tagPopOver.onClose}
                                                    placement='right'
                                                    closeOnBlur={false}
                                                >
                                                    <PopoverTrigger>
                                                        <Text color={'default.toolbarButton'} mt={'12'} ml={20}>
                                                            + Add Tag
                                                        </Text>
                                                    </PopoverTrigger>
                                                    <PopoverContent p={5}>
                                                        <Stack spacing={4}>
                                                            <FormControl>
                                                                <Input onChange={(evt: any) => setPopOverTag(evt.target.value)} value={popOverTag} placeholder="Type Here" />
                                                            </FormControl>
                                                            <ButtonGroup display='flex' justifyContent='flex-end'>
                                                                <Button variant='outline' onClick={tagPopOver.onClose}>
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={handleAddTag} colorScheme='teal'>
                                                                    Add Tag
                                                                </Button>
                                                            </ButtonGroup>
                                                        </Stack>
                                                    </PopoverContent>
                                                </Popover>
                                            </Flex>

                                            <Editable
                                                maxWidth={'400px'}
                                                textAlign="left"
                                                fontWeight={400}
                                                ml={16}
                                                onSubmit={handleEditDescription}
                                                onChange={handleEditDescriptionChange}
                                                value={inlineDescription}
                                            >
                                                <Flex>
                                                    <Center mt={'-12px'}>
                                                        <Text mt={'10px'} color={textColor2}>
                                                            Description
                                                        </Text>
                                                        <EditableControls />
                                                    </Center>
                                                </Flex>
                                                <EditablePreview />
                                                <Input as={EditableInput} height={'40px'} />
                                            </Editable>
                                        </Box>
                                    </Center>
                                </Flex>
                                <Flex as="nav" align="center" justify="space-between" mt={'-14px'} wrap="wrap" width={'400px'} maxHeight={'320px'}>
                                    <Box>
                                        <Flex>
                                            <Center flex="2">
                                                <Text mt={'24px'} ml={12} color={accesstextColor}>
                                                    Access by
                                                </Text>
                                                <Box ml={14} mt={16} bg={'default.tagBoxColor'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                                    <Text color={'default.accessByNumber'} fontSize={'14px'} mt={4}>
                                                        10
                                                    </Text>
                                                </Box>
                                                <Center flex="2" justifyContent={'flex-end'} mr={46}>
                                                    <Text onClick={editAccessModal.onOpen} cursor={'pointer'} color={'default.toolbarButton'} mt={'21px'}>
                                                        {' '}
                                                        Edit
                                                    </Text>
                                                    <Text color={'default.toolbarButton'} mt={'21px'} ml={16}>
                                                        {' '}
                                                        Copy Link
                                                    </Text>
                                                </Center>
                                            </Center>
                                        </Flex>

                                        {accessUserList &&
                                        accessUserList.map((icons: User, iconsIndex: number) => {
                                            return (
                                                <div key={iconsIndex}>
                                                    <Center>
                                                        <Avatar ml={16} p={'5px'} borderRadius="full" boxSize="32px" name={`${icons.firstName} ${icons.lastName}`} color={'default.whiteText'} />
                                                        <Box mt={'17px'} width={'300px'}>
                                                            <Text ml={12} color={accesstextColor}>
                                                                {icons?.firstName} {icons?.lastName}
                                                            </Text>
                                                            <Text ml={12} color={'default.veryLightGrayTextColor'}>
                                                                {icons.email}{' '}
                                                            </Text>
                                                        </Box>
                                                    </Center>
                                                    <Center mr={'36px'}></Center>
                                                </div>
                                            );
                                        })}

                                    </Box>
                                </Flex>
                            </Center>
                        </Box>
                    </Box>
                </Box>
            )}
            {deleteConfirmationModal.isOpen && (
                <DeleteConfirmationModal
                    isOpen={deleteConfirmationModal.isOpen}
                    onClose={deleteConfirmationModal.onClose}
                    submitDeleteHandler={submitDeleteHandler}
                    options={{ name: SingleProjectData.basic.name, label: 'project', placeholder: 'My Project 00' }}
                />
            )}
            {createProjectModal.isOpen && (
                <CreateProjectModal isOpen={createProjectModal.isOpen} onClose={createProjectModal.onClose} onSuccess={onCreateProjectSuccess} isEdit={{ status: true, data: SingleProjectData, usersData: AllUsersData }} />
            )}
            {
                editAccessModal.isOpen && (
                    <Share isOpen={editAccessModal.isOpen} retainData={accessUserListCreateMode} onClose={editAccessModal.onClose} isEdit={true} onCreateUserAccess={(userList: AllUsers) => createUserAccessForCreateProjectMode(userList)}></Share>
                )
            }
        </>
    );
};

export default ProjectDetails;
