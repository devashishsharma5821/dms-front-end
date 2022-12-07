import React from 'react';
import './comments.scss';
import {
    Button,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useColorModeValue,
    Drawer
} from '@chakra-ui/react';
const Comments = (props: any) => {
    return (
        <>
            <Drawer isOpen={props.isOpen} placement="right" onClose={props.onClose} colorScheme={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')}>
                <DrawerOverlay />
                <DrawerContent mt="44px" bg={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')}>
                    <DrawerCloseButton />
                    <DrawerHeader>Comments</DrawerHeader>

                    <DrawerBody>
                       Comments will go here
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={props.onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue">Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>

    );
};

export default Comments;
