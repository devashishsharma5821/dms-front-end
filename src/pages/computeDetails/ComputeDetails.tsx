import { useState, useContext, useEffect } from 'react';
import { Box, Button, useColorModeValue, Text, Avatar, Link, ButtonGroup, useDisclosure, Toast } from '@chakra-ui/react';
import { EditIcon } from '../../assets/icons';
import ComputeJsonModal from '../../component/modalSystem/ComputeJsonModal';
import './computedetails.scss';
import { DeleteComputeModal } from './DeleteComputeModal';
import { ComputeContext } from '../../context/computeContext';
import { useParams } from 'react-router-dom';
import useAppStore from '../../store';
import { useNavigate } from 'react-router-dom';
import { getAndUpdateDmsComputeData } from '../../zustandActions/computeActions';
import client from '../../apollo-client';
import { ComputeDelete, DeleteComputeDetail } from '../../models/computeDetails';
import { dmsDeleteCompute } from '../../query';

const ComputeDetails = () => {
    const [DmsComputeData] = useAppStore((state: any) => [state.DmsComputeData]);
    const textColor = useColorModeValue('light.header', 'dark.white');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const deleteComputeModal = useDisclosure();
    const editComputeModal = useDisclosure();
    const [deleteId, setDeleteId] = useState<string>('');
    const context = useContext(ComputeContext);
    const navigate = useNavigate();
    const { computeId } = useParams();

    useEffect(() => {
        getAndUpdateDmsComputeData();
    }, []);

    const onBackClickHandler = () => {
        navigate('/compute');
    };

    const onDeleteHandler = (id: string) => {
        deleteComputeModal.onOpen();
        setDeleteId(id);
    };

    const submitDeleteHandler = () => {
        client
            .mutate<ComputeDelete<DeleteComputeDetail>>({
                mutation: dmsDeleteCompute(deleteId)
            })
            .then(() => {
                Toast({
                    title: `Compute is deleted successfully`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                getAndUpdateDmsComputeData();
                navigate('/compute');
            })
            .catch(() => {
                Toast({
                    title: `A running compute can't be deleted`,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                deleteComputeModal.onClose();
            });
    };

    const onEditClickHandler = (data: any) => {
        context.updateFormData({
            id: data.id,
            max_inactivity_min: data?.max_inactivity_min,
            compute_name: data.name,
            autoscale: data.resources.autoscale,
            workers: data.resources.num_workers ? data.resources.num_workers : '0',
            spot_instances: data.resources.spot_instances,
            worker_type_id: data.resources.node_type.worker_type_id,
            driver_type_id: data.resources.node_type.driver_type_id,
            min_workers: data.resources?.autoscale?.min_workers,
            max_workers: data.resources?.autoscale?.max_workers,
            enable_autoscaling: data.resources.autoscale ? true : false,
            terminate_after: data?.max_inactivity_min ? true : false
        });
        setIsEdit(true);
        editComputeModal.onOpen();
    };
    console.log('is edit ==> ', isEdit);
    const computeData = DmsComputeData && DmsComputeData.filter((computeData: any) => computeData.id === computeId);
    if (!computeData) {
        return <div>loading</div>;
    }

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
                    <Text fontSize="18px" fontWeight="700">
                        {computeData[0].name}
                    </Text>
                    <Box ml={10}>
                        <EditIcon />
                    </Box>
                    <Button variant="outline" className="delete-button" fontWeight={100} onClick={() => onDeleteHandler(computeData[0].id)}>
                        Delete
                    </Button>
                </Box>
                <Box className="computedetailsContainer-2">
                    <Box className="computedetailsContainer-2sub-1">
                        <Box className="computedetailsContainer-2subsub-1">
                            <Avatar borderRadius="full" boxSize="40px" name={`R K`} bg="rgb(160,186,194)" fontSize="14px" mt={10} />
                        </Box>
                        <Box className="computedetailsContainer-2subsub-2">
                            <Box ml={15}>
                                <Text fontSize={14}>Created by</Text>
                                <Text fontSize={14} fontWeight={600}>
                                    Ritesh Kumar
                                </Text>
                            </Box>
                            <Box ml={15} className="computedetailsContainer-2subsub-2sub-2">
                                <Box>
                                    <Text fontSize={14}>Compute ID</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData[0].id}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={14}>Compute Name</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData[0].name}
                                    </Text>
                                </Box>
                            </Box>
                            <Box ml={15} className="computedetailsContainer-2subsub-2sub-3">
                                <Box>
                                    <Text fontSize={14}>Created On</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        10/05/2022 10:20 AM
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={14}>Last Modified</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        10 Minutes ago
                                    </Text>
                                </Box>
                            </Box>
                            <Box ml={15} className="computedetailsContainer-2subsub-2sub-4">
                                <Text>Tag:</Text>
                            </Box>
                        </Box>
                    </Box>
                    <Box className="computedetailsContainer-2sub-2">
                        <Box className="computedetailsContainer-2sub-2sub-1">
                            <ButtonGroup ml={8} onClick={() => onEditClickHandler(computeData[0])}>
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
                                        {computeData[0].resources.node_type.worker_type_id}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={14}>Driver Type</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData[0].resources.node_type.driver_type_id}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={14}>Workers</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData[0].resources.num_workers}
                                    </Text>
                                </Box>
                            </Box>
                            <Box className="computedetailsContainer-2sub-2sub-2sub-2">
                                <Box>
                                    <Text fontSize={14}>Total Cores</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData[0].resources.node_type.driver_num_cores + computeData[0].resources.node_type.worker_num_cores}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={14}>Total Memory</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        {computeData[0].resources.node_type.driver_num_cores + computeData[0].resources.node_type.worker_num_cores} GB
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize={14}>Total Runtime</Text>
                                    <Text fontSize={14} fontWeight={600}>
                                        8h 20min
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {deleteComputeModal.isOpen && (
                    <DeleteComputeModal isOpen={deleteComputeModal.isOpen} onClose={deleteComputeModal.onClose} submitDeleteHandler={submitDeleteHandler} computeName={computeData[0].name} />
                )}
                {editComputeModal.isOpen && <ComputeJsonModal isOpen={editComputeModal.isOpen} isEdit={isEdit} onClose={editComputeModal.onClose} />}
            </Box>
        </Box>
    );
};

export default ComputeDetails;
