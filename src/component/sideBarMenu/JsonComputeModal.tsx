import React from 'react';
import { Button, ModalBody, Box, ModalFooter, ModalHeader, ModalOverlay, ModalContent, ModalCloseButton, useColorModeValue, Drawer, Modal } from '@chakra-ui/react';
import Form from '@rjsf/chakra-ui';
import validator from '@rjsf/validator-ajv6';
import type { JSONSchema7 } from 'json-schema';
import { useApolloClient, gql, DocumentNode } from '@apollo/client';
import { dmsCreateComputeOffEnableAutoscalingJson, dmsCreateComputeOnEnableAutoscalingJson } from '../../query';
import { dmsCreateComputeResponse } from '../../models/dmsCreateComputeResponse';
import './SideBarMenu.scss';

const JsonComputeModal = (props: any) => {
    const client = useApolloClient();
    const [schema] = React.useState<JSONSchema7>({
        type: 'object',
        required: ['compute_name'],
        properties: {
            compute_name: {
                title: 'Compute Name',
                type: 'string',
                format: 'text'
            },
            worker_type_id: {
                type: 'string',
                title: 'Worker Type',
                enum: ['Standard', 'UnStandard']
            },
            spot_instances: {
                title: 'Spot Instances',
                type: 'boolean',
                enum: [true, false]
            },
            enableAutoScalingConditional: {
                $ref: '#/definitions/enable_autoscaling'
            },
            terminateAfterConditional: {
                $ref: '#/definitions/terminate_after'
            }
        },
        definitions: {
            enable_autoscaling: {
                title: '',
                type: 'object',
                properties: {
                    enable_autoscaling: {
                        title: 'Enable autoscaling',
                        type: 'boolean',
                        enum: [true, false],
                        default: false
                    }
                },
                dependencies: {
                    enable_autoscaling: {
                        oneOf: [
                            {
                                properties: {
                                    enable_autoscaling: {
                                        enum: [false]
                                    },

                                    workers: {
                                        title: 'Workers',
                                        type: 'number',
                                        format: 'text',
                                        minimum: 0
                                    }
                                }
                            },
                            {
                                properties: {
                                    enable_autoscaling: {
                                        enum: [true]
                                    },
                                    min_workers: {
                                        title: 'Min Workers',
                                        type: 'number',
                                        format: 'text',
                                        minimum: 0
                                    },
                                    max_workers: {
                                        title: 'Max Workers',
                                        type: 'number',
                                        format: 'text',
                                        minimum: 0
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            terminate_after: {
                title: '',
                type: 'object',
                properties: {
                    terminate_after: {
                        title: 'Terminate After',
                        type: 'boolean',
                        enum: [true, false]
                    }
                },
                dependencies: {
                    terminate_after: {
                        oneOf: [
                            {
                                properties: {
                                    terminate_after: {
                                        enum: [false]
                                    }
                                }
                            },
                            {
                                properties: {
                                    terminate_after: {
                                        enum: [true]
                                    },
                                    max_inactivity_min: {
                                        type: 'number',
                                        format: 'text',
                                        title: 'minutes of inactivity'
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    });
    const formData = {
        compute_name: '',
        worker_type_id: '',
        enableAutoScalingConditional: { workers: 0, min_workers: 0, max_workers: 0 },
        spot_instances: true
    };
    const layout = {
        'ui:widget': 'checkboxes',
        'ui:options': {
            inline: true
        },
        compute_name: {
            'ui:placeholder': 'Enter compute name'
        },
        'ui:submitButtonOptions': {
            submitText: 'Save',
            norender: false,
            props: {
                disabled: false,
                className: 'btn btn-info',
                backgroundColor: '#3182CE'
            }
        },
        worker_type_id: {
            'ui:options': {
                chakra: {
                    w: '250px',
                    sx: {
                        display: 'inline-block'
                    }
                }
            }
        },
        enableAutoScalingConditional: {
            'ui:options': {
                chakra: {
                    w: '400px',
                    sx: {
                        display: 'inline-block',
                        border: '3px solid red'
                    }
                }
            },
            workers: {
                'ui:options': {
                    chakra: {
                        w: '100px',
                        sx: {
                            display: 'inline-block'
                        }
                    }
                }
            },
            min_workers: {
                'ui:options': {
                    chakra: {
                        w: '120px',
                        sx: {
                            display: 'inline-block'
                        }
                    }
                }
            },
            max_workers: {
                'ui:options': {
                    chakra: {
                        w: '120px',
                        sx: {
                            display: 'inline-block'
                        }
                    }
                }
            }
        },
        max_inactivity_min: {
            // 'ui:disabled': 'terminate_after' ? true : false
        }
    };

    const onSubmit = ({ formData }: any, e: any) => {
        let mutation: DocumentNode | null = null;
        if (formData.enableAutoScalingConditional.enable_autoscaling) {
            mutation = dmsCreateComputeOnEnableAutoscalingJson(formData);
        } else {
            mutation = dmsCreateComputeOffEnableAutoscalingJson(formData);
        }

        interface createCompute {
            dmsCreateCompute: string;
        }

        client
            .mutate<dmsCreateComputeResponse<createCompute>>({
                mutation: mutation
            })
            .then((response) => {
                console.log('response====>', response);
            })
            .catch((err) => console.error(err));
    };

    return (
        <>
            <Modal isOpen={props.isOpen} onClose={props.onClose} colorScheme={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')}>
                <ModalOverlay />
                <ModalContent mt="104px" p="10px" maxW="540px" bg={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')}>
                    <ModalCloseButton />
                    <ModalHeader>Create Compute</ModalHeader>

                    <ModalBody>
                        <Form schema={schema} formData={formData} uiSchema={layout} validator={validator} onSubmit={onSubmit}>
                            <Box className="main-container">
                                <Button type="button" variant="outline" colorScheme="blue" className="cancel-button" onClick={props.onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="solid" colorScheme="blue">
                                    Save
                                </Button>
                            </Box>
                        </Form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default JsonComputeModal;
