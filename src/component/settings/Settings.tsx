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
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    useColorModeValue
} from '@chakra-ui/react';
import { setSettingsData } from '../../query';
import { useApolloClient } from '@apollo/client';
const Settings = (props: any) => {
    const titleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const client = useApolloClient();
    interface databricksSettings {
        userName: string;
        token: string;
    }

    return (
        <Modal size={'md'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent maxWidth={'458px'} height={'auto'}>
                <ModalHeader mt={'20px'} ml={'15px'}>
                    Settings
                </ModalHeader>
                <ModalCloseButton mt={'20px'} />
                <Divider color={'default.dividerColor'} mt={'20px'} mb={'20px'} />
                <Tabs ml={'20px'} width={'414px'} maxHeight={'478px'}>
                    <TabList>
                        <Tab fontWeight={700}>Databricks</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <ModalBody mr={'10px'}>
                                <Formik
                                    initialValues={
                                        {
                                            validateOnMount: true,
                                            userName: '',
                                            token: ''
                                        } as databricksSettings
                                    }
                                    validateOnBlur={true}
                                    validateOnChange={true}
                                    onSubmit={(values) => {
                                        setLoading(true);
                                        client
                                            .mutate({
                                                mutation: setSettingsData(values.userName, values.token)
                                            })
                                            .then((response) => {
                                                if (response.data.dmsSetDatabricksCredentials) {
                                                    props.onClose();
                                                    setLoading(false);
                                                }
                                            })
                                            .catch((err) => console.error(err));
                                    }}
                                >
                                    {({ handleSubmit, errors, touched, isValid }) => (
                                        <form onSubmit={handleSubmit}>
                                            <VStack spacing={4} align="flex-start">
                                                <FormControl isInvalid={!!errors.userName && touched.userName}>
                                                    <FormLabel htmlFor="userName" mt={'22px'} ml={'-10px'} color={titleColor} fontWeight={600}>
                                                        User Name
                                                    </FormLabel>
                                                    <Field
                                                        pl={'12px'}
                                                        color={'#2D373E'}
                                                        ml={'-10px'}
                                                        width={'414px'}
                                                        height={'32px'}
                                                        mt={'6px'}
                                                        borderRadius={'3px'}
                                                        as={Input}
                                                        id="userName"
                                                        name="userName"
                                                        validate={(value: any) => {
                                                            let error;
                                                            if (value.length === 0) {
                                                                error = 'User Name is required';
                                                            }
                                                            return error;
                                                        }}
                                                    />
                                                    <FormErrorMessage>{errors.userName}</FormErrorMessage>
                                                </FormControl>
                                                <FormControl isInvalid={!!errors.token && touched.token}>
                                                    <FormLabel htmlFor="token" mt={'24px'} ml={'-10px'} color={titleColor} fontWeight={600}>
                                                        Token
                                                    </FormLabel>
                                                    <Field
                                                        pl={'12px'}
                                                        ml={'-10px'}
                                                        width={'414px'}
                                                        height={'32px'}
                                                        color={'#2D373E'}
                                                        mt={'6px'}
                                                        borderRadius={'3px'}
                                                        as={Input}
                                                        id="token"
                                                        name="token"
                                                        validate={(value: any) => {
                                                            let error;
                                                            if (value.length === 0) {
                                                                error = 'Token is required';
                                                            }

                                                            return error;
                                                        }}
                                                    />
                                                    <FormErrorMessage>{errors.token}</FormErrorMessage>
                                                    <Divider color={'default.dividerColor'} mt={'80px'} mb={'20px'} width={'458px'} ml={'-30px'} />

                                                    <ModalFooter mb={'20px'}>
                                                        {loading ? (
                                                            <Button
                                                                width={'72px'}
                                                                height={'36px'}
                                                                borderRadius={4}
                                                                border={'1px'}
                                                                fontWeight={600}
                                                                borderColor={'default.textButton'}
                                                                color={'default.textButton'}
                                                                isLoading
                                                                disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object)}
                                                                onSubmit={props.onSubmit}
                                                                type="submit"
                                                            >
                                                                Submit
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                width={'72px'}
                                                                height={'36px'}
                                                                borderRadius={4}
                                                                border={'1px'}
                                                                fontWeight={600}
                                                                borderColor={'default.textButton'}
                                                                color={'default.textButton'}
                                                                disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object)}
                                                                onSubmit={props.onSubmit}
                                                                type="submit"
                                                            >
                                                                Submit
                                                            </Button>
                                                        )}
                                                        <Button
                                                            disabled={loading}
                                                            onClick={props.onClose}
                                                            ml={'5px'}
                                                            mr={'-25px'}
                                                            width={'72px'}
                                                            height={'36px'}
                                                            borderRadius={4}
                                                            border={'1px'}
                                                            fontWeight={600}
                                                            borderColor={'default.textButton'}
                                                            color={'default.textButton'}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </ModalFooter>
                                                </FormControl>
                                            </VStack>
                                        </form>
                                    )}
                                </Formik>
                            </ModalBody>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </ModalContent>
        </Modal>
    );
};

export default Settings;
