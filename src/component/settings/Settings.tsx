import React from 'react';
import { Formik, Field } from "formik";
import { Button, Divider, useDisclosure, VStack, Modal, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, ModalBody, FormControl, Input, FormLabel, ModalFooter, FormErrorMessage } from '@chakra-ui/react';

const Settings = (props: any) => {
    const {  onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    interface databricksSettings {
    userName: string;
    token: string;
  }
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
            <Formik
                initialValues={{
                  userName: "",
                  token: ""
                } as databricksSettings}
                onSubmit={(values) => {
                 console.log('Values', values)
                }}
            >
              {({ handleSubmit, errors, touched }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                      <FormControl>
                        <FormLabel htmlFor="userName">User Name</FormLabel>
                        <Field
                            as={Input}
                            id="userName"
                            name="userName"
                            type="userName"
                            variant="filled"
                        />
                      </FormControl>
                      <FormControl isInvalid={!!errors.token && touched.token}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Field
                            as={Input}
                            id="token"
                            name="token"
                            type="token"
                            variant="filled"
                            validate={(value: any) => {
                              let error;
                              if (value.length < 5) {
                                error = "Token must contain at least 6 characters";
                              }

                              return error;
                            }}
                        />
                        <FormErrorMessage>{errors.token}</FormErrorMessage>
                      </FormControl>
                      <Button type="submit" colorScheme="purple" width="full">
                        Login
                      </Button>
                    </VStack>
                  </form>
              )}
            </Formik>
            {/*<FormControl>*/}
            {/*  <FormLabel as='b'>Username</FormLabel>*/}
            {/*  <Input ref={initialRef} placeholder='User Name' />*/}
            {/*</FormControl>*/}

            {/*<FormControl mt={4}>*/}
            {/*  <FormLabel as='b'>Token</FormLabel>*/}
            {/*  <Input placeholder='Token' />*/}
            {/*</FormControl>*/}
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
