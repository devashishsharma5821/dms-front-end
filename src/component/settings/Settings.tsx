import React, { useState } from 'react';
import { Formik, Field } from "formik";
import { Button, Divider, VStack, Modal, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, ModalBody, FormControl, Input, FormLabel, ModalFooter, FormErrorMessage } from '@chakra-ui/react';
import {setSettingsData} from "../../query";
import { useApolloClient } from "@apollo/client";
const Settings = (props: any) => {
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
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
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mt={'20px'}  ml={'15px'}>Settings</ModalHeader>
          <ModalCloseButton mt={'20px'} />
          <Divider color={"default.dividerColor"} mt={'20px'} mb={'20px'}/>
          <ModalBody pb={6}  mr={'10px'} ml={'10px'}>
            <Formik
                initialValues={{
                  validateOnMount: true,
                  userName: "",
                  token: ""
                } as databricksSettings}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={(values) => {
                    setLoading(true);
                 client.mutate({
                    mutation: setSettingsData(values.userName ,values.token)
                })
                    .then((response) => {
                    if(response.data.dmsSetDatabricksCredentials){
                        props.onClose();
                        setLoading(false);
                    }
                    })
                    .catch((err) => console.error(err));
                }}
            >
              {({ handleSubmit, errors, touched ,isValid}) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                      <FormControl  isInvalid={!!errors.userName && touched.userName}>
                        <FormLabel htmlFor="userName">User Name</FormLabel>
                        <Field
                            as={Input}
                            id="userName"
                            name="userName"    
                            variant="filled"
                            validate={(value: any) => {
                                let error;
                                if (value.length === 0) {
                                  error = "User Name is required";
                                }
                                return error;
                              }}
                           
                        />
                             <FormErrorMessage>{errors.userName}</FormErrorMessage>
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
                              if (value.length === 0) {
                                error = "Token is required";
                              }

                              return error;
                            }}
                        />
                        <FormErrorMessage>{errors.token}</FormErrorMessage>
                        <Divider color={"default.dividerColor"} mt={'20px'} mb={'20px'} width="full"/>

                      </FormControl>
                      <ModalFooter mb={'20px'} >
                          {
                              (loading) ?
                                  <Button isLoading disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object) } onSubmit={props.onSubmit} type="submit" colorScheme="blue" width="65px" >Ok</Button>
                                  : <Button  disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object) } onSubmit={props.onSubmit} type="submit" colorScheme="blue" width="65px" >Ok</Button>
                          }
                          <Button disabled={loading} onClick={props.onClose} colorScheme='blue' ml={'5px'}>Cancel</Button>
                    </ModalFooter>
                    </VStack>
                  </form>
              )}
            </Formik>
          </ModalBody>
       </ModalContent>
      </Modal>
    );
};

export default Settings;
