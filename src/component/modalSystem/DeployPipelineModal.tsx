import React, { useEffect, useRef, useState } from 'react';
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
    useColorModeValue,
    Select,
    Box,
    Flex,
    Center,
    Text,
    useDisclosure,
    Switch,
    Checkbox
} from '@chakra-ui/react';
import { CloseIcon, DownArrowShare } from '../../assets/icons';
import OrIcon from '../../assets/icons/OrIcon';
import ComputeJsonModal from './ComputeJsonModal';
import useAppStore from '../../store';
import { ComputeAppStoreState, DmsComputeData } from '../../models/computeDetails';
import { getAndUpdateDmsComputeData } from '../../zustandActions/computeActions';
import { Show, Hide } from '@chakra-ui/react';

const DeployPipelineModal = (props: any) => {
    const textColor = useColorModeValue('dark.darkGrayCreate', 'default.whiteText');
    const textColorTitle = useColorModeValue('default.titleForShare', 'default.whiteText');
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const boxColor = useColorModeValue('#F7FAFC', '#B3B3B3');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const CreateModal = useDisclosure();
    const [commentChecked, setCommentChecked] = React.useState(false);

    const [DmsComputeData] = useAppStore((state: ComputeAppStoreState) => [state.DmsComputeData]);
    interface databricksSettings {
        pipeline: string;
        existingCompute: string;
    }
    const newComputedata = (computedata: any) => {
        return (
            `${computedata.name} - ` +
            `${Math.floor((computedata.resources.node_type.driver_memory_mb + computedata.resources.node_type.worker_memory_mb) / 1024)} GB | ${
                computedata.resources.node_type.worker_num_cores + computedata.resources.node_type.driver_num_cores
            } Cores`
        );
    };
    useEffect(() => {
        console.log('I am here');
        if (DmsComputeData === null || DmsComputeData === undefined) {
            getAndUpdateDmsComputeData();
        }
    }, [DmsComputeData]);

    return (
        <Flex width={'653px'}>
            <Modal size={'2xl'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader color={textColor} mt={'13px'} ml={'20px'}>
                        Deploy Pipeline
                    </ModalHeader>
                    <ModalCloseButton color={textColor} mr={'10px'} mt={'12px'} />
                    <Divider color={'default.dividerColor'} mt={'13px'} mb={'20px'} />
                    <ModalBody pb={6} ml={'18px'}>
                        <Formik
                            initialValues={
                                {
                                    validateOnMount: true,
                                    pipeline: '',
                                    existingCompute: ''
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
                                        <FormControl>
                                            <Box width={'612px'}>
                                                <FormLabel width={'324px'} htmlFor="Pipeline" fontWeight={600} color={textColorTitle} mb={6}>
                                                    Pipeline
                                                </FormLabel>
                                                <Field borderRadius={3} border={'1px'} borderColor={'#D8DCDE'} as={Input} id="Pipeline" name="Pipeline" variant="outline" />
                                            </Box>
                                        </FormControl>
                                        <Flex>
                                            <Center width={'612px'} bg={boxColor} height={'92px'} mt={'10px'} mb={'40px'}>
                                                <FormControl isInvalid={!!errors.existingCompute && touched.existingCompute} isRequired>
                                                    <Box>
                                                        <FormLabel htmlFor="existingCompute" fontWeight={600} color={textColorTitle} mt={14} ml={14}>
                                                            Select From Existing Compute
                                                        </FormLabel>
                                                        <Select
                                                            icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                                            borderRadius={3}
                                                            width={'324px'}
                                                            mb={14}
                                                            ml={14}
                                                            border={'1px'}
                                                            borderColor={'#D8DCDE'}
                                                            as={Select}
                                                            id="existingCompute"
                                                            name="existingCompute"
                                                            variant="outline"
                                                            validate={(value: any) => {
                                                                let error;
                                                                if (value.length === 0) {
                                                                    error = ' Select From Existing Compute is required';
                                                                }
                                                                return error;
                                                            }}
                                                        >
                                                            {DmsComputeData.map((computeData) => (
                                                                <>
                                                                    <option>
                                                                        <>{newComputedata(computeData)}</>{' '}
                                                                    </option>
                                                                </>
                                                            ))}
                                                        </Select>
                                                    </Box>
                                                </FormControl>
                                                <Box ml={'14px'} mr={'23px'}>
                                                    {' '}
                                                    <OrIcon />
                                                </Box>
                                                <Box width={'324px'}>
                                                    <Text fontWeight={600} color={textColorTitle} mt={14}>
                                                        Create New Compute
                                                    </Text>
                                                    <Button
                                                        width={'151px'}
                                                        height={'36px'}
                                                        mt={8}
                                                        mb={14}
                                                        color={'#2180C2'}
                                                        bg={'white'}
                                                        onClick={CreateModal.onOpen}
                                                        border={'1px'}
                                                        borderColor={'#2180C2'}
                                                    >
                                                        Create Compute
                                                    </Button>
                                                    <ComputeJsonModal isOpen={CreateModal.isOpen} onClose={CreateModal.onClose}></ComputeJsonModal>
                                                </Box>
                                            </Center>
                                        </Flex>
                                        <Flex mb={'21px'}>
                                            <Center>
                                                <Text mt={'20'} color={textColor2}>
                                                    Tag:
                                                </Text>
                                                <Center>
                                                    <Box ml={14} mt={22} bg={' #F2F4F8'} height={'24px'} borderRadius={3} minWidth={70}>
                                                        <Flex>
                                                            <Center>
                                                                <Text color={'#1A3F59'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                    Tag Name 1
                                                                </Text>

                                                                <Box justifyContent={'flex-end'} ml={'14px'} mr={6}>
                                                                    <CloseIcon color={'#666C80'} />
                                                                </Box>
                                                            </Center>
                                                        </Flex>
                                                    </Box>
                                                </Center>
                                                <Text color={'#2180C2'} mt={'20'} ml={20}>
                                                    + Add Tag
                                                </Text>
                                            </Center>
                                        </Flex>
                                        <Flex>
                                            <Center>
                                                <FormControl display="flex" alignItems="center" mt={'35px'}>
                                                    <Switch />
                                                    <FormLabel htmlFor="email-alerts" mb="0" ml={'12px'} fontWeight={700}>
                                                        Schedual
                                                    </FormLabel>
                                                </FormControl>
                                            </Center>
                                        </Flex>
                                        <Flex>
                                            <Center>
                                                <FormControl isInvalid={!!errors.existingCompute && touched.existingCompute} isRequired>
                                                    <Box>
                                                        <FormLabel htmlFor="existingCompute" fontWeight={600} color={textColorTitle} mt={14}>
                                                            Every
                                                        </FormLabel>
                                                        <Select
                                                            icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                                            borderRadius={3}
                                                            width={'91px'}
                                                            mb={14}
                                                            mt={6}
                                                            border={'1px'}
                                                            borderColor={'#D8DCDE'}
                                                            as={Select}
                                                            id="existingCompute"
                                                            name="existingCompute"
                                                            variant="outline"
                                                            validate={(value: any) => {
                                                                let error;
                                                                if (value.length === 0) {
                                                                    error = ' Select From Existing Compute is required';
                                                                }
                                                                return error;
                                                            }}
                                                        >
                                                            <option>Sunday</option>
                                                            <option>Monday</option>
                                                        </Select>
                                                    </Box>
                                                </FormControl>
                                                <FormControl isInvalid={!!errors.existingCompute && touched.existingCompute} isRequired>
                                                    <Box>
                                                        <FormLabel htmlFor="existingCompute" fontWeight={600} color={textColorTitle} mt={14} ml={14}>
                                                            Start Time
                                                        </FormLabel>
                                                        <Select
                                                            icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                                            borderRadius={3}
                                                            width={'134px'}
                                                            mb={14}
                                                            ml={16}
                                                            mt={6}
                                                            border={'1px'}
                                                            borderColor={'#D8DCDE'}
                                                            as={Select}
                                                            id="existingCompute"
                                                            name="existingCompute"
                                                            variant="outline"
                                                            validate={(value: any) => {
                                                                let error;
                                                                if (value.length === 0) {
                                                                    error = ' Select From Existing Compute is required';
                                                                }
                                                                return error;
                                                            }}
                                                        >
                                                            <option>10:00 AM</option>
                                                            <option>11:00 PM</option>
                                                        </Select>
                                                    </Box>
                                                </FormControl>
                                                <FormControl isInvalid={!!errors.existingCompute && touched.existingCompute} isRequired>
                                                    <Box>
                                                        <FormLabel htmlFor="existingCompute" fontWeight={600} color={textColorTitle} mt={14} ml={14}>
                                                            Time Zone
                                                        </FormLabel>
                                                        <Select
                                                            icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                                            borderRadius={3}
                                                            width={'355px'}
                                                            mb={14}
                                                            ml={16}
                                                            mt={6}
                                                            border={'1px'}
                                                            borderColor={'#D8DCDE'}
                                                            as={Select}
                                                            id="existingCompute"
                                                            name="existingCompute"
                                                            variant="outline"
                                                            validate={(value: any) => {
                                                                let error;
                                                                if (value.length === 0) {
                                                                    error = ' Select From Existing Compute is required';
                                                                }
                                                                return error;
                                                            }}
                                                        >
                                                            <option>(GMT -6:00) Central Time (US &amp; ...)</option>
                                                        </Select>
                                                    </Box>
                                                </FormControl>
                                            </Center>
                                        </Flex>
                                        <Flex>
                                            <Center>
                                                <Checkbox defaultChecked mt={'16px'}>
                                                    Notify me status report by email
                                                </Checkbox>
                                            </Center>
                                        </Flex>
                                        <Divider width={'636px'} color={'default.dividerColor'} alignSelf={'center'} mb={'15px'} pl={'18px'} pr={'1px'} ml={'-18px'} />
                                        <ModalFooter alignSelf={'end'}>
                                            <Button
                                                disabled={loading}
                                                onClick={props.onClose}
                                                colorScheme="gray"
                                                mt={'15px'}
                                                mb={'15px'}
                                                bg={'white'}
                                                color={'#2180C2'}
                                                width={'80px'}
                                                border={'1px'}
                                                borderColor={'#2180C2'}
                                                height={'36px'}
                                                borderRadius={4}
                                            >
                                                Cancel
                                            </Button>
                                            {loading ? (
                                                <Button
                                                    mt={'15px'}
                                                    width={'169px'}
                                                    height={'36px'}
                                                    ml={'11px'}
                                                    mr={'20px'}
                                                    mb={'15px'}
                                                    borderRadius={4}
                                                    isLoading
                                                    disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object)}
                                                    onSubmit={props.onSubmit}
                                                    type="submit"
                                                    colorScheme="blue"
                                                >
                                                    Schedule & Deploy
                                                </Button>
                                            ) : (
                                                <Button
                                                    mt={'15px'}
                                                    width={'169px'}
                                                    height={'36px'}
                                                    mb={'15px'}
                                                    ml={'11px'}
                                                    mr={'20px'}
                                                    borderRadius={4}
                                                    disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object)}
                                                    onSubmit={props.onSubmit}
                                                    type="submit"
                                                    colorScheme="blue"
                                                >
                                                    Schedule & Deploy
                                                </Button>
                                            )}
                                        </ModalFooter>
                                    </VStack>
                                </form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default DeployPipelineModal;
