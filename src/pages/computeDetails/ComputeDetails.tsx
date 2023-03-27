import { useState, useContext, useEffect } from 'react';
import { Box, Button, useColorModeValue, Text, Avatar, Link, ButtonGroup, useDisclosure, Editable, Flex, Center, EditablePreview, Input, EditableInput, useEditableControls } from '@chakra-ui/react';
import { EditIcon, PencilIcon } from '../../assets/icons';
import ComputeJsonModal from '../../component/modalSystem/ComputeJsonModal';
import './computedetails.scss';
import { DeleteConfirmationModal } from '../../component/modalSystem/deleteConfirmationModal';
import { ComputeContext } from '../../context/computeContext';
import { useParams } from 'react-router-dom';
import useAppStore from '../../store';
import { useNavigate } from 'react-router-dom';
import { getAndUpdateDbSettingsData, getAndUpdateDmsComputeData } from '../../zustandActions/computeActions';
import client from '../../apollo-client';
import { ComputeDelete, createCompute, DeleteComputeDetail } from '../../models/computeDetails';
import { dmsDeleteCompute, dmsEditComputeOffEnableAutoscaling, dmsEditComputeOnEnableAutoscaling } from '../../query';
import { getAndUpdateAllUsersData, updateSpinnerInfo } from '../../zustandActions/commonActions';
import { GetAllUsersDataAppStoreState } from '../../models/profile';
import { convertTime, getUserNameFromId } from '../../utils/common.utils';
import { createStandaloneToast } from '@chakra-ui/react';
import { getToastOptions } from '../../models/toastMessages';
import { String } from 'lodash';
import { ProjectEdit, ProjectEditDetail } from '../../models/project';
import { DocumentNode } from 'graphql';
import { dmsCreateComputeResponse } from '../../models/dmsCreateComputeResponse';
const { toast } = createStandaloneToast();

