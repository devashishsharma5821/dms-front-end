import React, { useState, useEffect, useContext } from 'react';
import { useApolloClient, DocumentNode } from '@apollo/client';
import { Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useToast } from '@chakra-ui/react';
import { dmsCreateComputeOnEnableAutoscaling, dmsCreateComputeOffEnableAutoscaling, GET_DB_SETTINGS, getComputeListData, wsconnect } from '../../query/index';
import { COMPUTE_MODAL_PROPS, dbSettingstype } from '../../models/types';
import useAppStore from '../../store';
import '../../styles/FormBuilderClasses.scss';
import FormBuilder from '../jsonSchemaFormBuilder/FormBuilder';
import formSchema from './formSchema.json';
import { ComputeContext } from '../../context/computeContext';

const ComputeJsonModal = (props: COMPUTE_MODAL_PROPS) => {
    const { formData, updateFormData } = useContext(ComputeContext);
    console.log('formDta', formData);
    const [updateDmsComputeData] = useAppStore((state: any) => [state.updateDmsComputeData]);
    const client = useApolloClient();

    useEffect(() => {
        wsconnect((e: any) => {
            console.log('Inside calback', e);
        });
    }, []);

    useEffect(() => {
        client
            .query<any>({
                query: GET_DB_SETTINGS
            })
            .then((response) => {
                formSchema.worker_type_id.options = response.data.dmsDatabricksSettings.node_types;
            })
            .catch((err) => {
                console.log('catch', err);
            });
    }, []);

    // We are currently trying below approach

    // if (props.isEdit === true) {
    //     formSchema.compute_name.value = formData.name;
    //     formSchema.worker_type_id.value = formData.worker_type_id;
    //     formSchema.workers.value = formData.num_workers;
    // } else {
    //     formSchema.compute_name.value = '';
    //     formSchema.worker_type_id.value = '';
    // }
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent width={630} maxWidth={630} color="#171717">
                <ModalHeader height="var(--chakra-space-60)" fontSize={16} borderBottom="1px solid #EAEAEA" fontWeight="700" flex={'none'} padding={20}>
                    Create Compute
                </ModalHeader>
                <ModalCloseButton mt={10} />
                <ModalBody padding={20}>
                    <FormBuilder formSchema={formSchema} onClose={props.onClose} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ComputeJsonModal;
