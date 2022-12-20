// import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useApolloClient, gql, DocumentNode } from '@apollo/client';
import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Switch,
    Text,
    Tooltip,
    FormErrorMessage
} from '@chakra-ui/react';
import BlackbottomedTriangleIcon from '../../assets/icons/BlackbottomedTriangleIcon';
import InfoIcon from '../../assets/icons/InfoIcon';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ComputeModal = (props: { isOpen: boolean; onClose: any }) => {
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const client = useApolloClient();
    // const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        enableAutoScaling: Yup.boolean(),
        compute_name: Yup.string().required('Compute name is required'),
        worker_type_id: Yup.string().required('Worker type id is required'),

        workers: Yup.number().when('enableAutoScaling', {
            is: false,
            then: Yup.number().min(0)
        }),
        min_workers: Yup.number().when('enableAutoScaling', {
            is: true,
            then: Yup.number().required('Min workers is required').positive('Number of workers should be greater than zero.').lessThan(Yup.ref('max_workers'), 'Max must be greater than Min')
        }),
        max_workers: Yup.number().when('enableAutoScaling', {
            is: true,
            then: Yup.number().required('Max workers is required').moreThan(Yup.ref('min_workers'), 'Min must be less than Max')
        })
    });

    const formik: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            compute_name: '',
            worker_type_id: '',
            workers: 0,
            min_workers: 0,
            max_workers: 0,
            enableAutoScaling: false,
            spot_instances: false,
            max_inactivity_min: 10
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setError('');
            let mutation: DocumentNode | null = null;
            if (!formik?.values?.enableAutoScaling) {
                mutation = gql`
                        mutation {
                            dmsCreateCompute(
                                name: "${values.compute_name}",
                                resources:{
                                node_type: { 
                                    worker_type_id: "${values.worker_type_id}" 
                                    },
                                    num_workers: ${values.workers} ,
                                    spot_instances: ${values.spot_instances}
                                } ,
                                max_inactivity_min: ${values.max_inactivity_min}
                                )
                        }
                        `;
            } else {
                mutation = gql`mutation {
                        dmsCreateCompute(
                          name: "${values.compute_name}",
                          resources: {
                            node_type: { 
                                worker_type_id: "${values.worker_type_id}" 
                            },
                            spot_instances: ${values.spot_instances},
                            autoscale: {
                                min_workers: ${values.min_workers},
                                max_workers: ${values.max_workers}
                            }
                        },
                          max_inactivity_min: ${values.max_inactivity_min},
                        )
                      }
                      `;
            }
            client
                .mutate<any>({
                    mutation: mutation
                })
                .then((response) => {
                    console.log('response ===>', response);
                    formik.handleReset();
                    cancel();
                    // props.onClose();
                })
                .catch((err) => console.error(err));
        }
    });

    const cancel = () => {
        console.log('cancel running');
        props.onClose((prev: any) => {
            return !prev;
        });
    };

    const handleAutoScaling = (event: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('enableAutoScaling', event.target.checked);
    };

    const handleSpotInstances = (event: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('spot_instances', event.target.checked);
        console.log('toggling');
    };

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <form onSubmit={formik.handleSubmit}>
                <ModalContent width={630} maxWidth={630} height="var(--chakra-space-464)" color="#171717">
                    <ModalHeader height="var(--chakra-space-60)" fontSize={16} borderBottom="1px solid #EAEAEA" fontWeight="700" flex={'none'} padding={20}>
                        Create Compute
                    </ModalHeader>
                    <ModalCloseButton mt={10} />
                    <ModalBody padding={20}>
                        <FormControl isInvalid={formik.touched.compute_name && Boolean(formik.errors.compute_name)}>
                            <FormLabel>Compute Name</FormLabel>
                            <Input type="text" name="compute_name" id="compute_id" value={formik.values.compute_name} onChange={formik.handleChange} />
                            <FormErrorMessage>{formik.touched.compute_name && formik.errors.compute_name}</FormErrorMessage>
                        </FormControl>
                        <Box mt={22} display="flex" mb={20}>
                            <FormControl width={327}>
                                <FormLabel>
                                    Worker Type
                                    <Tooltip label="Right end" placement="right-end" hasArrow>
                                        <Text display={'inline-block'} ml={2}>
                                            <InfoIcon />
                                        </Text>
                                    </Tooltip>
                                </FormLabel>
                                <Select
                                    placeholder="Select option"
                                    name="worker_type_id"
                                    id="worker_type_id"
                                    value={formik.values.worker_type_id}
                                    onChange={formik.handleChange}
                                    icon={
                                        <Text mt={10} marginRight={'13'}>
                                            <BlackbottomedTriangleIcon />
                                        </Text>
                                    }
                                >
                                    <option>Standard_DS3_v2 56 GB | 16 Cores </option>
                                    <option>UnStandard_DS3_v2 56 GB | 16 Cores </option>
                                    <option>DisStandard_DS3_v2 56 GB | 16 Cores </option>
                                </Select>
                            </FormControl>
                            {formik.values.enableAutoScaling && (
                                <>
                                    <FormControl width={112} ml={24} isInvalid={formik.touched.min_workers && Boolean(formik.errors.min_workers)}>
                                        <FormLabel>Min Workers</FormLabel>
                                        <Input type="text" id="min_workers" name="min_workers" value={formik.values.min_workers} onChange={formik.handleChange} />
                                        <FormErrorMessage>{formik.touched.min_workers && formik.errors.min_workers}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl width={113} ml={16} isInvalid={formik.touched.max_workers && Boolean(formik.errors.max_workers)}>
                                        <FormLabel>Max Workers</FormLabel>
                                        <Input type="text" id="max_workers" name="max_workers" value={formik.values.max_workers} onChange={formik.handleChange} />
                                        <FormErrorMessage>{formik.touched.max_workers && formik.errors.max_workers}</FormErrorMessage>
                                    </FormControl>
                                </>
                            )}
                            {!formik.values.enableAutoScaling && (
                                <FormControl width={113} ml={16} isInvalid={formik.touched.workers && Boolean(formik.errors.workers)}>
                                    <FormLabel>Workers</FormLabel>
                                    <Input type="text" id="workers" name="workers" onChange={formik.handleChange} value={formik.values.workers} />
                                    <FormErrorMessage>{formik.touched.workers && formik.errors.workers}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Box>
                        <FormControl display="flex" alignItems="center" mb={16} onChange={formik.handleChange}>
                            <Switch id="spot-instances" width={30} height={15} onChange={handleSpotInstances} />
                            <FormLabel htmlFor="spot-instances" mb="0" ml={7}>
                                Spot instances
                            </FormLabel>
                        </FormControl>
                        <FormControl display="flex" onChange={formik.handleChange} alignItems="center" mb={14}>
                            <Switch id="enableAutoScaling" name="enableAutoScaling" onChange={handleAutoScaling} />
                            <FormLabel htmlFor="enable-autoscaling" mb="0" ml={7}>
                                Enable autoscaling
                            </FormLabel>
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <Switch id="terminate-after" />
                            <FormLabel htmlFor="terminate-after" mb="0" ml={7}>
                                Terminate after
                            </FormLabel>
                            <Input type="text" id="max_inactivity_min" name="max_inactivity_min" value={formik.values.max_inactivity_min} onChange={formik.handleChange} />
                            <FormLabel mb="0" ml={8}>
                                minutes of inactivity
                            </FormLabel>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter height="var(--chakra-space-75)" borderTop="1px solid #EAEAEA" padding={'20'}>
                        <Button colorScheme="blue" type="button" onClick={cancel} fontSize={16} variant="outline" pt={'10'} pb={'10'} pl={'17'} pr={'17'}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" type="submit" fontSize={16} ml={15} pt={'10'} pb={'10'} pl={'17'} pr={'17'}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    );
};

export default ComputeModal;
