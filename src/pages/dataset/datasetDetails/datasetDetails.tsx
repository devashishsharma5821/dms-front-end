import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Center,
    Editable,
    Flex,
    Text,
    useColorModeValue,
    EditablePreview,
    Input,
    EditableInput,
    Avatar,
    Textarea,
    ButtonGroup,
    useEditableControls,
    CloseButton,
    createStandaloneToast,
    useDisclosure
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import LeftArrow from '../../../assets/LeftArrow';
import { CopyIcon, PencilIcon } from '../../../assets/icons';
import useAppStore from '../../../store';
import { GetSingleDatasetAppStoreState, DatasetEdit, DatasetEditDetail, DatasetDelete, DeleteDatasetDetail } from '../../../models/dataset';
import { getToastOptions } from '../../../models/toastMessages';
import { AllUsers, GetAllUsersDataAppStoreState, User } from '../../../models/profile';
import {
    getAndUpdateSingleDatasetData,
    updateSingleDatasetData,
    updateSingleProjectData
} from '../../../zustandActions/projectActions';
import { getTruncatedText, getFormattedUserData, copyToClipBoard, convertTime, getUserNameFromId } from '../../../utils/common.utils';
import { deleteDataset, editDataset } from '../../../query';
import client from '../../../apollo-client';
import { DeleteConfirmationModal } from '../../../component/modalSystem/deleteConfirmationModal';
import { getAndUpdateAllUsersData, updateSpinnerInfo } from '../../../zustandActions/commonActions';
import Share from '../../../component/modalSystem/Share';
import { GetSingleProjectAppStoreState } from '../../../models/project';
import { getAndUpdateSingleProjectData } from '../../../zustandActions/projectActions';
const DatasetDetails = (props: any) => {
    const textColor2 = useColorModeValue('default.titleForShare', 'default.whiteText');
    const datasetDetailTitle = useColorModeValue('default.darkGrayCreate', 'default.whiteText');
    const [DatasetDetailData] = useAppStore((state: GetSingleDatasetAppStoreState) => [state.DatasetDetailData]);
    const [AllUsersData] = useAppStore((state: GetAllUsersDataAppStoreState) => [state.AllUsersData]);
    const [accessUserList, setAccessUserList] = React.useState<any>([]);
    const accesstextColor = useColorModeValue('default.blackText', 'default.whiteText');
    const { toast } = createStandaloneToast();
    const params = useParams();
    const [deleteId, setDeleteId] = useState<string>('');
    const [inlineDatasetName, setInlineDatasetName] = useState<string>('');
    const deleteConfirmationModal = useDisclosure();
    const editAccessModal = useDisclosure();
    const navigate = useNavigate();
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    const [accessUserListCreateMode, setAccessUserListCreateMode] = React.useState<any>([]);

    const navigateToDataset = () => {
        navigate(`/dataset`);
    };
    const clipBoardSuccess = () => {
        toast(getToastOptions(`Location Copied To Clipboard`, 'success'));
    };
    const createUserAccessForCreateDatasetMode = (userList: AllUsers) => {
        setAccessUserListCreateMode(userList);
    };
    function EditableControlsName() {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

        return isEditing ? (
            <ButtonGroup ml={'20px'} justifyContent="center" mt={'45px'}>
                <Button cursor={'pointer'} variant="link" colorScheme="blue" {...getSubmitButtonProps()}>
                    Save
                </Button>
                <Button cursor={'pointer'} variant="link" colorScheme="blue" {...getCancelButtonProps()}>
                    Cancel
                </Button>
            </ButtonGroup>
        ) : (
            <Flex>
                <Button variant={'solid'} _hover={{ bg: 'none' }} {...getEditButtonProps()} bg={'textColor'} top={'28px'} width={'48px'} height={'48px'}>
                    <PencilIcon color={'#666C80'} width={'40px'} height={'40px'} />
                </Button>
            </Flex>
        );
    }

    useEffect(() => {
        updateSpinnerInfo(true);
            getAndUpdateSingleDatasetData(params.datasetId as string);
            getAndUpdateSingleProjectData(params.projectId as string);
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        return () => {
            updateSpinnerInfo(false);
            updateSingleProjectData(null);
            updateSingleDatasetData(null);
        };
    }, []);

    useEffect(() => {
        if (DatasetDetailData !== null && SingleProjectData !== null && AllUsersData !== null) {
            console.log('Shirin here is the dataset details data', DatasetDetailData);
            setInlineDatasetName(DatasetDetailData.name);
            updateSpinnerInfo(false);
            setAccessUserList(getFormattedUserData(AllUsersData, SingleProjectData));
        }
    }, [DatasetDetailData, SingleProjectData, AllUsersData]);

    const handleEditDataset = (variables: any, toastMessages: any) => {
        updateSpinnerInfo(true);
        // TODO Backend needs to supply edit dataset api.
        // client
        //     .mutate<DatasetEdit<DatasetEditDetail>>({
        //         mutation: editDataset(variables)
        //     })
        //     .then(() => {
        //         toast(getToastOptions(toastMessages.successMessage, 'success'));
        //         updateSpinnerInfo(false);
        //     })
        //     .catch((err) => {
        //         updateSpinnerInfo(false);
        //         toast(getToastOptions(`${err}`, 'error'));
        //     });
    };

    const handleEditName = () => {
        if (inlineDatasetName !== DatasetDetailData.name) {
            const variables = {
                id: DatasetDetailData.id,
                name: inlineDatasetName
                // dataset_variables: DatasetDetailData.name
            };
            handleEditDataset(variables, {
                successMessage: 'Dataset Name Edited Successfully',
                errorMessage: 'Dataset Name Failed To edit'
            });
        }
    };
    const handleEditNameChange = (editChangeValue: string) => {
        setInlineDatasetName(editChangeValue);
    };
    const handleEditNameChangeCancel = () => {
        setInlineDatasetName(DatasetDetailData.name);
    };
    const onDeleteHandler = (id: string) => {
        deleteConfirmationModal.onOpen();
        setDeleteId(id);
    };
    const submitDeleteHandler = () => {
        updateSpinnerInfo(true);
        client
            .mutate<DatasetDelete<DeleteDatasetDetail>>({
                mutation: deleteDataset(deleteId)
            })
            .then(() => {
                toast(getToastOptions(`Dataset is deleted successfully`, 'success'));

                navigate('/dataset');
                deleteConfirmationModal.onClose();
                updateSpinnerInfo(false);
            })
            .catch((err) => {
                updateSpinnerInfo(false);
                toast(getToastOptions(`${err}`, 'error'));
            });
    };
    return (
        <>
            {AllUsersData && DatasetDetailData && SingleProjectData && (
                <Box marginLeft={'50px'}>
                    <Box fontSize={16} fontWeight={600} ml={'24'} mt={'24'} color={datasetDetailTitle}>
                        <Text>Dataset / My Dataset</Text>
                    </Box>
                    <Box ml={'24'} mt={'16px'} mb={'24'} color={'default.darkGrayCreate'}>
                        <Flex flexDir={'row'} cursor={'pointer'}>
                            <Button
                                cursor={'pointer'}
                                mr={'8px'}
                                color={'default.accessByNumber'}
                                border={'1px'}
                                borderColor={'light.lighterGrayishBlue'}
                                bg={'white'}
                                onClick={navigateToDataset}
                                height={'30px'}
                                width={'30px'}
                                borderRadius={4}
                            >
                                {' '}
                                <LeftArrow />
                            </Button>
                            <>
                                {' '}
                                <Flex>
                                    <Editable
                                        maxWidth={'800px'}
                                        textAlign="left"
                                        fontWeight={400}
                                        onSubmit={handleEditName}
                                        onChange={handleEditNameChange}
                                        onCancel={handleEditNameChangeCancel}
                                        value={inlineDatasetName}
                                    >
                                        <Flex>
                                            <Center mt={'-10'}>
                                                <Box maxWidth={'425px'} height={'28px'} fontSize={24} fontWeight={700} color={accesstextColor}>
                                                    <EditablePreview />
                                                    <Input as={EditableInput} height={'30px'} mt={'-10px'} />
                                                </Box>
                                            </Center>
                                            <Box mt={'-40px'}>
                                                {' '}
                                                <EditableControlsName />
                                            </Box>
                                        </Flex>
                                    </Editable>
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
                                        onClick={() => onDeleteHandler(DatasetDetailData.id)}
                                    >
                                        Delete
                                    </Button>
                                </Flex>
                            </>
                        </Flex>
                        <Box width={'60vw'} height={'350px'} borderRadius={8} border={'1px'} borderColor={'light.lighterGrayishBlue'} mt={'32px'} pb={'24px'}>
                            <Flex>
                                <Flex width={'50%'} ml={'22px'} maxHeight={'320px'} mr={'48px'}>
                                    <Avatar p={'5px'} borderRadius="full" boxSize="42px" color={'default.whiteText'} mt={'24px'} name={getUserNameFromId(AllUsersData, DatasetDetailData.created_by)} />
                                    <Center>
                                        <Box width={'450px'}>
                                            <Text ml={16} mt={'22px'} color={textColor2} fontWeight={600} lineHeight={'22px'}>
                                                Created by
                                            </Text>
                                            <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                {getUserNameFromId(AllUsersData, DatasetDetailData.created_by)}
                                            </Text>

                                            <Flex flexDir={'row'}>
                                                <Box>
                                                    <Text ml={16} color={textColor2} mt={'14px'} fontWeight={600} lineHeight={'22px'}>
                                                        Dataset ID
                                                    </Text>
                                                    <Center justifyContent={'flex-start'}>
                                                        <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                            {DatasetDetailData.id}
                                                        </Text>
                                                        <Text ml={8} onClick={() => copyToClipBoard(window.location.href, clipBoardSuccess)} cursor={'pointer'}>
                                                            <CopyIcon />
                                                        </Text>
                                                    </Center>
                                                </Box>
                                                <Box ml={'145px'}>
                                                    <Text color={textColor2} mt={'14px'} fontWeight={600} lineHeight={'22px'}>
                                                        Dataset Name
                                                    </Text>
                                                    <Text title={DatasetDetailData.name} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                        {getTruncatedText(DatasetDetailData.name, 50)}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Flex flexDir={'row'}>
                                                <Box>
                                                    <Text ml={16} color={textColor2} mt={'12px'} fontWeight={600} lineHeight={'22px'}>
                                                        Created On
                                                    </Text>
                                                    <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                        {convertTime(DatasetDetailData.created_at, false)}
                                                    </Text>
                                                </Box>
                                                <Box ml={'51px'}>
                                                    <Text ml={16} color={textColor2} mt={'12px'} fontWeight={600} lineHeight={'22px'}>
                                                        Last Modified
                                                    </Text>
                                                    <Text ml={16} color={accesstextColor} fontWeight={700} lineHeight={'20px'}>
                                                        {convertTime(DatasetDetailData.updated_at, true)}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Flex ml={'16px'} mt={'15'} maxHeight={'37px'} maxWidth={'400px'}>
                                                <Text color={textColor2} fontWeight={600} lineHeight={'22px'}>
                                                    Tag:
                                                </Text>

                                                <Text color={'default.textButton'} ml={8} fontWeight={600} minWidth={'76'} cursor={'pointer'}>
                                                    + Add Tag
                                                </Text>
                                            </Flex>
                                            <Center ml={'16px'} mt={'5px'} width={'70px'} height={'24px'} bg={'#F2F4F8'} borderRadius={3} pl={'6px'} color={'#1A3F59'}>
                                                <Text> Demo</Text>
                                                <CloseButton size={'sm'} color={'#666C80'} />
                                            </Center>

                                            <Editable height={'80px'} maxWidth={'400px'} textAlign="left" fontWeight={400} ml={16}>
                                                <Flex>
                                                    <Center>
                                                        <Text mt={'14px'} color={textColor2} lineHeight={'22px'} fontWeight={600}>
                                                            Description
                                                        </Text>
                                                        <Text mt={'15px'} ml={10} color={'default.toolbarButton'} fontWeight={600}>
                                                            Edit
                                                        </Text>
                                                    </Center>
                                                </Flex>
                                                <Text fontWeight={400} color={accesstextColor}>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore...
                                                </Text>
                                                <Box maxWidth={'425px'} maxHeight={'80px'} overflowY={'auto'} color={accesstextColor}>
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
                                            <Center mt={'10px'}>
                                                <Text color={textColor2} fontWeight={700}>
                                                    Access by
                                                </Text>
                                                <Box ml={8} bg={'default.tagBoxColor'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                                    <Text color={'default.accessByNumber'} fontSize={'14px'} pt={2} fontWeight={600} cursor={'pointer'}>
                                                        {accessUserList.length}
                                                    </Text>
                                                </Box>
                                            </Center>
                                            <Center ml={'57px'} mt={'10px'}>
                                                <Text fontWeight={600} cursor={'pointer'} color={'default.textButton'} onClick={editAccessModal.onOpen}>
                                                    {' '}
                                                    Edit
                                                </Text>
                                                <Text
                                                    color={'default.textButton'}
                                                    fontWeight={600}
                                                    ml={16}
                                                    cursor={'pointer'}
                                                    onClick={() => copyToClipBoard(window.location.href, clipBoardSuccess)}
                                                    width={'80px'}
                                                    mr={'12px'}
                                                >
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
                                                                <Avatar p={'5px'} borderRadius="full" boxSize="32px" color={'default.whiteText'} name={`${icons.firstName} ${icons.lastName}`} />
                                                                <Box width={'250px'}>
                                                                    <Text ml={12} color={accesstextColor} fontWeight={600}>
                                                                        {icons?.firstName} {icons?.lastName}
                                                                    </Text>
                                                                    <Text ml={12} color={'default.veryLightGrayTextColor'} fontWeight={600}>
                                                                        {icons.email}
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
                        <Box mt={'22px'} width={'442px'} height={'298px'} border={'1px'} borderColor={'#D8DCDE'} borderRadius={8} p={10}>
                            Grid 1 place here
                        </Box>
                        <Box mt={'22px'} width={'1130px'} height={'298px'} border={'1px'} borderColor={'#D8DCDE'} borderRadius={8} p={10}>
                            Grid 2 place here
                        </Box>
                    </Box>
                </Box>
            )}
            {deleteConfirmationModal.isOpen && (
                <DeleteConfirmationModal
                    isOpen={deleteConfirmationModal.isOpen}
                    onClose={deleteConfirmationModal.onClose}
                    submitDeleteHandler={submitDeleteHandler}
                    options={{ name: DatasetDetailData.name, label: 'Dataset', placeholder: 'My Dataset 00' }}
                />
            )}
            {editAccessModal.isOpen && (
                <Share
                    isOpen={editAccessModal.isOpen}
                    retainData={accessUserListCreateMode}
                    onClose={editAccessModal.onClose}
                    isEdit={true}
                    onCreateUserAccess={(userList: AllUsers) => createUserAccessForCreateDatasetMode(userList)}
                ></Share>
            )}
        </>
    );
};

export default DatasetDetails;
