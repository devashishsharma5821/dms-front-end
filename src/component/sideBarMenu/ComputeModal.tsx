import React, { useState, useEffect } from 'react';
import { useApolloClient, DocumentNode } from '@apollo/client';
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
    FormErrorMessage,
    useToast
} from '@chakra-ui/react';
import BlackbottomedTriangleIcon from '../../assets/icons/BlackbottomedTriangleIcon';
import InfoIcon from '../../assets/icons/InfoIcon';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { dmsCreateComputeOnEnableAutoscaling, dmsCreateComputeOffEnableAutoscaling, GET_DB_SETTINGS, getComputeListData, wsconnect } from '../../query/index';
import { dmsCreateComputeResponse } from '../../models/dmsCreateComputeResponse';
import { COMPUTE_MODAL_PROPS, dbSettingstype } from '../../models/types';
import { ComputeDetail, ComputeDetailListResponse } from '../../models/computeDetails';
import useAppStore from '../../store';

const ComputeModal = (props: COMPUTE_MODAL_PROPS) => {
    const [updateDmsComputeData] = useAppStore((state: any) => [state.updateDmsComputeData]);
    const [dbSettingsData, setDbSettingsData] = useState<dbSettingstype[]>();
    const [rowData, setRowData] = useState<ComputeDetail[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const client = useApolloClient();
    const toast = useToast();
    useEffect(() => {
        wsconnect((e: any) => {
            console.log('Inside calback', e);
        });
    }, []);
    // useEffect(() => {
    //     client
    //         .query<any>({
    //             query: GET_DB_SETTINGS
    //         })
    //         .then((response) => {
    //             setDbSettingsData(response.data.dmsDatabricksSettings.node_types);
    //         })
    //         .catch((err) => {
    //             console.log('catch', err);
    //         });
    // }, []);

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
            max_inactivity_min: 0,
            terminate_after: false
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            setError('');
            let mutation: DocumentNode | null = null;
            if (!formik?.values?.enableAutoScaling) {
                mutation = dmsCreateComputeOffEnableAutoscaling(values);
            } else {
                mutation = dmsCreateComputeOnEnableAutoscaling(values);
            }

            interface createCompute {
                dmsCreateCompute: string;
            }
            client
                .mutate<dmsCreateComputeResponse<createCompute>>({
                    mutation: mutation
                })
                .then((response) => {
                    setIsLoading(false);
                    toast({
                        title: `Compute created successfully`,
                        status: 'success',
                        isClosable: true,
                        duration: 5000,
                        position: 'top-right'
                    });
                    const { GET_COMPUTELIST } = getComputeListData();
                    client
                        .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                            query: GET_COMPUTELIST
                        })
                        .then((response) => {
                            let computedata = [...response.data.dmsComputes];
                            updateDmsComputeData(computedata);
                            setRowData(computedata);
                            //updateTransformersData(transformerdata)
                        })
                        .catch((err) => console.error(err));
                    formik.handleReset();
                    props.onClose();
                })
                .catch((err) => {
                    toast({
                        title: `${err}`,
                        status: 'error',
                        isClosable: true,
                        duration: 5000,
                        position: 'top-right'
                    });
                });
        }
    });

    const handleAutoScaling = (event: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('enableAutoScaling', event.target.checked);
    };

    const handleSpotInstances = (event: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('spot_instances', event.target.checked);
    };

    const handleTerminateAfter = (event: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('terminate_after', event.target.checked);
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
                                    {dbSettingsData &&
                                        dbSettingsData.map((item) => {
                                            return <option>{item.node_type_id} </option>;
                                        })}
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
                        <FormControl display="flex" alignItems="center" onChange={formik.handleChange}>
                            <Switch id="terminate-after" onChange={handleTerminateAfter} />
                            <FormLabel htmlFor="terminate-after" mb="0" ml={7}>
                                Terminate after
                            </FormLabel>
                            <Input
                                type="text"
                                id="max_inactivity_min"
                                disabled={!formik.values.terminate_after}
                                name="max_inactivity_min"
                                value={formik.values.max_inactivity_min}
                                onChange={formik.handleChange}
                            />
                            <FormLabel mb="0" ml={8}>
                                minutes of inactivity
                            </FormLabel>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter height="var(--chakra-space-75)" borderTop="1px solid #EAEAEA" padding={'20'}>
                        <Button colorScheme="blue" type="button" onClick={props.onClose} fontSize={16} variant="outline" pt={'10'} pb={'10'} pl={'17'} pr={'17'}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" type="submit" disabled={isLoading ? true : false} fontSize={16} ml={15} pt={'10'} pb={'10'} pl={'17'} pr={'17'}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    );
};

export default ComputeModal;
