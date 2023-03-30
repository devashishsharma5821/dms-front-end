import React, { useEffect, useState } from 'react';
import { useApolloClient, DocumentNode } from '@apollo/client';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { COMPUTE_MODAL_PROPS } from '../../models/types';
import '../../styles/FormBuilderClasses.scss';
import FormBuilder from '../jsonSchemaFormBuilder/FormBuilder';
import formSchema from '../jsonSchemaFormBuilder/computeFormSchema.json';
import { dmsCreateComputeOffEnableAutoscaling, dmsCreateComputeOnEnableAutoscaling, dmsEditComputeOffEnableAutoscaling, dmsEditComputeOnEnableAutoscaling } from '../../query';
import { dmsCreateComputeResponse } from '../../models/dmsCreateComputeResponse';
import { createCompute, CreateComputeSubmitHandlerValues } from '../../models/computeDetails';
import { getAndUpdateDmsComputeData, onPlayClickHandler } from '../../zustandActions/computeActions';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store';
import { createStandaloneToast } from '@chakra-ui/react';
import { getToastOptions } from '../../models/toastMessages';
const { toast } = createStandaloneToast();

const ComputeJsonModal = (props: COMPUTE_MODAL_PROPS) => {
    const [dbSettingsData] = useAppStore((state: any) => [state.dbSettingsData]);
    const navigate = useNavigate();
    const client = useApolloClient();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isComputeCreated, setIsComputeCreated] = useState<boolean>(false);
    useEffect(() => {
        formSchema.worker_type_id.options = dbSettingsData;
        formSchema.driver_type_id.options = dbSettingsData;
    }, [dbSettingsData]);

    useEffect(() => {
        if (isComputeCreated) {
            try {
                getAndUpdateDmsComputeData();
                props.onClose();
                setIsComputeCreated(false);
            } catch (err) {}
        }
    }, [isComputeCreated]);

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
            .then(async (response) => {
                if (createMutation) {
                    getAndUpdateDmsComputeData();
                    const rep = await onPlayClickHandler(response?.data?.dmsCreateCompute);
                } else {
                    getAndUpdateDmsComputeData();
                }
                setIsDisabled(false);
                toast(getToastOptions(`Compute ${props?.isEdit ? 'edited' : 'created'} successfully`, 'success'));
                setIsComputeCreated(true);
                props.onClose();
                navigate('/compute');
            })
            .catch((err) => {
                setIsDisabled(false);
                toast(getToastOptions('Something went wrong, please try again later!', 'error'));
                // props.onClose();
            });
    };

    return (
        <Modal closeOnOverlayClick={false} trapFocus={false} lockFocusAcrossFrames={true} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent maxWidth={632} color="#171717">
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
