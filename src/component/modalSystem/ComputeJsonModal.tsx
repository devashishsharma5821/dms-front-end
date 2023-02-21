import React, { useEffect, useState } from 'react';
import { useApolloClient, DocumentNode } from '@apollo/client';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useToast } from '@chakra-ui/react';
import { dmsRunCompute, GET_DB_SETTINGS } from '../../query/index';
import { COMPUTE_MODAL_PROPS } from '../../models/types';
import '../../styles/FormBuilderClasses.scss';
import FormBuilder from '../jsonSchemaFormBuilder/FormBuilder';
import formSchema from '../jsonSchemaFormBuilder/computeFormSchema.json';
import { dmsCreateComputeOffEnableAutoscaling, dmsCreateComputeOnEnableAutoscaling, dmsEditComputeOffEnableAutoscaling, dmsEditComputeOnEnableAutoscaling } from '../../query';
import { dmsCreateComputeResponse } from '../../models/dmsCreateComputeResponse';
import { createCompute, DbSettingsDetail, GetDbSettingsType, CreateComputeSubmitHandlerValues, agGridClickHandler, ComputeRun, RunComputeDetail } from '../../models/computeDetails';
import { getAndUpdateDmsComputeData } from '../../zustandActions/computeActions';

const ComputeJsonModal = (props: COMPUTE_MODAL_PROPS) => {
    const client = useApolloClient();
    const toast = useToast();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isComputeCreated, setIsComputeCreated] = useState<boolean>(false);
    useEffect(() => {
        client
            .query<GetDbSettingsType<DbSettingsDetail>>({
                query: GET_DB_SETTINGS
            })
            .then((response) => {
                formSchema.worker_type_id.options = response.data.dmsDatabricksSettings.node_types;
                formSchema.driver_type_id.options = response.data.dmsDatabricksSettings.node_types;
            })
            .catch((err) => {
                console.log('catch', err);
            });
    }, []);

    useEffect(() => {
        if (isComputeCreated) {
            try {
                getAndUpdateDmsComputeData();
                props.onClose();
                setIsComputeCreated(false);
            } catch (err) {
                console.log('Error in Get computes', err);
            }
        }
    }, [isComputeCreated]);
    const onPlayClickHandler: agGridClickHandler = (id) => {
        client
            .mutate<ComputeRun<RunComputeDetail>>({
                mutation: dmsRunCompute(id)
            })
            .then(() => {
                getAndUpdateDmsComputeData();
                toast({
                    title: `Compute is starting`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            })
            .catch((err: any) => {
                console.log('error ===>', err);
                toast({
                    title: `${err}`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    };

    const handleSubmitCompute = (values: CreateComputeSubmitHandlerValues) => {
        let mutation: DocumentNode | null = null;
        let createMutation: boolean = false;
        setIsDisabled(true);
        if (props?.isEdit) {
            if (!values.enable_autoscaling) {
                mutation = dmsEditComputeOffEnableAutoscaling(values);
            } else {
                mutation = dmsEditComputeOnEnableAutoscaling(values);
            }
        } else {
            if (!values.enable_autoscaling) {
                mutation = dmsCreateComputeOffEnableAutoscaling(values);
            } else {
                mutation = dmsCreateComputeOnEnableAutoscaling(values);
            }
            createMutation = true;
        }

        client
            .mutate<dmsCreateComputeResponse<createCompute>>({
                mutation: mutation
            })
            .then((response) => {
                createMutation && onPlayClickHandler(response?.data?.dmsCreateCompute);
                setIsDisabled(false);
                toast({
                    title: `Compute ${props?.isEdit ? 'edited' : 'created'} successfully`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                setIsComputeCreated(true);
                getAndUpdateDmsComputeData();
                props.onClose();
            })
            .catch((err) => {
                setIsDisabled(false);
                toast({
                    title: `${err}`,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    };

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent maxWidth={750} color="#171717">
                <ModalHeader height="var(--chakra-space-60)" fontSize={16} borderBottom="1px solid #EAEAEA" fontWeight="700" flex={'none'} padding={20}>
                    {props?.isEdit ? 'Edit Compute' : 'Create Compute'}
                </ModalHeader>
                <ModalCloseButton mt={10} />
                <ModalBody padding={20}>
                    <FormBuilder isDisabled={isDisabled} formSchema={formSchema} onClose={props.onClose} isEdit={props.isEdit} onSubmit={handleSubmitCompute} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ComputeJsonModal;
