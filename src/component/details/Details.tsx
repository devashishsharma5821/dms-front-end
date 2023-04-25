import React, { useRef } from 'react';
import './details.scss';
import { Button, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useColorModeValue, Drawer } from '@chakra-ui/react';
import Form from '@rjsf/chakra-ui';
import validator from '@rjsf/validator-ajv6';
import type { JSONSchema7 } from 'json-schema';
import useAppStore from '../../store';
import { DetailsAppStoreState, DetailsPropsType } from '../../models/transformer';
import { setStageForm, setStageHasRun, setStageStatus, updateModuleConfigData } from '../../zustandActions/transformersActions';
import { cloneDeep } from 'lodash';
import client from '../../apollo-client';
import { dmsEditExperiment } from '../../query';
import { getToastOptions } from '../../models/toastMessages';
import { createStandaloneToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { BusHelper } from '../../helpers/BusHelper';
import { v4 } from 'uuid';
import { submitMessage } from '../../zustandActions/socketActions';
import { StageStatus } from '../../models/types';
const { toast } = createStandaloneToast();

const Details = (props: DetailsPropsType) => {
    const [TransformersData, ExperimentData, moduleConfigData, experimentToSave, graph, stages, UserConfig] = useAppStore((state: DetailsAppStoreState) => [
        state.TransformersData,
        state.ExperimentData,
        state.moduleConfigData,
        state.experimentToSave,
        state.graph,
        state.stages,
        state.UserConfig
    ]);
    const opid = v4();

    const { projectId, experimentId } = useParams();

    const timer = useRef<ReturnType<typeof setTimeout>>();

    const transformer = TransformersData?.find((transformer: any) => transformer?.id === props?.selectedStageId);

    console.log('lets check ExperimentData ===>', ExperimentData, 'TransformersData ===>', TransformersData, 'transformer  ===>', transformer, 'moduleConfigData ===>', moduleConfigData);

    const [schema] = React.useState<JSONSchema7>({
        title: 'Widgets',
        type: 'object',
        properties: {
            stringFormats: {
                type: 'object',
                title: 'String formats',
                properties: {
                    email: {
                        type: 'string',
                        format: 'email'
                    },
                    uri: {
                        type: 'string',
                        format: 'uri'
                    }
                }
            },
            boolean: {
                type: 'object',
                title: 'Boolean field',
                properties: {
                    default: {
                        type: 'boolean',
                        title: 'checkbox (default)',
                        description: 'This is the checkbox-description',
                        enum: [true, false]
                    },
                    radio: {
                        type: 'boolean',
                        title: 'radio buttons',
                        description: 'This is the radio-description',
                        enum: [true, false]
                    },
                    select: {
                        type: 'boolean',
                        title: 'select box',
                        description: 'This is the select-description',
                        enum: [true, false]
                    }
                }
            },
            string: {
                type: 'object',
                title: 'String field',
                properties: {
                    default: {
                        type: 'string',
                        title: 'text input (default)'
                    },
                    textarea: {
                        type: 'string',
                        title: 'textarea'
                    },
                    placeholder: {
                        type: 'string'
                    },
                    color: {
                        type: 'string',
                        title: 'color picker',
                        default: '#151ce6'
                    }
                }
            },
            secret: {
                type: 'string',
                default: "I'm a hidden string."
            },
            disabled: {
                type: 'string',
                title: 'A disabled field',
                default: 'I am disabled.'
            },
            readonly: {
                type: 'string',
                title: 'A readonly field',
                default: 'I am read-only.'
            },
            readonly2: {
                type: 'string',
                title: 'Another readonly field',
                default: 'I am also read-only.',
                readOnly: true
            },
            widgetOptions: {
                title: 'Custom widget with options',
                type: 'string',
                default: 'I am yellow'
            },
            selectWidgetOptions: {
                title: 'Custom select widget with options',
                type: 'string',
                enum: ['fooasdfasdfasdfasdfasdf', 'barasdfasdfasdfasdfasdfasdf']
            },
            selectWidgetOptions2: {
                title: 'Custom select widget with options, overriding the enum titles.',
                type: 'string',
                oneOf: [
                    {
                        const: 'foo',
                        title: 'Foo'
                    },
                    {
                        const: 'bar',
                        title: 'Bar'
                    }
                ]
            }
        }
    });

    const formData = {
        stringFormats: {
            email: 'chuck@norris.net',
            uri: 'http://chucknorris.com/'
        },
        boolean: {
            default: true,
            radio: true,
            select: true
        },
        string: {
            color: '#151ce6',
            default: 'Hello...',
            textarea: '... World'
        },
        secret: "I'm a hidden string.",
        disabled: 'I am disabled.',
        readonly: 'I am read-only.',
        readonly2: 'I am also read-only.',
        widgetOptions: 'I am yellow'
    };

    const layout = {
        boolean: {
            radio: {
                'ui:widget': 'radio'
            },
            select: {
                'ui:widget': 'select'
            }
        },
        string: {
            textarea: {
                'ui:widget': 'textarea',
                'ui:options': {
                    rows: 5
                }
            },
            placeholder: {
                'ui:placeholder': 'This is a placeholder'
            },
            color: {
                'ui:widget': 'color'
            }
        },
        secret: {
            'ui:widget': 'hidden'
        },
        disabled: {
            'ui:disabled': true
        },
        readonly: {
            'ui:readonly': true
        },
        widgetOptions: {
            'ui:options': {
                backgroundColor: 'yellow',
                width: '300px'
            }
        },
        selectWidgetOptions: {
            'ui:options': {
                backgroundColor: 'pink'
            }
        }
    };

    // const onCloseEventHandler = () => {
    //     updateSelectedStageId(null);
    // };

    // if (formData && Object.keys(formData).length > 0 && currentSelectedStage && graph && currentStages && props.userId && props.experimentId) {
    //     let msg = BusHelper.GetInferOutputRunRequestMessage(
    //         {
    //             experimentId: parseInt(props.experimentId),
    //             userId: props.userId,
    //             stages: BusHelper.getInferRunStages(currentSelectedStage, graph, currentStages, formData),
    //             stageId: currentSelectedStage.id,
    //             opId: uuidv4()
    //         },
    //         true
    //     );
    //     dispatch(submitMessage({ content: msg }));
    //     dispatch(setStageStatus({ stageId: currentSelectedStage.id, status: StageStatus.Pending }));
    // }

    const runInference = (formData: any) => {
        if (props?.selectedStageId) {
            console.log('lets check selectedCellId ===>', props?.selectedCellId);
            const currentSelectedStage = stages.find((stage: any) => stage.id === props?.selectedCellId);
            console.log('lets check currentSelectedStage after finding ===>', currentSelectedStage);
            setStageHasRun({ stageId: currentSelectedStage.id, hasRun: false });
            setStageForm({
                stageId: currentSelectedStage.id,
                currentForm: { formData: formData }
            });
            console.log(
                'lets check everything for BusHelper ==>',
                'formData ===>',
                formData,
                'currentSelectedStage ===>',
                currentSelectedStage,
                'graph ===>',
                graph,
                'currentStages ===>',
                stages,
                'userId ===>',
                UserConfig.userConfiguration.user.userId,
                'experimentId ===>',
                experimentId
            );

            if (formData && Object.keys(formData).length > 0 && currentSelectedStage.id && graph && stages && experimentId && UserConfig.userConfiguration.user.userId) {
                console.log('lets check going inside that if check or not');
                if (projectId) {
                    let msg = BusHelper.GetInferOutputRunRequestMessage(
                        {
                            experimentId: parseInt(experimentId),
                            project_id: parseInt(projectId),
                            userId: '433',
                            stages: BusHelper.getInferRunStages(currentSelectedStage, graph, stages, formData),
                            stageId: props?.selectedCellId,
                            opId: opid
                        },
                        true
                    );
                    submitMessage([{ content: msg }]);
                    console.log('lets check msg after BusHelper ===>', msg);
                    setStageStatus({ stageId: currentSelectedStage.id, status: StageStatus.Pending });
                }
            }
        }
    };

    const onSubmitHandler = async (e: any) => {
        console.log('lets check event data ===>', e);
        runInference(e.formData);
    };

    const handleChange = (e: any) => {
        console.log('lets check formData in handleChange ===>', JSON.stringify(e.formData));
        let stagesWithConfig = JSON.parse(experimentToSave.stages);
        for (let key in stagesWithConfig.stages) {
            if (stagesWithConfig.stages[key].name === e.schema.title) {
                stagesWithConfig.stages[key].module_conf = JSON.stringify(e.formData);
            }
        }
        console.log('lets check stagesWithConfig ===>', stagesWithConfig);
        experimentToSave.stages = JSON.stringify(stagesWithConfig);

        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            console.log('lets check the experimentToSave inside handleChange ===>', JSON.parse(experimentToSave.stages));
            client
                .mutate<any>({
                    mutation: dmsEditExperiment(experimentToSave)
                })
                .then((response) => console.log('lets check response ===>', response))
                .catch((error) => toast(getToastOptions(`${error.message}`, 'error')));
        }, 1000);
    };

    return (
        <>
            <Drawer isOpen={props?.isOpen} placement="right" onClose={props?.onClose} colorScheme={useColorModeValue('light.whiteText', 'dark.veryDarkGrayishBlue')}>
                <DrawerOverlay />
                <DrawerContent mt="64px" bg={useColorModeValue('default.whiteText', 'dark.veryDarkGrayishBlue')}>
                    <DrawerCloseButton />
                    <DrawerBody mt="30px">
                        <Form schema={JSON.parse(transformer?.schema?.jsonSchema)} onChange={handleChange} onSubmit={onSubmitHandler} omitExtraData={true} validator={validator} />
                    </DrawerBody>
                    {/* 
                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={props.onCloseEventHandler}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue">Save</Button>
                    </DrawerFooter> */}
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Details;
