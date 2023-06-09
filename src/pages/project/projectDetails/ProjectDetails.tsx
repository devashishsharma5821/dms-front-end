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
    Popover,
    PopoverTrigger,
    PopoverBody,
    PopoverCloseButton,
    PopoverArrow,
    PopoverContent,
    Textarea,
    createStandaloneToast
} from '@chakra-ui/react';
import useAppStore from '../../../store';
import { DeleteProjectDetail, GetSingleProjectAppStoreState, GetSingleProjectDetail, ProjectDelete, ProjectEdit, ProjectEditDetail } from '../../../models/project';
import { getAndUpdateAllProjectsData, getAndUpdateSingleProjectData, updateSingleProjectData } from '../../../zustandActions/projectActions';
import { useNavigate, useParams } from 'react-router-dom';
import CreateProjectModal from '../../../component/modalSystem/CreateProjectModal';
import { CopyIcon, PencilIcon } from '../../../assets/icons';
import { getUserNameFromId, getTruncatedText, getFormattedUserData, copyToClipBoard, convertTime } from '../../../utils/common.utils';
import { getAndUpdateAllUsersData, updateSpinnerInfo } from '../../../zustandActions/commonActions';
import { AllUsers, GetAllUsersDataAppStoreState, User } from '../../../models/profile';
import { DeleteConfirmationModal } from '../../../component/modalSystem/deleteConfirmationModal';
import client from '../../../apollo-client';
import { deleteProject, editProject } from '../../../query';
import Share from '../../../component/modalSystem/Share';
import LeftArrow from '../../../assets/LeftArrow';
import { getToastOptions } from '../../../models/toastMessages';
import ProjectDetailsGrid from './detailsGridComponent';
import moment from 'moment';
const ProjectDetails = (props: any) => {
    const textColor2 = useColorModeValue('default.titleForShare', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.blackText', 'default.whiteText');
    const projectDetailTitle = useColorModeValue('default.darkGrayCreate', 'default.whiteText');
    const themeBg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    const [AllUsersData] = useAppStore((state: GetAllUsersDataAppStoreState) => [state.AllUsersData]);
    const [deleteId, setDeleteId] = useState<string>('');
    const [inlineDescription, setInlineDescription] = useState<string>('');
    const [inlineProjectName, setInlineProjectName] = useState<string>('');
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
    const [showEditValuePreview, setShowEditValuePreview] = useState(true);
    const [windowSize, setWindowSize] = React.useState([window.innerWidth, window.innerHeight]);
    function EditableControls() {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

        return isEditing ? (
            <ButtonGroup ml={'20px'} mt={'15px'} justifyContent="center">
                <Button cursor={'pointer'} variant="link" colorScheme="blue" {...getSubmitButtonProps()}>
                    Save
                </Button>
                <Button cursor={'pointer'} variant="link" colorScheme="blue" {...getCancelButtonProps()}>
                    Cancel
                </Button>
            </ButtonGroup>
        ) : (
            <Flex justifyContent="center">
                <Button {...getEditButtonProps()} bg={'textColor'} mt={'10px'} ml={'12px'} width={'33px'} height={'33px'}>
                    <Text color={'default.toolbarButton'}>Edit</Text>
                </Button>
            </Flex>
        );
    }
    function EditableControlsName() {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

        return isEditing ? (
            <ButtonGroup ml={'20px'} justifyContent="center" mt={'50px'}>
                <Button cursor={'pointer'} variant="link" colorScheme="blue" {...getSubmitButtonProps()}>
                    Save
                </Button>
                <Button cursor={'pointer'} variant="link" colorScheme="blue" {...getCancelButtonProps()}>
                    Cancel
                </Button>
            </ButtonGroup>
        ) : (
            <Flex>
                <Button variant={'non'} _hover={{ bg: 'none' }} {...getEditButtonProps()} bg={'textColor'} top={'25px'} width={'48px'} height={'48px'}>
                    <PencilIcon color={'#666C80'} width={'40px'} height={'40px'} />
                </Button>
            </Flex>
        );
    }
    useEffect(() => {
        if (SingleProjectData === null) {
            getAndUpdateSingleProjectData(params.projectId as string);
        } else {
            updateSpinnerInfo(false);
            setInlineDescription(SingleProjectData.basic.description === null ? '' : SingleProjectData.basic.description);
            setInlineProjectName(SingleProjectData.basic.name);
            if (AllUsersData && SingleProjectData) {
                setAccessUserList(getFormattedUserData(AllUsersData, SingleProjectData));
            }
        }
    }, [SingleProjectData]);

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

    useEffect(() => {
        updateSpinnerInfo(true);
        return () => {
            updateSpinnerInfo(false);
            updateSingleProjectData(null);
        };
    }, []);

    const onCreateProjectSuccess = () => {
        getAndUpdateSingleProjectData(SingleProjectData.basic.id);
        createProjectModal.onClose();
    };
    const navigateToProjects = () => {
        navigate(`/projects`);
    };
    const onDeleteHandler = (id: string) => {
        deleteConfirmationModal.onOpen();
        setDeleteId(id);
    };
    const submitDeleteHandler = () => {
        updateSpinnerInfo(true);
        client
            .mutate<ProjectDelete<DeleteProjectDetail>>({
                mutation: deleteProject(deleteId)
            })
            .then(() => {
                toast(getToastOptions(`Project is deleted successfully`, 'success'));
                getAndUpdateAllProjectsData();
                navigate('/projects');
                deleteConfirmationModal.onClose();
                updateSpinnerInfo(false);
            })
            .catch((err) => {
                updateSpinnerInfo(false);
                toast(getToastOptions(`${err}`, 'error'));
                updateSpinnerInfo(false);
            });
    };
    const handleEditDescriptionChange = (editChangeValue: string) => {
        setInlineDescription(editChangeValue);
    };
    const handleEditDescriptionChangeCancel = () => {
        setInlineDescription(SingleProjectData.basic.description);
    };
    const handleEditNameChange = (editChangeValue: string) => {
        setShowEditValuePreview(false);
        setInlineProjectName(editChangeValue);
    };
    const handleEditNameChangeCancel = () => {
        setInlineProjectName(SingleProjectData.basic.name);
        setShowEditValuePreview(true);
    };
    const handleEditProject = (variables: any, toastMessages: any) => {
        updateSpinnerInfo(true);
        client
            .mutate<ProjectEdit<ProjectEditDetail>>({
                mutation: editProject(variables)
            })
            .then(() => {
                toast(getToastOptions(toastMessages.successMessage, 'success'));
                updateSpinnerInfo(false);
            })
            .catch((err) => {
                updateSpinnerInfo(false);
                toast(getToastOptions(`${err}`, 'error'));
            });
    };

    const handleAddTag = () => {
        tagPopOver.onClose();
        if (popOverTag !== '') {
            SingleProjectData.basic.tags.push(popOverTag);
            const variables = {
                id: SingleProjectData.basic.id,
                name: SingleProjectData.basic.name,
                project_variables: SingleProjectData.basic.project_variables,
                description: SingleProjectData.basic.description,
                tags: [...SingleProjectData.basic.tags]
            };
            handleEditProject(variables, {
                successMessage: 'Project Tags Added Successfully',
                errorMessage: 'Project Tags Failed To Add'
            });
            setPopOverTag('');
            SingleProjectData.basic.tags = [...SingleProjectData.basic.tags];
            SingleProjectData.basic.updated_at = moment.utc().format();
            updateSingleProjectData(SingleProjectData);
        }
    };
    const handleRemoveTag = (tag: string) => {
        SingleProjectData.basic.tags = SingleProjectData.basic.tags.filter((tagToKeep) => {
            return tagToKeep !== tag;
        });
        const variables = {
            id: SingleProjectData.basic.id,
            name: SingleProjectData.basic.name,
            project_variables: SingleProjectData.basic.project_variables,
            description: SingleProjectData.basic.description,
            tags: [...SingleProjectData.basic.tags]
        };
        handleEditProject(variables, {
            successMessage: 'Project Tags Deleted Successfully',
            errorMessage: 'Project Tags Failed To Delete'
        });
        SingleProjectData.basic.tags = [...SingleProjectData.basic.tags];
        SingleProjectData.basic.updated_at = moment.utc().format();
        updateSingleProjectData(SingleProjectData);
    };
    const handleEditName = () => {
        if (inlineProjectName !== SingleProjectData.basic.name) {
            const variables = {
                id: SingleProjectData.basic.id,
                name: inlineProjectName,
                project_variables: SingleProjectData.basic.project_variables,
                description: SingleProjectData.basic.description,
                tags: SingleProjectData.basic.tags === null ? [] : SingleProjectData.basic.tags
            };
            handleEditProject(variables, {
                successMessage: 'Project Name Edited Successfully',
                errorMessage: 'Project Name Failed To edit'
            });
        }
        SingleProjectData.basic.name = inlineProjectName;
        SingleProjectData.basic.updated_at = moment.utc().format();
        updateSingleProjectData(SingleProjectData);
        setShowEditValuePreview(true);
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
            SingleProjectData.basic.description = nextDescription;
            SingleProjectData.basic.updated_at = moment.utc().format();
            updateSingleProjectData(SingleProjectData);
        }
    };
    const createUserAccessForCreateProjectMode = (userList: AllUsers) => {
        setAccessUserListCreateMode(userList);
    };

    const clipBoardSuccess = () => {
        toast(getToastOptions(`Location Copied To Clipboard`, 'success'));
    };
    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    });
    return (
        <>
            {AllUsersData && SingleProjectData && (
                <Box marginLeft={'50px'}>
                    <Box fontSize={16} fontWeight={600} ml={'24'} mt={'24'} color={projectDetailTitle}>
                        <Text>Projects / My Project</Text>
                    </Box>

                    <Box marginLeft={'24px'} mt={'16px'} mb={'24px'} color={'default.darkGrayCreate'} width="60vw">
                        <Flex flexDir={'row'} cursor={'pointer'} justifyContent={'space-between'} alignItems={'center'}>
                            <Flex alignItems="center">
                                <Button
                                    cursor={'pointer'}
                                    mr={'8px'}
                                    color={'default.accessByNumber'}
                                    border={'1px'}
                                    borderColor={'light.lighterGrayishBlue'}
                                    bg={'white'}
                                    onClick={navigateToProjects}
                                    height={'30px'}
                                    width={'30px'}
                                    borderRadius={4}
                                >
                                    {' '}
                                    <LeftArrow />
                                </Button>
                                <Editable
                                    maxWidth={'40vw'}
                                    width={'40vw'}
                                    textAlign="left"
                                    fontWeight={400}
                                    onSubmit={handleEditName}
                                    onChange={handleEditNameChange}
                                    onCancel={handleEditNameChangeCancel}
                                    onEdit={() => setShowEditValuePreview(false)}
                                    value={inlineProjectName}
                                >
                                    <Flex>
                                        <Center mt={'-10'}>
                                            <Box height={'28px'} fontSize={24} fontWeight={700} color={accesstextColor}>
                                                {showEditValuePreview && (
                                                    <Text title={inlineProjectName} fontSize={'24px'} fontWeight={700}>
                                                        {getTruncatedText(inlineProjectName, 60)}
                                                    </Text>
                                                )}
                                                <Input as={EditableInput} height={'30px'} mt={'-10px'} width={'40vw'} />
                                            </Box>
                                        </Center>
                                        <Box mt={'-40px'}>
                                            <EditableControlsName />
                                        </Box>
                                    </Flex>
                                </Editable>
                            </Flex>
                            <Button
                                cursor={'pointer'}
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
                    </Box>
                    <Box height={windowSize[1] - 200} overflowX={'hidden'} overflowY={'scroll'} marginLeft={'24px'}>
                        <Box width={'60vw'} height={'350px'} borderRadius={8} border={'1px'} borderColor={'light.lighterGrayishBlue'} mt={'32px'} pb={'24px'}>
                            <Flex>
                                <Flex width={'50%'} ml={'22px'} maxHeight={'320px'} mr={'48px'}>
                                    <Avatar
                                        p={'5px'}
                                        borderRadius="full"
                                        boxSize="42px"
                                        name={getUserNameFromId(AllUsersData, SingleProjectData.basic.created_by)}
                                        color={'default.whiteText'}
                                        mt={'24px'}
                                    />
                                    <Center>
                                        <Box width={'450px'}>
                                            <Text ml={16} mt={'22px'} color={textColor2} fontWeight={600} lineHeight={'22px'}>
                                                Created by
                                            </Text>
                                            <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                {getUserNameFromId(AllUsersData, SingleProjectData.basic.created_by)}
                                            </Text>
                                            <Flex flexDir={'row'}>
                                                <Box>
                                                    <Text ml={16} color={textColor2} mt={'14px'} fontWeight={600} lineHeight={'22px'}>
                                                        Project ID
                                                    </Text>

                                                    <Center justifyContent={'flex-start'}>
                                                        <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                            {SingleProjectData.basic.id}
                                                        </Text>
                                                        <Text ml={8} onClick={() => copyToClipBoard(window.location.href, clipBoardSuccess)} cursor={'pointer'}>
                                                            <CopyIcon />
                                                        </Text>
                                                    </Center>
                                                </Box>
                                                <Box ml={'168px'}>
                                                    <Text color={textColor2} mt={'14px'} fontWeight={600} lineHeight={'22px'}>
                                                        Project Name
                                                    </Text>
                                                    <Text title={SingleProjectData.basic.name} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                        {getTruncatedText(SingleProjectData.basic.name, 20)}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Flex flexDir={'row'}>
                                                <Box>
                                                    <Text ml={16} color={textColor2} mt={'12px'} fontWeight={600} lineHeight={'22px'}>
                                                        Created On
                                                    </Text>
                                                    <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                        {convertTime(SingleProjectData.basic.created_at, false)}
                                                    </Text>
                                                </Box>
                                                <Box ml={'51px'}>
                                                    <Text ml={16} color={textColor2} mt={'12px'} fontWeight={600} lineHeight={'22px'}>
                                                        Last Modified
                                                    </Text>
                                                    <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                        {convertTime(SingleProjectData.basic.updated_at, true)}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Flex ml={'16px'} mt={'15'} maxHeight={'37px'} maxWidth={'400px'}>
                                                <Text color={textColor2} fontWeight={600} lineHeight={'22px'}>
                                                    Tag:
                                                </Text>
                                                <Popover isOpen={tagPopOver.isOpen} onOpen={tagPopOver.onOpen} onClose={tagPopOver.onClose} placement="right" closeOnBlur={true}>
                                                    <PopoverTrigger>
                                                        <Text color={'default.textButton'} ml={8} fontWeight={600} minWidth={'76'} cursor={'pointer'}>
                                                            + Add Tag
                                                        </Text>
                                                    </PopoverTrigger>
                                                    <PopoverContent p={5}>
                                                        <HStack spacing={4}>
                                                            <FormControl>
                                                                <Input onChange={(evt: any) => setPopOverTag(evt.target.value)} value={popOverTag} placeholder="Type Here" />
                                                            </FormControl>
                                                            <ButtonGroup display="flex" mt={'20px'} ml={'10px'} justifyContent="flex-end">
                                                                <Button onClick={handleAddTag} bg={'default.textButton'} cursor={'pointer'}>
                                                                    Add Tag
                                                                </Button>
                                                            </ButtonGroup>
                                                        </HStack>
                                                    </PopoverContent>
                                                </Popover>
                                            </Flex>{' '}
                                            <Flex ml={'10px'} mt={'8px'} minHeight={'24px'}>
                                                <Center borderRadius={3}>
                                                    <>
                                                        <HStack spacing={4}>
                                                            {SingleProjectData.basic.tags !== null &&
                                                                SingleProjectData.basic.tags.map((tag: string, tagIndex: number) => {
                                                                    if (tagIndex === 2) {
                                                                        return (
                                                                            <Tag
                                                                                borderRadius={3}
                                                                                maxWidth={'125px'}
                                                                                height={'24px'}
                                                                                variant="solid"
                                                                                key={tag}
                                                                                bg={'#F2F4F8'}
                                                                                color={'#1A3F59'}
                                                                                ml={8}
                                                                                pr={'5px'}
                                                                            >
                                                                                <Popover placement="right" closeOnBlur={false}>
                                                                                    <PopoverTrigger>
                                                                                        <TagLabel fontSize={'14px'} fontWeight={600} pl={6} pr={6} maxWidth={'125px'}>
                                                                                            + {SingleProjectData.basic.tags.length - 2} more
                                                                                        </TagLabel>
                                                                                    </PopoverTrigger>
                                                                                    <PopoverContent color={textColor2} bg={themeBg} borderColor={themeBg}>
                                                                                        <PopoverArrow />
                                                                                        <PopoverCloseButton />
                                                                                        <PopoverBody>
                                                                                            {SingleProjectData.basic.tags.map((tagPop: any) => {
                                                                                                return (
                                                                                                    <Text fontSize={'14px'} fontWeight={600} pl={6} pr={6} key={tagPop}>
                                                                                                        {tagPop}
                                                                                                    </Text>
                                                                                                );
                                                                                            })}
                                                                                        </PopoverBody>
                                                                                    </PopoverContent>
                                                                                </Popover>
                                                                            </Tag>
                                                                        );
                                                                    } else if (tagIndex < 2) {
                                                                        return (
                                                                            <Tag
                                                                                borderRadius={3}
                                                                                maxWidth={'125px'}
                                                                                height={'24px'}
                                                                                variant="solid"
                                                                                key={tag}
                                                                                bg={'#F2F4F8'}
                                                                                color={'#1A3F59'}
                                                                                ml={8}
                                                                                pr={'5px'}
                                                                            >
                                                                                <TagLabel title={tag} fontSize={'14px'} fontWeight={600} pl={6} pr={6} maxWidth={'125px'}>
                                                                                    {getTruncatedText(tag, 9)}
                                                                                </TagLabel>
                                                                                <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                                                                            </Tag>
                                                                        );
                                                                    }
                                                                })}
                                                        </HStack>
                                                    </>
                                                </Center>
                                            </Flex>
                                            <Editable
                                                height={'80px'}
                                                maxWidth={'400px'}
                                                textAlign="left"
                                                fontWeight={400}
                                                ml={16}
                                                onSubmit={handleEditDescription}
                                                onChange={handleEditDescriptionChange}
                                                onCancel={handleEditDescriptionChangeCancel}
                                                value={inlineDescription}
                                            >
                                                <Flex>
                                                    <Center>
                                                        <Text mt={'14px'} color={textColor2} fontWeight={600}>
                                                            Description
                                                        </Text>
                                                        <EditableControls />
                                                    </Center>
                                                </Flex>
                                                <Box maxWidth={'425px'} maxHeight={'48px'} overflowY={'auto'} color={accesstextColor}>
                                                    <EditablePreview />
                                                    <Textarea as={EditableInput} />
                                                </Box>
                                            </Editable>
                                        </Box>
                                    </Center>
                                </Flex>
                                <Flex width={'50%'} maxHeight={'267px'} mt={'10px'}>
                                    <Box width={'100%'}>
                                        <Flex justifyContent={'start'}>
                                            <Center>
                                                <Text color={textColor2} fontWeight={700}>
                                                    Access by
                                                </Text>
                                                <Box ml={8} bg={'default.tagBoxColor'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                                    <Text color={'default.accessByNumber'} fontSize={'14px'} pt={2} fontWeight={600} cursor={'pointer'}>
                                                        {accessUserList.length}
                                                    </Text>
                                                </Box>
                                            </Center>
                                            <Center ml={'84px'}>
                                                <Text onClick={editAccessModal.onOpen} fontWeight={600} cursor={'pointer'} color={'default.textButton'}>
                                                    {' '}
                                                    Edit
                                                </Text>
                                                <Text onClick={() => copyToClipBoard(window.location.href, clipBoardSuccess)} color={'default.textButton'} fontWeight={600} ml={16} cursor={'pointer'}>
                                                    {' '}
                                                    Copy Link
                                                </Text>
                                            </Center>
                                        </Flex>
                                        <Box overflowY="auto" overflowX="hidden" maxHeight="245px" minHeight="222px" h="100%" whiteSpace="nowrap" color="white" width={'100%'} mt={'20px'}>
                                            {accessUserList &&
                                                accessUserList.map((icons: User, iconsIndex: number) => {
                                                    return (
                                                        <div key={iconsIndex} style={{ marginBottom: '16px' }}>
                                                            <Flex justifyContent={'start'}>
                                                                <Avatar p={'5px'} borderRadius="full" boxSize="32px" name={`${icons.firstName} ${icons.lastName}`} color={'default.whiteText'} />
                                                                <Box width={'250px'}>
                                                                    <Text ml={12} color={accesstextColor} fontWeight={600}>
                                                                        {icons?.firstName} {icons?.lastName}
                                                                    </Text>
                                                                    <Text ml={12} color={'default.veryLightGrayTextColor'} fontWeight={600}>
                                                                        {icons.email}{' '}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>
                                                        </div>
                                                    );
                                                })}
                                        </Box>
                                    </Box>
                                </Flex>
                            </Flex>
                        </Box>

                        <Box mt={'20px'}>
                            <ProjectDetailsGrid gridData={SingleProjectData} projectId={SingleProjectData.basic.id}></ProjectDetailsGrid>
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
