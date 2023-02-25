import { useState } from 'react';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import './deleteConfirmationModal.scss';

export const DeleteConfirmationModal = ({ isOpen, onClose, submitDeleteHandler, options }: any) => {
    const [inputedText, setInputedText] = useState<string>('');
    const [inputedTextFlag, setInputedTextFlag] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const setCheckedItems = (e: any) => {
        setIsChecked((prev) => !prev);
    };
    const onClickHandler = () => {
        submitDeleteHandler();
    };

    const onChangeHandler = (e: any) => {
        setInputedText(e.target.value);
        e.target.value === options.name ? setInputedTextFlag(true) : setInputedTextFlag(false);
    };

    return (
        <>
            <Modal closeOnOverlayClick={isOpen} isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent justifyContent="center" maxWidth={600} borderRadius="3px">
                    <ModalHeader fontSize="15px" padding="15px" borderBottom="1px solid rgb(234,234,234)">
                        Delete {options.label.toUpperCase()}
                    </ModalHeader>
                    <ModalCloseButton padding="24px" />
                    <Box display="flex" flexDirection="column" alignItems="center" className="alertBoxContainer">
                        <Alert status="warning" width="94%" height="43px" padding="0px" borderRadius="10px" display="flex" marginTop="20px" backgroundColor="rgb(255,249,217)">
                            <Box backgroundColor="rgb(234,227,180)" display="flex" justifyContent="center" alignItems="center" width="38px" height="43px" marginRight="0px">
                                <AlertIcon margin="auto" />
                            </Box>
                            <AlertDescription fontSize="14px" marginLeft="12px">
                                Please read and confirm before delete.
                            </AlertDescription>
                        </Alert>
                        <ModalBody pb={6} width="94%" fontSize="15px" marginTop="16px">
                            You are about to permanently delete&nbsp;
                            <Box display="inline" fontSize="14px" fontWeight="600">
                                {options.label}
                            </Box>
                            &nbsp;and all its contents.
                            <Box display="inline" fontSize="14px" fontWeight="600">
                                You will not be able to recover it, This action cannot be undone.
                            </Box>
                        </ModalBody>

                        <FormControl isRequired width="93%" fontSize="15px" marginTop="12px">
                            <FormLabel fontSize="15px" paddingBottom="5px">
                                Type compute name to confirm.
                            </FormLabel>
                            <Input type="text" borderRadius="2px" height="35px" value={inputedText} onChange={onChangeHandler} border="1px solid rgb(204,204,204)" placeholder={options.placeholder} />
                        </FormControl>
                        <Box width="93%" margin="21px 0px">
                            <Checkbox isChecked={isChecked} onChange={setCheckedItems} fontSize="15px">
                                I understand the consequences.
                            </Checkbox>
                        </Box>
                    </Box>

                    <ModalFooter borderTop="1px solid rgb(234,234,234)" height="68px">
                        <Button variant="outline" colorScheme="blue" marginRight="13px" borderRadius="3px" fontWeight={100} padding="16px" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            mr={3}
                            isDisabled={inputedTextFlag && isChecked ? false : true}
                            backgroundColor="rgb(232,58,58)"
                            borderRadius="3px"
                            fontWeight="100"
                            padding="16px"
                            onClick={onClickHandler}
                        >
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
