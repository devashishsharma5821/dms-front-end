import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';
import { COMPUTE_MODAL_PROPS } from '../../models/types';
import { useNavigate } from 'react-router';

const IsRunningModal = (props: COMPUTE_MODAL_PROPS) => {
    const navigate = useNavigate();

    const formSubmitHandler = () => {
        navigate('/compute');
    };

    return (
        <>
            <Modal isOpen={props.isOpen} onClose={props.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody></ModalBody>
                    No running compute click ok to navigate to compute page.
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={props.onClose}>
                            Close
                        </Button>
                        <Button colorScheme="blue" mr={3} onClick={formSubmitHandler}>
                            OK
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default IsRunningModal;