const ComputeDetails = () => {
    const [DmsComputeData, AllUsersData, dbSettingsData] = useAppStore((state: any) => [state.DmsComputeData, state.AllUsersData, state.dbSettingsData]);
    const textColor = useColorModeValue('light.header', 'dark.white');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const deleteComputeModal = useDisclosure();
    const editComputeModal = useDisclosure();
    const [deleteId, setDeleteId] = useState<string>('');
    const context = useContext(ComputeContext);
    const navigate = useNavigate();
    const { computeId } = useParams();
    const accesstextColor = useColorModeValue('default.blackText', 'default.whiteText');
    const [editValue, setEditValue] = useState<string>('');

    useEffect(() => {
        if (AllUsersData === null) {
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        }
    }, [AllUsersData]);

    useEffect(() => {
        getAndUpdateDmsComputeData();
    }, []);

    const onBackClickHandler = () => {
        navigate('/compute');
    };

    const onDeleteHandler = (id: string) => {
        setDeleteId(id);
        deleteComputeModal.onOpen();
    };

    const submitDeleteHandler = () => {
        client
            .mutate<ComputeDelete<DeleteComputeDetail>>({
                mutation: dmsDeleteCompute(deleteId)
            })
            .then(() => {
                toast(getToastOptions(`Compute is deleted successfully`, 'success'));
                const newData = DmsComputeData.filter((computeData: any) => computeData.id !== deleteId);
                useAppStore.setState(() => ({ DmsComputeData: newData }));
                navigate('/compute');
            })
            .catch((err: any) => {
                toast(getToastOptions(`${err.message}`, 'error'));
                deleteComputeModal.onClose();
            });
    };

    const onEditClickHandler = async (data: any) => {
        await getAndUpdateDbSettingsData();
        context.updateFormData({
            id: data.id,
            computeId: data.id,
            max_inactivity_min: data?.max_inactivity_min,
            compute_name: data.name,
            autoscale: data.resources.autoscale,
            workers: parseInt(data.resources.num_workers) || 0,
            spot_instances: data.resources.spot_instances,
            worker_type_id: data.resources.node_type.worker_type_id,
            driver_type_id: data.resources.node_type.driver_type_id,
            min_workers: data.resources?.autoscale?.min_workers,
            max_workers: data.resources?.autoscale?.max_workers,
            enable_autoscaling: data.resources.autoscale ? true : false,
            terminate_after: data?.max_inactivity_min ? true : false
        });

        setIsEdit(true);
        if (dbSettingsData.length === 0) {
            updateSpinnerInfo(true);
            const check = getAndUpdateDbSettingsData();
            check.then((res: any) => {
                res ? editComputeModal.onOpen() : toast(getToastOptions('Unable to open edit modal', 'error'));
            });
        } else {
            editComputeModal.onOpen();
        }
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

    const handleEditNameChange = (editVal: any) => {
        setEditValue(editVal);
    };

    let computeData = DmsComputeData && DmsComputeData.find((computeData: any) => computeData.id === computeId);

    useEffect(() => {
        if (computeData?.name) {
            setEditValue(computeData.name);
        }
    }, [computeData]);

    if (!computeData) {
        return <div>loading</div>;
    }

    const handleEditProject = (variables: any, toastMessages: any) => {
        let mutation: DocumentNode | null = null;
        updateSpinnerInfo(true);

        if (!variables.enable_autoscaling) {
            mutation = dmsEditComputeOffEnableAutoscaling(variables);
        } else {
            mutation = dmsEditComputeOnEnableAutoscaling(variables);
        }

        client
            .mutate<dmsCreateComputeResponse<createCompute>>({
                mutation: mutation
            })
            .then(async (response) => {
                getAndUpdateDmsComputeData();
                toast(getToastOptions(toastMessages.successMessage, 'success'));
                updateSpinnerInfo(false);
            })
            .catch((err) => {
                toast(getToastOptions(err, 'error'));
            });
    };

    const handleEditName = () => {
        if (editValue !== computeData?.name) {
            const variables = {
                id: computeData.id,
                compute_name: editValue,
                worker_type_id: computeData.resources.node_type.worker_type_id,
                driver_type_id: computeData.resources.node_type.driver_type_id,
                spot_instances: computeData.resources.spot_instances,
                workers: computeData.resources.num_workers,
                terminate_after: computeData.max_inactivity_min ? true : false,
                max_inactivity_min: computeData.max_inactivity_min && computeData.max_inactivity_min
            };
            handleEditProject(variables, {
                successMessage: 'Compute Name Edited Successfully',
                errorMessage: 'Croject Name Failed To edit'
            });
        }
    };

    return (
        <Box ml={71} mt={21}>
            <Text color={textColor} className="main-heading">
                Compute /
            </Text>
            <Box className="computeDetailsMainContainer">
                <Box color={textColor} className="computedetailsContainer-1">
                    <Button onClick={onBackClickHandler} className="back-button">
                        &lt;
                    </Button>

                    <Editable maxWidth={'800px'} textAlign="left" fontWeight={400} value={editValue} onChange={handleEditNameChange} onSubmit={handleEditName}>
                        <Flex>
                            <Center mt={'-10'}>
                                <Box maxWidth={'425px'} height={'28px'} fontSize={24} fontWeight={700} color={accesstextColor}>
                                    <EditablePreview />
                                    <Input as={EditableInput} height={'30px'} mt={'-10px'} />
                                </Box>
                            </Center>
                            <Box mt={'-40px'}>
                                <EditableControlsName />
                            </Box>
                        </Flex>
                    </Editable>
                    <Button variant="outline" className="delete-button" fontWeight={100} onClick={() => onDeleteHandler(computeData.id)}>
                        Delete
                    </Button>
                </Box>
                <Box className="computedetailsContainer-2">
                    <Box className="computedetailsContainer-2sub-1">
                        <Box className="computedetailsContainer-2subsub-1">
                            <Avatar
                                borderRadius="full"
                                boxSize="40px"
                                name={AllUsersData && computeData && getUserNameFromId(AllUsersData, computeData.created_by)}
                                bg="rgb(160,186,194)"
                                fontSize="14px"
                                mt={10}
                            />
                        </Box>
                        <Box className="computedetailsContainer-2subsub-2">
                            <Box ml={15}>
                                <Text fontSize={14}>Created by</Text>
                                <Text fontSize={14} fontWeight={600}>
                                    {AllUsersData && computeData && getUserNameFromId(AllUsersData, computeData.created_by)}
                                </Text>
                            </Box>
                            <Box width={'360px'} ml={15} className="computedetailsContainer-2subsub-2sub-2">
                                <Box width={'150px'}>
                                    <Text fontSize={14}>Compute ID</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData.id}
                                    </Text>
                                </Box>
                                <Box width={'120px'} left={'20'}>
                                    <Text fontSize={14}>Compute Name</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData.name}
                                    </Text>
                                </Box>
                            </Box>
                            <Box width={'360px'} ml={15} className="computedetailsContainer-2subsub-2sub-3">
                                <Box width={'150px'}>
                                    <Text fontSize={14}>Created On</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {convertTime(computeData.created_at, false)}
                                    </Text>
                                </Box>
                                <Box width={'120px'}>
                                    <Text fontSize={14}>Last Modified</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {convertTime(computeData.updated_at, true)}
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box className="computedetailsContainer-2sub-2">
                        <Box className="computedetailsContainer-2sub-2sub-1">
                            <ButtonGroup ml={8} onClick={() => onEditClickHandler(computeData)}>
                                <Link color="rgb(33,128,194)" fontWeight={100} href="#">
                                    Edit Compute
                                </Link>
                            </ButtonGroup>
                        </Box>
                        <Box className="computedetailsContainer-2sub-2sub-2" ml={10}>
                            <Box className="computedetailsContainer-2sub-2sub-2sub-1">
                                <Box>
                                    <Text fontSize={14}>Worker Type</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData.resources.node_type.worker_type_id}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={14}>Driver Type</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData.resources.node_type.driver_type_id}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={14}>Workers</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData.resources.num_workers}
                                    </Text>
                                </Box>
                            </Box>
                            <Box className="computedetailsContainer-2sub-2sub-2sub-2">
                                <Box>
                                    <Text fontSize={14}>Total Cores</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData.resources.node_type.total_num_cores}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={14}>Total Memory</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {Math.round(computeData.resources.node_type.total_memory_mb / 1024)} GB
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={14}>Total Runtime</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        N/A
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {deleteComputeModal.isOpen && (
                    <DeleteConfirmationModal
                        isOpen={deleteComputeModal.isOpen}
                        onClose={deleteComputeModal.onClose}
                        submitDeleteHandler={submitDeleteHandler}
                        options={{ name: computeData.name, label: 'compute', placeholder: 'My Compute 00' }}
                    />
                )}
                {editComputeModal.isOpen && <ComputeJsonModal isOpen={editComputeModal.isOpen} isEdit={isEdit} onClose={editComputeModal.onClose} />}
            </Box>
        </Box>
    );
};

export default ComputeDetails;
