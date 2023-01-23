import { useApolloClient } from '@apollo/client';
import { Button } from '@chakra-ui/button';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import React from 'react';
import { ComputeDetail, ComputeDetailListResponse, ComputeStop, StopComputeDetail } from '../../models/computeDetails';
import { dmsStopComputeRun, getComputeListData } from '../../query';
import useAppStore from '../../store';
import { useToast } from '@chakra-ui/toast';
import { STOP_COMPUTE_RUNNING_MODALS_PROPS } from '../../models/computeDetails';
import { BusHelper } from '../../helpers/BusHelper';
import { v4 } from 'uuid';

function StopComputeRunningModals({ computeId, isOpen, onClose }: STOP_COMPUTE_RUNNING_MODALS_PROPS) {
    const client = useApolloClient();
    const opid = v4();
    const toast = useToast();
    const [updateDmsComputeData, UserConfig, submitMessage] = useAppStore((state: any) => [state.updateDmsComputeData, state.UserConfig, state.submitMessage]);
    const onClickHandler = (data: any) => {
        client
            .mutate<ComputeStop<StopComputeDetail>>({
                mutation: dmsStopComputeRun(computeId)
            })
            .then((response) => {
                const { GET_COMPUTELIST } = getComputeListData();
                toast({
                    title: `Compute is stopped`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                client
                    .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                        query: GET_COMPUTELIST
                    })
                    .then((response) => {
                        let computedata = [...response.data.dmsComputes];

                        updateDmsComputeData(computedata);
                        if (UserConfig && computeId) {
                            const shutDownRequest = BusHelper.GetShutdownRequestMessage({
                                experimentId: parseInt(computeId),
                                opId: opid,
                                userId: computeId,
                                //TODO Below are added just for fixing errors
                                project_id: 12,
                                get_datatables: undefined,
                                az_blob_get_containers: undefined,
                                az_blob_browse_container: undefined
                            });

                            submitMessage({ content: shutDownRequest });
                        }
                        onClose();
                    })
                    .catch((err) => console.error(err));
            })
            .catch(() => {
                toast({
                    title: `Compute is not stopped`,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody></ModalBody>
                    Are you sure you want to stop compute
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

export default StopComputeRunningModals;
