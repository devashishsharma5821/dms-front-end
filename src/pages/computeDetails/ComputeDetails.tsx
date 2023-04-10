import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { Box, Button, useColorModeValue, Text, Avatar, Link, ButtonGroup, useDisclosure, Editable, Flex, Center, EditablePreview, Input, EditableInput, useEditableControls } from '@chakra-ui/react';
import { EditIcon, PencilIcon } from '../../assets/icons';
import ComputeJsonModal from '../../component/modalSystem/ComputeJsonModal';
import './computedetails.scss';
import { DeleteConfirmationModal } from '../../component/modalSystem/deleteConfirmationModal';
import { ComputeContext } from '../../context/computeContext';
import { useParams } from 'react-router-dom';
import useAppStore from '../../store';
import { useNavigate } from 'react-router-dom';
import {
    getAndUpdateDbSettingsData,
    getAndUpdateDmsSingleComputeData,
    updateDmsSingleComputeData
} from '../../zustandActions/computeActions';
import client from '../../apollo-client';
import { ComputeDelete, createCompute, DeleteComputeDetail } from '../../models/computeDetails';
import { dmsDeleteCompute, dmsEditComputeOffEnableAutoscaling, dmsEditComputeOnEnableAutoscaling } from '../../query';
import { getAndUpdateAllUsersData, updateSpinnerInfo } from '../../zustandActions/commonActions';
import { convertTime, getTruncatedText, getUserNameFromId } from '../../utils/common.utils';
import { createStandaloneToast } from '@chakra-ui/react';
import { getToastOptions } from '../../models/toastMessages';
import { DocumentNode } from 'graphql';
import { dmsCreateComputeResponse } from '../../models/dmsCreateComputeResponse';
import { updateSingleProjectData } from '../../zustandActions/projectActions';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
const { toast } = createStandaloneToast();

