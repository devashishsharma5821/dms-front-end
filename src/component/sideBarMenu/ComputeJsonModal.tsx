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

const ComputeJsonModal = (props: COMPUTE_MODAL_PROPS) => {
    const [updateDmsComputeData] = useAppStore((state: any) => [state.updateDmsComputeData]);
    const [dbSettingsData, setDbSettingsData] = useState<dbSettingstype[]>();
    const [rowData, setRowData] = useState<ComputeDetail[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const client = useApolloClient();
    const toast = useToast();
    const [elements, setElements] = useState<any>(jsonData[0]);

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
                setDbSettingsData(response.data.dmsDatabricksSettings.node_types);
                if (elements?.fields[1]?.field_id === 'Worker Type') {
                    const dbSettingsDataNodeTypeId = response.data.dmsDatabricksSettings.node_types.map((node: any) => node.node_type_id);
                    elements.fields[1].field_options = dbSettingsDataNodeTypeId;
                    setElements(elements);
                }
            })
            .catch((err) => {
                console.log('catch', err);
            });
    }, []);

    useEffect(() => {
        setElements(jsonData[0]);
        if (elements?.fields[6]?.field_id === 'Enable autoscaling') {
            if (elements?.fields[6]?.field_value === false) {
                elements.fields[2].field_show = true;
                elements.fields[3].field_show = false;
                elements.fields[4].field_show = false;
                elements.fields[3].field_className = 'minmaxWorkerIsEnableAutoscaling';
                elements.fields[4].field_className = 'minmaxWorkerIsEnableAutoscaling';
            } else {
                elements.fields[2].field_show = false;
                elements.fields[3].field_show = true;
                elements.fields[4].field_show = true;
                elements.fields[3].field_className = 'minWorkers';
                elements.fields[4].field_className = 'maxWorkers';
            }
        }
        if (elements?.fields[7]?.field_id === 'Terminate after') {
            if (elements?.fields[7]?.field_value === false) {
                elements.fields[8].field_disabled = true;
            } else {
                elements.fields[8].field_disabled = false;
            }
        }
    }, [elements]);

    const { fields, page_label } = elements ?? {};

    const handleChange: any = (id: any, event: any) => {
        const newElements = { ...elements };
        newElements.fields.forEach((field: any) => {
            const { field_type, field_id } = field;
            if (id === field_id) {
                switch (field_type) {
                    case 'checkbox':
                        field['field_value'] = event.target.checked;
                        break;

                    default:
                        field['field_value'] = event.target.value;
                        break;
                }
            }
            setElements(newElements);
        });
    };

    const formSubmitHandler = (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const createComputeData = {
            compute_name: elements.fields[0].field_value,
            worker_type_id: elements.fields[1].field_value,
            workers: elements.fields[2].field_value,
            min_workers: elements.fields[3].field_value,
            max_workers: elements.fields[4].field_value,
            spot_instances: elements.fields[5].field_value,
            enable_autoscaling: elements.fields[6].field_value,
            terminate_after: elements.fields[7].field_value,
            max_inactivity_min: elements.fields[8].field_value
        };
        setError('');
        let mutation: DocumentNode | null = null;
        if (!createComputeData.enable_autoscaling) {
            mutation = dmsCreateComputeOffEnableAutoscaling(createComputeData);
        } else {
            mutation = dmsCreateComputeOnEnableAutoscaling(createComputeData);
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
    };

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent width={630} maxWidth={630} height={415} color="#171717">
                <ModalHeader height="var(--chakra-space-60)" fontSize={16} borderBottom="1px solid #EAEAEA" fontWeight="700" flex={'none'} padding={20}>
                    Create Compute
                </ModalHeader>
                <ModalCloseButton mt={10} />
                <ModalBody padding={20}>
                    <FormContext.Provider value={{ handleChange }}>
                        <div style={{ margin: auto }}>
                            <div className="mainContainer">
                                <form onSubmit={formSubmitHandler}>
                                    {fields ? fields.map((field: any, i: any) => <Element key={i} field={field} />) : null}
                                    <Box className="main-container">
                                        <Button type="button" variant="outline" colorScheme="blue" className="cancel-button" onClick={props.onClose}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isLoading ? true : false} variant="solid" colorScheme="blue">
                                            Create
                                        </Button>
                                    </Box>
                                </form>
                            </div>
                        </div>
                    </FormContext.Provider>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ComputeJsonModal;
