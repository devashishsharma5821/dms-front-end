import React, { useState } from 'react';
import { Formik, Field } from "formik";
import { Button, Divider, VStack, Modal, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, ModalBody, FormControl, Input, FormLabel, ModalFooter, FormErrorMessage } from '@chakra-ui/react';
import {setSettingsData} from "../../query";
import { useApolloClient } from "@apollo/client";
const Settings = (props: any) => {
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const client = useApolloClient();
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
          <ModalHeader mt={'20px'}  ml={'15px'}>Settings</ModalHeader>
          <ModalCloseButton mt={'20px'} />
          <Divider color={"default.dividerColor"} mt={'20px'} mb={'20px'}/>
          <ModalBody pb={6}  mr={'10px'} ml={'10px'}>
            <Formik
                initialValues={{
                  userName: "",
                  token: ""
                } as databricksSettings}
                onSubmit={(values) => {
                 console.log('Values', values)
                 client.mutate({
                    mutation: setSettingsData(values.userName ,values.token)
                })
                    .then((response) => {
                    console.log('Response is:',response)
                    if(response.data.dmsSetDatabricksCredentials){
                        props.onClose()
                    }
                    })
                    .catch((err) => console.log(err));
                    
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
                            variant="filled"
                        />
                      </FormControl>
                      <FormControl isInvalid={!!errors.token && touched.token}>
                        <FormLabel htmlFor="token">Token</FormLabel>
                        <Field
                            as={Input}
                            id="token"
                            name="token"
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
                      <Button type="submit" colorScheme="blue" width="65px" >
                       Ok
                      </Button>
                    </VStack>
                  </form>
              )}
            </Formik>
        
          </ModalBody>
          <Divider color={"default.dividerColor"} mt={'20px'} mb={'20px'} width="full"/>
                      <ModalFooter mb={'20px'} >
                     
                      
                    <Button onClick={props.onClose} colorScheme='blue' ml={'5px'}>Cancel</Button>
                    </ModalFooter>
        </ModalContent>
      </Modal>
    );
};

export default Settings;
