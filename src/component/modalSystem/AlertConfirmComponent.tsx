import React, { useRef } from 'react';
import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogBody } from '@chakra-ui/react';

const AlertConfirmComponent: any = (props: any) => {
    const cancelRef: any = useRef();
    return (
        <>
            <AlertDialog isOpen={props.isOpen} leastDestructiveRef={cancelRef} onClose={props.onClose} closeOnOverlayClick={false} closeOnEsc={false}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {props.options.title}
                        </AlertDialogHeader>

                        <AlertDialogBody>{props.options.description}</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={props.onClose}>
                                {props.options.cancelButtonTitle}
                            </Button>
                            <Button onClick={props.confirm} ml={3}>
                                {props.options.confirmButtonTitle}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default AlertConfirmComponent;
