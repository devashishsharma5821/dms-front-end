import React from 'react';
import './details.scss';
import { Button, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useColorModeValue, Drawer } from '@chakra-ui/react';
import Form from '@rjsf/chakra-ui';
import validator from '@rjsf/validator-ajv6';
import type { JSONSchema7 } from 'json-schema';
import useAppStore from '../../store';
import { DetailsAppStoreState, DetailsPropsType } from '../../models/transformer';

const Details = (props: DetailsPropsType) => {
    const [TransformersData, SingleProjectData] = useAppStore((state: DetailsAppStoreState) => [state.TransformersData, state.SingleProjectData]);

    const transformer = TransformersData.find((transformer: any) => transformer?.id === props?.selectedStageId);

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

    let newParseSchemaData;
    if (transformer?.name === 'LoadingSparkDataframe') {
        let newArr: any = [];
        SingleProjectData?.datasources.map((csvData: any) => newArr.push(csvData.name));
        newParseSchemaData = JSON.parse(transformer?.schema?.jsonSchema);
        newParseSchemaData.properties['files'] = {
            type: 'string',
            enum: newArr
        };
        delete newParseSchemaData.properties.input_name;
        newParseSchemaData.required.pop();
        newParseSchemaData.required.push('files');
    }

    const onSubmitHandler = (e: any) => {
        console.log('onSubmitHandler ===>', e);
    };

    return (
        <>
            <Drawer isOpen={props?.isOpen} placement="right" onClose={props?.onClose} colorScheme={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')}>
                <DrawerOverlay />
                <DrawerContent mt="64px" bg={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')}>
                    <DrawerCloseButton />
                    <DrawerBody mt="30px">
                        <Form
                            schema={transformer?.name === 'LoadingSparkDataframe' ? newParseSchemaData : JSON.parse(transformer?.schema?.jsonSchema)}
                            onSubmit={onSubmitHandler}
                            omitExtraData={true}
                            validator={validator}
                        />
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
