import React, { useEffect, useState } from 'react';
import { useApolloClient, DocumentNode } from '@apollo/client';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useToast } from '@chakra-ui/react';
import { GET_DB_SETTINGS } from '../../query/index';
import { COMPUTE_MODAL_PROPS } from '../../models/types';
import '../../styles/FormBuilderClasses.scss';
import FormBuilder from '../jsonSchemaFormBuilder/FormBuilder';
import formSchema from '../jsonSchemaFormBuilder/computeFormSchema.json';
import { dmsCreateComputeOffEnableAutoscaling, dmsCreateComputeOnEnableAutoscaling, dmsEditComputeOffEnableAutoscaling, dmsEditComputeOnEnableAutoscaling, getComputeListData } from '../../query';
import { dmsCreateComputeResponse } from '../../models/dmsCreateComputeResponse';
import { ComputeDetail, ComputeDetailListResponse, createCompute, DbSettingsDetail, GetDbSettingsType, CreateComputeSubmitHandlerValues } from '../../models/computeDetails';
import useAppStore from '../../store';
import { getAndUpdateDmsComputeData } from '../../zustandActions/computeActions';

const ComputeJsonModal = (props: COMPUTE_MODAL_PROPS) => {
    const client = useApolloClient();
    const toast = useToast();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [updateDmsComputeData] = useAppStore((state: any) => [state.updateDmsComputeData]);
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
                // const { GET_COMPUTELIST } = getComputeListData();

                // client
                //     .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                //         query: GET_COMPUTELIST
                //     })
                //     .then((response) => {
                //         let computedata = [...response.data.dmsComputes];
                //         updateDmsComputeData(computedata);
                props.onClose();
                setIsComputeCreated(false);
                // })
                // .catch((err) => console.log(err));
            } catch (err) {
                console.log('Error in Get computes', err);
            }
        }
    }, [isComputeCreated]);

    const handleSubmitCompute = (values: CreateComputeSubmitHandlerValues) => {
        let mutation: DocumentNode | null = null;
        // console.log('Values', values);
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
        }

        client
            .mutate<dmsCreateComputeResponse<createCompute>>({
                mutation: mutation
            })
            .then((response) => {
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
            <ModalContent width={630} maxWidth={630} color="#171717">
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
