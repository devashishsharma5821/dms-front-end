import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import {
    Button,
    Divider,
    VStack,
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalCloseButton,
    ModalBody,
    FormControl,
    Input,
    FormLabel,
    ModalFooter,
    FormErrorMessage,
    useColorModeValue,
    Select
} from '@chakra-ui/react';
import { DownArrowShare } from '../../assets/icons';

const NotebookModal = (props: any) => {
    const textColor = useColorModeValue('dark.veryDarkGray', 'default.whiteText');
    const textColorTitle = useColorModeValue('l default.titleForShare', 'default.whiteText');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState(false);

    interface databricksSettings {
        notebookName: string;
        defaultLanguage: string;
    }

    return (
        <Modal size={'lg'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />

            <ModalContent>
                <ModalHeader color={textColor} mt={'13px'} ml={'20px'}>
                    Create Notebook
                </ModalHeader>
                <ModalCloseButton color={textColor} mr={'10px'} mt={'12px'} />
                <Divider color={'default.dividerColor'} mt={'13px'} mb={'20px'} />
                <ModalBody pb={6} mr={'20px'} ml={'18px'}>
                    <Formik
                        initialValues={
                            {
                                validateOnMount: true,
                                notebookName: '',
                                defaultLanguage: ''
                            } as databricksSettings
                        }
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
                        {({ handleSubmit, errors, touched, isValid }) => (
                            <form onSubmit={handleSubmit}>
                                <VStack align="flex-start">
                                    <FormControl isInvalid={!!errors.notebookName && touched.notebookName} isRequired>
                                        <FormLabel htmlFor="notebookName" fontWeight={600} color={textColorTitle} mb={6}>
                                            Notebook Name
                                        </FormLabel>
                                        <Field
                                            borderRadius={3}
                                            border={'1px'}
                                            borderColor={'#D8DCDE'}
                                            as={Input}
                                            id="notebookName"
                                            name="notebookName"
                                            variant="outline"
                                            validate={(value: any) => {
                                                let error;
                                                if (value.length === 0) {
                                                    error = 'Notebook Name is required';
                                                }

                                                return error;
                                            }}
                                        />
                                        <FormErrorMessage>{errors.notebookName}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.defaultLanguage && touched.defaultLanguage} isRequired>
                                        <FormLabel htmlFor="defaultLanguage" fontWeight={600} color={textColorTitle} mb={6}>
                                            Default Language
                                        </FormLabel>
                                        <Select
                                            icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                            borderRadius={3}
                                            mb={16}
                                            border={'1px'}
                                            borderColor={'#D8DCDE'}
                                            as={Select}
                                            id="defaultLanguage"
                                            name="defaultLanguage"
                                            variant="outline"
                                            validate={(value: any) => {
                                                let error;
                                                if (value.length === 0) {
                                                    error = 'Default Language is required';
                                                }
                                                return error;
                                            }}
                                        >
                                            <option>Payton</option>
                                            <option>JavaScript </option>
                                        </Select>

                                        <FormErrorMessage>{errors.defaultLanguage}</FormErrorMessage>

                                        <Divider color={'default.dividerColor'} mt={'26px'} ml={'-24px'} width={'512px'} />

                                        <ModalFooter mb={'18px'} mt={'21px'} mr={'0px'}>
                                            <Button
                                                disabled={loading}
                                                onClick={props.onClose}
                                                colorScheme="gray"
                                                bg={'white'}
                                                color={'#2180C2'}
                                                width={'81px'}
                                                border={'1px'}
                                                borderColor={'#2180C2'}
                                                height={'40px'}
                                                borderRadius={3}
                                            >
                                                Cancel
                                            </Button>
                                            {loading ? (
                                                <Button
                                                    width={'68px'}
                                                    height={'40px'}
                                                    ml={'11px'}
                                                    borderRadius={3}
                                                    isLoading
                                                    disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object)}
                                                    onSubmit={props.onSubmit}
                                                    type="submit"
                                                    colorScheme="blue"
                                                >
                                                    Create
                                                </Button>
                                            ) : (
                                                <Button
                                                    width={'68px'}
                                                    height={'40px'}
                                                    ml={'11px'}
                                                    borderRadius={3}
                                                    disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object)}
                                                    onSubmit={props.onSubmit}
                                                    type="submit"
                                                    colorScheme="blue"
                                                >
                                                    Create
                                                </Button>
                                            )}
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

export default NotebookModal;
