import { useApolloClient } from '@apollo/client';
import { Button } from '@chakra-ui/button';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { ComputeDetail, ComputeDetailListResponse } from '../../models/computeDetails';
import { getComputeListData } from '../../query';
import useAppStore from '../../store';
import { gql } from '@apollo/client';

function DeleteComputeModal({ cellId, isOpen, onClose }: any) {
    const client = useApolloClient();
    const [updateDmsComputeData] = useAppStore((state: any) => [state.updateDmsComputeData]);

    const onClickHandler = () => {
        const mutation = gql` 
        mutation {
            dmsDeleteCompute(  
               id: "${cellId}"  
                  ) 
            }`;

        client
            .mutate<any>({
                mutation: mutation
            })
            .then((response) => {
                const { GET_COMPUTELIST } = getComputeListData();
                client
                    .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                        query: GET_COMPUTELIST
                    })
                    .then((response) => {
                        console.log('response data of get ===>', response);
                        let computedata = [...response.data.dmsComputes];
                        updateDmsComputeData(computedata);
                        onClose();
                    })
                    .catch((err) => console.error(err));
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
