import React, { useEffect, useState } from 'react';
import { useApolloClient, DocumentNode, useQuery } from '@apollo/client';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useToast } from '@chakra-ui/react';
import { GET_DB_SETTINGS } from '../../query/index';
import { COMPUTE_MODAL_PROPS } from '../../models/types';
import '../../styles/FormBuilderClasses.scss';
import FormBuilder from '../jsonSchemaFormBuilder/FormBuilder';
import formSchema from '../jsonSchemaFormBuilder/computeFormSchema.json';
import { dmsCreateComputeOffEnableAutoscaling, dmsCreateComputeOnEnableAutoscaling, getComputeListData } from '../../query';
import { dmsCreateComputeResponse } from '../../models/dmsCreateComputeResponse';
import { ComputeDetail, ComputeDetailListResponse, createCompute, DbSettingsDetail, GetDbSettingsType, CreateComputeSubmitHandlerValues } from '../../models/computeDetails';
import useAppStore from '../../store';
import { useNavigate } from 'react-router';

const ComputeJsonModal = (props: COMPUTE_MODAL_PROPS) => {
    const client = useApolloClient();
    const toast = useToast();
    const navigate = useNavigate();
    const [updateDmsComputeData, DmsComputeData] = useAppStore((state: any) => [state.updateDmsComputeData, state.DmsComputeData]);
    const [isComputeCreated, setIsComputeCreated] = useState<boolean>(false);
    useEffect(() => {
        client
            .query<GetDbSettingsType<DbSettingsDetail>>({
                query: GET_DB_SETTINGS
            })
            .then((response) => {
                formSchema.worker_type_id.options = response.data.dmsDatabricksSettings.node_types;
            })
            .catch((err) => {
                console.log('catch', err);
            });
    }, []);

    useEffect(() => {
        if (isComputeCreated) {
            try {
                console.log('isComputeCreated', isComputeCreated);
                const { GET_COMPUTELIST } = getComputeListData();

                // console.log('loading', loading, error, data);
                client
                    .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                        query: GET_COMPUTELIST
                    })
                    .then((response) => {
                        let computedata = [...response.data.dmsComputes];
                        updateDmsComputeData(computedata);
                        props.onClose();
                        setIsComputeCreated(false);
                    })
                    .catch((err) => console.log(err));
            } catch (err) {
                console.log('Error in Get computes', err);
            }
        }
    }, [isComputeCreated]);

    const handleSubmitCompute = (values: CreateComputeSubmitHandlerValues) => {
        console.log('inside handle submit', values);
        let mutation: DocumentNode | null = null;
        if (!values.enable_autoscaling) {
            mutation = dmsCreateComputeOffEnableAutoscaling(values);
        } else {
            mutation = dmsCreateComputeOnEnableAutoscaling(values);
        }

        client
            .mutate<dmsCreateComputeResponse<createCompute>>({
                mutation: mutation
            })
            .then((response) => {
                console.log('this is response', response);
                toast({
                    title: `Compute created successfully`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                setIsComputeCreated(true);
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
    };

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent width={630} maxWidth={630} color="#171717">
                <ModalHeader height="var(--chakra-space-60)" fontSize={16} borderBottom="1px solid #EAEAEA" fontWeight="700" flex={'none'} padding={20}>
                    Create Compute
                </ModalHeader>
                <ModalCloseButton mt={10} />
                <ModalBody padding={20}>
                    <FormBuilder formSchema={formSchema} onClose={props.onClose} onSubmit={handleSubmitCompute} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ComputeJsonModal;
