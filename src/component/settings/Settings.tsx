import React from 'react';
import { Button, Divider,useDisclosure, Modal, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, ModalBody, FormControl, Input, FormLabel, ModalFooter } from '@chakra-ui/react';

const Settings = (props: any) => {
    const {  onClose } = useDisclosure();
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    return (
        <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <Divider color={"default.dividerColor"} mt={'20px'} mb={'20px'}/>
          <ModalBody pb={6}  mr={'10px'} ml={'10px'}>
            <FormControl>
              <FormLabel as='b'>Username</FormLabel>
              <Input ref={initialRef} placeholder='User Name' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel as='b'>Token</FormLabel>
              <Input placeholder='Token' />
            </FormControl>
          </ModalBody>
          <Divider color={"default.dividerColor"} mt={'20px'} mb={'20px'}/>
          <ModalFooter mb={'20px'}>
            <Button colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
};

export default Settings;
