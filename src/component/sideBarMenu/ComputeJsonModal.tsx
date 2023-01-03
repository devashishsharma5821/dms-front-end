import React, { useState, useEffect } from 'react';
import { useApolloClient, DocumentNode } from '@apollo/client';
import { Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useToast } from '@chakra-ui/react';
import { dmsCreateComputeOnEnableAutoscaling, dmsCreateComputeOffEnableAutoscaling, GET_DB_SETTINGS, getComputeListData, wsconnect } from '../../query/index';
import { dmsCreateComputeResponse } from '../../models/dmsCreateComputeResponse';
import { COMPUTE_MODAL_PROPS, dbSettingstype } from '../../models/types';
import { ComputeDetail, ComputeDetailListResponse } from '../../models/computeDetails';
import useAppStore from '../../store';
import jsonData from '../jsonSchemaBuilder/jsonData.json';
import Element from '../jsonSchemaBuilder/Element';
import { auto } from '@popperjs/core';
import { FormContext } from '../jsonSchemaBuilder/FormContext';
import '../../styles/FormBuilderClasses.scss';
import FormBuilder from '../jsonSchemaFormBuilder/FormBuilder';
import formSchema from './formSchema.json';

const ComputeJsonModal = (props: COMPUTE_MODAL_PROPS) => {
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