const ComputeDetails = () => {
    const [DmsSingleComputeData, AllUsersData, dbSettingsData] = useAppStore((state: any) => [state.DmsSingleComputeData, state.AllUsersData, state.dbSettingsData]);
    const textColor = useColorModeValue('light.header', 'dark.white');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const deleteComputeModal = useDisclosure();
    const editComputeModal = useDisclosure();
    const [deleteId, setDeleteId] = useState<string>('');
    const context = useContext(ComputeContext);
    const navigate = useNavigate();
    const accesstextColor = useColorModeValue('default.blackText', 'default.whiteText');
    const [editValue, setEditValue] = useState<string>('');
    const textColorPage = useColorModeValue('default.blackText', 'dark.white');
    const gridRef = useRef<AgGridReact<any>>(null);
    const gridStyle = useMemo(() => ({ height: '300px', width: '98%' }), []);
    const [rowData, setRowData] = useState<any[]>([]);
    const params = useParams();
    const [showEditValuePreview, setShowEditValuePreview] = useState(true);
    const [columnDefs] = useState<ColDef[]>([
        {
            field: 'start_time',
            headerName: 'Start On',
            valueFormatter: (params: any) => {
                return convertTime(params.data.start_time, false);
            }
        },
        {
            field: 'end_time',
            headerName: 'End On',
            valueFormatter: (params: any) => {
                return convertTime(params.data.end_time, false);
            }
        },
        {
            field: 'execution_duration',
            headerName: 'Duration',
            valueFormatter: (params: any) => {
                if(params.data.execution_duration === 0) {
                    return '0';
                } else {
                    const executionInMin = Math.round(params.data.execution_duration / 60000);
                    return `${executionInMin} min`
                }
            }
        }
    ]);
    const onFirstDataRendered = () => {
        gridRef?.current!?.api?.sizeColumnsToFit();
    };
    window.addEventListener('resize', () => {
        if (gridRef?.current) {
            gridRef?.current!?.api?.sizeColumnsToFit();
        }
    });
    useEffect(() => {
        if (AllUsersData === null) {
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        }
    }, [AllUsersData]);

    useEffect(() => {
        updateSpinnerInfo(true);
        return ()=>{updateDmsSingleComputeData(null)}
    }, []);

    useEffect(() => {
        if(DmsSingleComputeData === null) {
            getAndUpdateDmsSingleComputeData(params.computeId as string);
        } else {
            setEditValue(DmsSingleComputeData.name);
            setRowData(DmsSingleComputeData.tasks);
            updateSpinnerInfo(false);
        }
    }, [DmsSingleComputeData]);

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
                useAppStore.setState(() => ({ DmsSingleComputeData: null }));
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
                <Button variant={'solid'} _hover={{ bg: 'none' }} {...getEditButtonProps()} bg={'textColor'} top={'28px'} width={'48px'} height={'48px'}>
                    <PencilIcon color={'#666C80'} width={'40px'} height={'40px'} />
                </Button>
            </Flex>
        );
    }

    const handleEditNameChange = (editVal: any) => {
        setShowEditValuePreview(false);
        setEditValue(editVal);
    };

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
                getAndUpdateDmsSingleComputeData(params.computeId as string);
                toast(getToastOptions(toastMessages.successMessage, 'success'));
                updateSpinnerInfo(false);
            })
            .catch((err) => {
                toast(getToastOptions(err, 'error'));
            });
    };

    const handleEditName = () => {
        if (editValue !== DmsSingleComputeData?.name) {
            const variables = {
                id: DmsSingleComputeData.id,
                compute_name: editValue,
                worker_type_id: DmsSingleComputeData.resources.node_type.worker_type_id,
                driver_type_id: DmsSingleComputeData.resources.node_type.driver_type_id,
                spot_instances: DmsSingleComputeData.resources.spot_instances,
                workers: DmsSingleComputeData.resources.num_workers,
                terminate_after: DmsSingleComputeData.max_inactivity_min ? true : false,
                max_inactivity_min: DmsSingleComputeData.max_inactivity_min && DmsSingleComputeData.max_inactivity_min
            };
            handleEditProject(variables, {
                successMessage: 'Compute Name Edited Successfully',
                errorMessage: 'Compute Name Failed To edit'
            });
        }
        setShowEditValuePreview(true);
    };

    const calculateTotalRunTime = (tasks: any) => {
        if(tasks.length > 0) {
            const totalRunTime = Math.round((tasks.reduce((a: any, b: any) => a + b.execution_duration, 0)) / 60000);
            return `${totalRunTime} min`;
        } else {
            return 'N/A'
        }
    }

    return (
        <>
        {
            AllUsersData && DmsSingleComputeData && (
            <Box ml={71} mt={21}>
                <Text color={textColor} className="main-heading">
                    Compute /
                </Text>
                <Box className="computeDetailsMainContainer">
                    <Box color={textColor} className="computedetailsContainer-1">
                        <Box display="flex" alignItems="center">
                            <Button onClick={onBackClickHandler} className="back-button">
                                &lt;
                            </Button>

                            <Editable maxWidth={'500px'} width={'500px'} textAlign="left" fontWeight={400} value={editValue} onCancel={() => setShowEditValuePreview(true)} onEdit={() => setShowEditValuePreview(false)} onChange={handleEditNameChange} onSubmit={handleEditName}>
                                <Flex>
                                    <Center mt={'-10'}>
                                        <Box height={'28px'} fontSize={24} fontWeight={700} color={accesstextColor}>
                                            {
                                                showEditValuePreview &&
                                                <Text title={editValue} fontSize={'24px'} fontWeight={700}>{getTruncatedText(editValue, 40)}</Text>
                                            }
                                            <Input as={EditableInput} height={'30px'} mt={'-10px'} width={'500px'} />
                                        </Box>
                                    </Center>
                                    <Box mt={'-45px'}>
                                        <EditableControlsName />
                                    </Box>
                                </Flex>
                            </Editable>
                        </Box>
                        <Button variant="outline" className="delete-button" fontWeight={100} onClick={() => onDeleteHandler(DmsSingleComputeData.id)}>
                            Delete
                        </Button>
                    </Box>
                    <Box className="computedetailsContainer-2">
                        <Box className="computedetailsContainer-2sub-1">
                            <Box className="computedetailsContainer-2subsub-1">
                                <Avatar
                                    borderRadius="full"
                                    boxSize="40px"
                                    name={getUserNameFromId(AllUsersData, DmsSingleComputeData.created_by)}
                                    bg="rgb(160,186,194)"
                                    fontSize="14px"
                                    mt={10}
                                />
                            </Box>
                            <Box className="computedetailsContainer-2subsub-2">
                                <Box ml={15}>
                                    <Text fontSize={14}>Created by</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {getUserNameFromId(AllUsersData, DmsSingleComputeData.created_by)}
                                    </Text>
                                </Box>
                                <Box width={'360px'} ml={15} className="computedetailsContainer-2subsub-2sub-2">
                                    <Box width={'150px'}>
                                        <Text fontSize={14}>Compute ID</Text>
                                        <Text fontSize={14} fontWeight={600}>
                                            {DmsSingleComputeData.id}
                                        </Text>
                                    </Box>
                                    <Box width={'150px'} left={'20'}>
                                        <Text fontSize={14}>Compute Name</Text>
                                        <Text title={DmsSingleComputeData.name} fontSize={14} fontWeight={600}>
                                            {getTruncatedText(DmsSingleComputeData.name, 16)}
                                        </Text>
                                    </Box>
                                </Box>
                                <Box width={'360px'} ml={15} className="computedetailsContainer-2subsub-2sub-3">
                                    <Box width={'150px'}>
                                        <Text fontSize={14}>Created On</Text>
                                        <Text fontSize={14} fontWeight={600}>
                                            {convertTime(DmsSingleComputeData.created_at, false)}
                                        </Text>
                                    </Box>
                                    <Box width={'150px'}>
                                        <Text fontSize={14}>Last Modified</Text>
                                        <Text fontSize={14} fontWeight={600}>
                                            {convertTime(DmsSingleComputeData.updated_at, true)}
                                        </Text>
                                    </Box>
                                </Box>
                                <Box width={'360px'} ml={15} className="computedetailsContainer-2subsub-2sub-3">
                                    <Box width={'150px'}>
                                    </Box>
                                    <Box width={'150px'}>
                                    </Box>
                                </Box>
                                <Box width={'360px'} ml={15} className="computedetailsContainer-2subsub-2sub-3">
                                    <Box width={'150px'}>
                                    </Box>
                                    <Box width={'150px'}>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box className="computedetailsContainer-2sub-2">
                            <Box className="computedetailsContainer-2sub-2sub-1">
                                <ButtonGroup ml={8} onClick={() => onEditClickHandler(DmsSingleComputeData)}>
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
                                            {DmsSingleComputeData.resources.node_type.worker_type_id}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize={14}>Driver Type</Text>
                                        <Text fontSize={14} fontWeight={600}>
                                            {DmsSingleComputeData.resources.node_type.driver_type_id}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize={14}>Workers</Text>
                                        <Text fontSize={14} fontWeight={600}>
                                            {DmsSingleComputeData.resources.num_workers}
                                        </Text>
                                    </Box>
                                </Box>
                                <Box className="computedetailsContainer-2sub-2sub-2sub-2">
                                    <Box>
                                        <Text fontSize={14}>Total Cores</Text>
                                        <Text fontSize={14} fontWeight={600}>
                                            {DmsSingleComputeData.resources.node_type.total_num_cores}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize={14}>Total Memory</Text>
                                        <Text fontSize={14} fontWeight={600}>
                                            {Math.round(DmsSingleComputeData.resources.node_type.total_memory_mb / 1024)} GB
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize={14}>Total Runtime</Text>
                                        <Text fontSize={14} fontWeight={600}>
                                            {calculateTotalRunTime(DmsSingleComputeData.tasks)}
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
                            options={{ name: DmsSingleComputeData.name, label: 'compute', placeholder: 'My Compute 00' }}
                        />
                    )}
                    {editComputeModal.isOpen && <ComputeJsonModal isOpen={editComputeModal.isOpen} isEdit={isEdit} onClose={editComputeModal.onClose} />}
                </Box>
                <Box border={'1px solid'} borderColor={'light.lighterGrayishBlue'} overflowX={'hidden'} overflowY={'scroll'} borderRadius={8} width={'100%'} mt={'0'} pb={'16'} pl={10}>
                    {' '}
                    <Flex ml={'24'} mt={'21'} mb={'3'}>
                        <Center>
                            <Box>
                                <Text color={textColorPage} fontWeight={700}>
                                    My Compute Details
                                </Text>
                            </Box>
                            <Box color={'default.containerAgGridRecords'}>
                                <Text ml={'14'} fontWeight={700}>
                                    {DmsSingleComputeData.tasks?.length} records
                                </Text>
                            </Box>
                        </Center>
                    </Flex>
                    <Flex flexWrap={'wrap'} flexDirection={'row'} ml={'24'}>
                        <Box style={gridStyle} className="ag-theme-alpine">
                            <AgGridReact<any> ref={gridRef} pagination={true} paginationPageSize={10} onFirstDataRendered={onFirstDataRendered} rowData={rowData} columnDefs={columnDefs} animateRows={true}></AgGridReact>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        )}
            </>
    );
};

export default ComputeDetails;
