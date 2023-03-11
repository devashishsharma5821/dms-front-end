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
    Tag,
    TagLabel,
    TagCloseButton,
    HStack,
    FormControl,
    Stack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Textarea, createStandaloneToast
} from '@chakra-ui/react';
import useAppStore from '../../../store';
import { DeleteProjectDetail, GetSingleProjectAppStoreState, ProjectDelete, ProjectEdit, ProjectEditDetail } from '../../../models/project';
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
import LeftArrow from '../../../assets/LeftArrow';
import { getToastOptions } from '../../../models/toastMessages';
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
    const tagPopOver = useDisclosure();
    const editAccessModal = useDisclosure();
    const { toast } = createStandaloneToast();
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
            setInlineDescription(SingleProjectData.basic.description === null ? '' : SingleProjectData.basic.description);
            if (AllUsersData && SingleProjectData) {
                setAccessUserList(getFormattedUserData(AllUsersData, SingleProjectData));
            }
        }
    }, [SingleProjectData, AllUsersData]);
    useEffect(() => {
        if (AllUsersData === null) {
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        } else {
            if (AllUsersData && SingleProjectData) {
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
                toast(getToastOptions(`Project is deleted successfully`, 'success'));
                getAndUpdateAllProjectsData();
                navigate('/project');
                deleteConfirmationModal.onClose();
            })
            .catch((err) => {
                toast(getToastOptions(`${err}`, 'error'));
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
                toast(getToastOptions(toastMessages.successMessage, 'success'));
                getAndUpdateAllProjectsData();
            })
            .catch((err) => {
                toast(getToastOptions(`${err}`, 'error'));
            });
    };
    const handleAddTag = () => {
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
        });
    };
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
            });
        }
    };
    const createUserAccessForCreateProjectMode = (userList: AllUsers) => {
        setAccessUserListCreateMode(userList);
    };
    return (
        <>
            {AllUsersData && SingleProjectData && (
                <Box marginLeft={'50px'}>
                    <Box fontSize={16} fontWeight={600} ml={'24'} mt={'24'} color={'default.darkGrayCreate'}>
                        <Text>Projects / My Project</Text>
                    </Box>

                    <Box ml={'24'} mt={'6px'} mb={'24'} color={'default.darkGrayCreate'}>
                        <Flex flexDir={'row'}>
                            <Button
                                mr={'8px'}
                                color={'default.accessByNumber'}
                                border={'1px'}
                                borderColor={'light.lighterGrayishBlue'}
                                bg={'white'}
                                onClick={navigateToDetails}
                                height={'30px'}
                                width={'30px'}
                                borderRadius={4}
                            >
                                {' '}
                                <LeftArrow />
                            </Button>
                            <Text fontSize={24} fontWeight={700} height={'30px'} color={accesstextColor} mr={'6px'}>
                                {' '}
                                {SingleProjectData && SingleProjectData.basic.name}
                            </Text>
                            {SingleProjectData && (
                                <>
                                    <Flex mt={'8px'}>
                                        <Box bg={'none'} color={'default.shareModalButton'} onClick={editProjectModal}>
                                            <PencilIcon color={'#666C80'} height={'20px'} Height={'20px'} />
                                        </Box>
                                        <Button
                                            width={'71px'}
                                            height={'36px'}
                                            colorScheme="gray"
                                            bg={'white'}
                                            color={'default.textButton'}
                                            border={'1px'}
                                            borderColor={'default.textButton'}
                                            borderRadius={4}
                                            fontWeight={600}
                                            ml={'30px'}
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
                                <Flex ml={'24px'} width={'482px'} maxHeight={'320px'} mr={'48px'}>
                                    <Avatar
                                        p={'5px'}
                                        borderRadius="full"
                                        boxSize="42px"
                                        name={getUserNameFromId(AllUsersData, SingleProjectData && SingleProjectData.basic.created_by)}
                                        color={'default.whiteText'}
                                        mt={'24px'}
                                    />
                                    <Center>
                                        <Box width={'450px'}>
                                            <Text ml={16} mt={'22px'} color={textColor2} fontWeight={600} lineHeight={'22px'}>
                                                Created by
                                            </Text>
                                            <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                {getUserNameFromId(AllUsersData, SingleProjectData && SingleProjectData.basic.created_by)}
                                            </Text>

                                            <Flex flexDir={'row'}>
                                                <Box>
                                                    <Text ml={16} color={textColor2} mt={'14px'} fontWeight={600} lineHeight={'22px'}>
                                                        Project ID
                                                    </Text>
                                                    <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                        {SingleProjectData && SingleProjectData.basic.id}
                                                    </Text>
                                                </Box>
                                                <Box ml={'115px'}>
                                                    <Text ml={16} color={textColor2} mt={'12px'} fontWeight={600} lineHeight={'22px'}>
                                                        Project Name
                                                    </Text>
                                                    <Text title={SingleProjectData && SingleProjectData.basic.name} ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                        {getTruncatedText(SingleProjectData && SingleProjectData.basic.name)}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Flex flexDir={'row'}>
                                                <Box>
                                                    <Text ml={16} color={textColor2} mt={'12px'} fontWeight={600} lineHeight={'22px'}>
                                                        Created On
                                                    </Text>
                                                    <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                        {SingleProjectData && SingleProjectData.basic.created_at.replace('T', ' ')}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Flex ml={'16px'} mt={'15'} maxHeight={'37px'} maxWidth={'400px'}>
                                                <Text color={textColor2} fontWeight={600} lineHeight={'22px'}>
                                                    Tag:
                                                </Text>
                                                <Center borderRadius={3}>
                                                    <>
                                                        <HStack spacing={4}>
                                                            {SingleProjectData &&
                                                                SingleProjectData.basic.tags !== null &&
                                                                SingleProjectData.basic.tags.map((tag: string) => {
                                                                    return (
                                                                        <Tag height={'24px'} variant="solid" key={tag} bg={'#F2F4F8'} color={'#1A3F59'}>
                                                                            <TagLabel>{tag}</TagLabel>
                                                                            <TagCloseButton />
                                                                        </Tag>
                                                                    );
                                                                })}
                                                        </HStack>
                                                        <HStack spacing={4} borderRadius={3} ml={8}>
                                                            {SingleProjectData && SingleProjectData.basic.tags === null && (
                                                                <Tag minHeight={'24px'} bg={'#F2F4F8'} color={'#1A3F59'}>
                                                                    <TagLabel fontSize={'14px'} fontWeight={600} lineHeight={'16px'} pl={6} pt={4} pr={6}>
                                                                        No Tags available
                                                                    </TagLabel>
                                                                </Tag>
                                                            )}
                                                        </HStack>
                                                    </>
                                                </Center>
                                                <Popover isOpen={tagPopOver.isOpen} onOpen={tagPopOver.onOpen} onClose={tagPopOver.onClose} placement="right" closeOnBlur={false}>
                                                    <PopoverTrigger>
                                                        <Text color={'default.textButton'} ml={8} fontWeight={600} minWidth={'76'}>
                                                            + Add Tag
                                                        </Text>
                                                    </PopoverTrigger>
                                                    <PopoverContent p={5}>
                                                        <Stack spacing={4}>
                                                            <FormControl>
                                                                <Input onChange={(evt: any) => setPopOverTag(evt.target.value)} value={popOverTag} placeholder="Type Here" />
                                                            </FormControl>
                                                            <ButtonGroup display="flex" justifyContent="flex-end">
                                                                <Button variant="outline" onClick={tagPopOver.onClose}>
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={handleAddTag} colorScheme="teal">
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
                                                    <Center>
                                                        <Text mt={'15px'} color={textColor2} lineHeight={'22px'} fontWeight={600}>
                                                            Description
                                                        </Text>
                                                        <EditableControls />
                                                    </Center>
                                                </Flex>
                                                <Box maxHeight={'40px'} maxWidth={'425px'}>
                                                    <EditablePreview />
                                                    <Textarea as={EditableInput} />
                                                </Box>
                                            </Editable>
                                        </Box>
                                    </Center>
                                </Flex>
                                <Flex minWidth={'312px'} maxHeight={'320px'}>
                                    <Box>
                                        <Flex>
                                            <Center flex="2" mt={'25px'}>
                                                <Text color={textColor2} fontWeight={700}>
                                                    Access by
                                                </Text>
                                                <Box ml={8} bg={'default.tagBoxColor'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                                    <Text color={'default.accessByNumber'} fontSize={'14px'} pt={4} fontWeight={600}>
                                                        10
                                                    </Text>
                                                </Box>
                                                <Center flex="2" justifyContent={'flex-end'}>
                                                    <Text onClick={editAccessModal.onOpen} cursor={'pointer'} color={'default.toolbarButton'}>
                                                        {' '}
                                                        Edit
                                                    </Text>
                                                    <Text color={'default.toolbarButton'} ml={16}>
                                                        {' '}
                                                        Copy Link
                                                    </Text>
                                                </Center>
                                            </Center>
                                        </Flex>
                                        <Box overflowY="auto" maxHeight="224px" h="100%" whiteSpace="nowrap" color="white">
                                            {accessUserList &&
                                                accessUserList.map((icons: User, iconsIndex: number) => {
                                                    return (
                                                        <div key={iconsIndex}>
                                                            <Center>
                                                                <Avatar p={'5px'} borderRadius="full" boxSize="32px" name={`${icons.firstName} ${icons.lastName}`} color={'default.whiteText'} />
                                                                <Box width={'250px'}>
                                                                    <Text ml={12} color={accesstextColor} fontWeight={600}>
                                                                        {icons?.firstName} {icons?.lastName}
                                                                    </Text>
                                                                    <Text ml={12} color={'default.veryLightGrayTextColor'} fontWeight={600}>
                                                                        {icons.email}{' '}
                                                                    </Text>
                                                                </Box>
                                                            </Center>

                                                            <Center mr={'36px'}></Center>
                                                        </div>
                                                    );
                                                })}
                                        </Box>
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
                <CreateProjectModal
                    isOpen={createProjectModal.isOpen}
                    onClose={createProjectModal.onClose}
                    onSuccess={onCreateProjectSuccess}
                    isEdit={{ status: true, data: SingleProjectData, usersData: AllUsersData }}
                />
            )}
            {editAccessModal.isOpen && (
                <Share
                    isOpen={editAccessModal.isOpen}
                    retainData={accessUserListCreateMode}
                    onClose={editAccessModal.onClose}
                    isEdit={true}
                    onCreateUserAccess={(userList: AllUsers) => createUserAccessForCreateProjectMode(userList)}
                ></Share>
            )}
        </>
    );
};

export default ProjectDetails;
