import React, { useState } from 'react';
import { Formik, Field } from "formik";
import { Button, Divider, VStack, Modal, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, ModalBody, FormControl, Input, FormLabel, ModalFooter, FormErrorMessage, useColorModeValue,Select } from '@chakra-ui/react';
import {setSettingsData} from "../../query";
import { useApolloClient } from "@apollo/client";
import { DownArrowShare } from '../../assets/icons';

const SaveAs = (props: any) => {
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const textColorTitle = useColorModeValue('l default.titleForShare', 'default.whiteText');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const client = useApolloClient();
    interface databricksSettings {
        projectName: string;
        experimentName: string;
     }

    return (
    <Modal
        size={'lg'}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={props.isOpen}
        onClose={props.onClose}
        isCentered
      >
        <ModalOverlay />
   
        <ModalContent  >
          <ModalHeader color={textColor}  mt={'13px'}  ml={'20px'}>Save As</ModalHeader>
          <ModalCloseButton color={textColor} mr={'10px'} mt={'12px'} />
          <Divider color={"default.dividerColor"} mt={'13px'} mb={'20px'}/>
          <ModalBody pb={6}  mr={'20px'} ml={'18px'} >
            <Formik
                initialValues={{
                  validateOnMount: true,
                  projectName: "",
                  experimentName: ""
                } as databricksSettings}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={(values) => {
                 setLoading(true);
                 // The below api will be available when needs to be integrated
                //  client.mutate({
                //     mutation: setSettingsData(values.projectName ,values.experimentName)
                // })
                //     .then((response) => {
                //     if(response.data.dmsSetDatabricksCredentials){
                //         props.onClose();
                //         setLoading(false);
                //     }
                //     })
                //     .catch((err) => console.error(err));
                }}
            >
              {({ handleSubmit, errors, touched ,isValid}) => (
                  <form onSubmit={handleSubmit}>
                    <VStack  align="flex-start">
                      <FormControl  isInvalid={!!errors.projectName && touched.projectName} isRequired>
                        <FormLabel htmlFor="projectName" fontWeight={600}  color={textColorTitle} mb={6} >Project Name</FormLabel>
                        <Select 
                            icon={<DownArrowShare pl={'15px'} color={'#666C80'}/>}
                            borderRadius={3}
                            mb={16}
                            border={'1px'}
                            borderColor={'#D8DCDE'}
                            as={Select}
                            id="projectName"
                            name="projectName"    
                            variant='outline'
                            validate={(value: any) => {
                                let error;
                                if (value.length === 0) {
                                  error = " Project Name is required";
                                }
                                return error;
                              }} >
 
                                <option>My Project</option>
                                <option>Project 2</option>
                            
                        </Select>
                       
                        <FormErrorMessage>{errors.projectName}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.experimentName && touched.experimentName} isRequired>
                        <FormLabel htmlFor="experimentName" fontWeight={600} color={textColorTitle} mb={6}>Experiment Name</FormLabel>
                        <Field
                            borderRadius={3}
                            border={'1px'}
                            borderColor={'#D8DCDE'}
                            as={Input}
                            id="experimentName"
                            name="experimentName"
                            variant='outline'
                            validate={(value: any) => {
                              let error;
                              if (value.length === 0) {
                                error = "Experiment Name is required";
                              }

                              return error;
                            }}
                        />
                        <FormErrorMessage>{errors.experimentName}</FormErrorMessage>

                        <Divider color={"default.dividerColor"} mt={'26px'} ml={'-24px'} width={'512px'}/>

                        <ModalFooter mb={'18px'}  mt={'21px'}  mr={'0px'} >
                            <Button disabled={loading} onClick={props.onClose} colorScheme='gray' bg={'white'} color={'#2180C2'}  width={'81px'}  border={'1px'} borderColor={'#2180C2'} height={'40px'} borderRadius={3}>Cancel</Button>
                            {
                                (loading) ?
                                    <Button width={'68px'} height={'40px'} ml={'11px'} borderRadius={3} isLoading disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object) } onSubmit={props.onSubmit} type="submit" colorScheme="blue" >Save</Button>
                                    : <Button width={'68px'} height={'40px'} ml={'11px'} borderRadius={3} disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object) } onSubmit={props.onSubmit} type="submit" colorScheme="blue"  >Save</Button>
                            }
                         </ModalFooter>

                         </FormControl>
                    </VStack>
                  </form>
              )}
            </Formik>
          </ModalBody>
       </ModalContent>
    </Modal>
      
    );
};

export default SaveAs;
