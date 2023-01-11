import { useApolloClient } from '@apollo/client';
import { Button } from '@chakra-ui/button';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { ComputeDelete, ComputeDetail, ComputeDetailListResponse, DeleteComputeDetail } from '../../models/computeDetails';
import { dmsDeleteCompute, getComputeListData } from '../../query';
import useAppStore from '../../store';
import { useToast } from '@chakra-ui/toast';
import { DELETE_COMPUTE_MODAL_PROPS } from '../../models/computeDetails';

function DeleteComputeModal({ cellId, isOpen, onClose }: DELETE_COMPUTE_MODAL_PROPS) {
    const toast = useToast();
    const client = useApolloClient();
    const [updateDmsComputeData] = useAppStore((state: any) => [state.updateDmsComputeData]);

    const onClickHandler = () => {
        client
            .mutate<ComputeDelete<DeleteComputeDetail>>({
                mutation: dmsDeleteCompute(cellId)
            })
            .then((response) => {
                toast({
                    title: `Compute is deleted successfully`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                const { GET_COMPUTELIST } = getComputeListData();
                client
                    .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                        query: GET_COMPUTELIST
                    })
                    .then((response) => {
                        let computedata = [...response.data.dmsComputes];
                        updateDmsComputeData(computedata);
                        onClose();
                    })
                    .catch((err) => {
                        onClose();
                    });
            })
            .catch((response) => {
                toast({
                    title: `A running compute can't be deleted`,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                onClose();
            });
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Compute</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody></ModalBody>
                    Are you sure you want to delete compute
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme="blue" mr={3} onClick={onClickHandler}>
                            OK
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default DeleteComputeModal;
