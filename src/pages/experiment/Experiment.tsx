import React, { useState, useEffect, useRef } from 'react';
import { wsconnect } from '../../query';
import './experiment.scss';
import { dia, g, linkTools, shapes, ui } from '@antuit/rappid-v1';
import {
    Button,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Box,
    IconButton,
    Flex,
    useColorModeValue,
    useDisclosure,
    Drawer
} from '@chakra-ui/react';
import Form from '@rjsf/chakra-ui';
import validator from '@rjsf/validator-ajv6';
import type { JSONSchema7 } from 'json-schema';
import TransformerMenu from '../../component/Transformers/TransformerMenu';
import DoubleAngleRightIcon from '../../assets/icons/DoubleAngleRightIcon';
import Toolbar from '../../component/toolbar/Toolbar';
import useAppStore from '../../store';

const ExperimentsPage = () => {
    const [message, setMessage] = useState('Status');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {i18n,  config } = useAppStore();
    const canvas: any = useRef(null);
    const [currentLang, setCurrentLang] = useState('en_US');
    const [translationToUse, setTranslationToUse] = useState(i18n.translations);
    const btnRef: any = React.useRef();
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const bgColor = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    const themebg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
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
    const test = 100;
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

    useEffect(() => {
        wsconnect(setMessage);
    }, []);
    const toggleLeftMenu = () => {
        setLeftMenuOpen(!leftMenuOpen);
    };
    const changeTranslation = () => {

        let language = (currentLang === 'en_US') ?  'en_SP' :  'en_US';
       setCurrentLang(language);
    };
    useEffect(() => {
        setTranslationToUse(i18n.translations);
    }, [currentLang]);

    useEffect(() => {
        const graph = new dia.Graph({}, { cellNamespace: shapes });
        const paper = new dia.Paper({
            model: graph,
            background: {
                color: '#F8F9FA',
            },
            gridSize: 1,
            interactive: { linkMove: false },
            frozen: true,
            async: true,
            sorting: dia.Paper.sorting.APPROX,
            cellViewNamespace: shapes,
            defaultLink: new dia.Link({
                attrs: { ".marker-target": { d: "M 10 0 L 0 5 L 10 10 z" } }
            }),
            validateConnection: function(
                cellViewS,
                magnetS,
                cellViewT,
                magnetT,
                end,
                linkView
            ) {
                // Prevent loop linking
                return magnetS !== magnetT;
            },
            // Enable link snapping within 75px lookup radius
            snapLinks: { radius: 150 }
        });

        const scroller = new ui.PaperScroller({
            paper,
            autoResizePaper: true,
            scrollWhileDragging: true,
            cursor: 'grab'
        });

        canvas.current.appendChild(scroller.el);
        scroller.render().center();
        const m1 = new shapes.devs.Model({
            position: { x: 50, y: 50 },
            size: { width: 90, height: 90 },
            inPorts: ["in1", "in2"],
            outPorts: ["out"],
            ports: {
                groups: {
                    in: {
                        attrs: {
                            ".port-body": {
                                fill: "#16A085",
                                magnet: "passive"
                            }
                        }
                    },
                    out: {
                        attrs: {
                            ".port-body": {
                                fill: "#E74C3C"
                            }
                        }
                    }
                }
            },
            attrs: {
                ".label": { text: "Model", "ref-x": 0.5, "ref-y": 0.2 },
                rect: { fill: "#2ECC71" }
            }
        });
        graph.addCell(m1);

        const m2 = m1.clone();
        m2.translate(300, 0);
        graph.addCell(m2);
        m2.attr(".label/text", "Model 2");
        paper.unfreeze();
        paper.on('blank:pointerdown', scroller.startPanning);
        return () => {
            scroller.remove();
            paper.remove();
        };

    }, []);
    return (
        <>
            <Box width={'100%'}>
                <Box width={'100%'} height={'56px'} bg={themebg}>
                    <Toolbar />
                </Box>
                <Flex>
                    <Box height="100%" width="60px" bg={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')} marginInlineStart="0" float="left" mr={'30'}>
                        <Box textAlign="center">
                            <IconButton
                                aria-label="expand"
                                minWidth="0"
                                border="1px"
                                width="24px"
                                height="24px"
                                borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryLightDarkGrayishBlue')}
                                background={bgColor}
                                _active={{ background: bgColor }}
                                _hover={{ background: bgColor }}
                                icon={<DoubleAngleRightIcon />}
                                mt={-85}
                                onClick={toggleLeftMenu}
                            />
                        </Box>
                        <Box position="absolute" width="150px" transform="rotate(270deg)" left={7} mt={30} textAlign="right">
                            <Box color={useColorModeValue('light.VeryDarkBlue', 'dark.Gray')} fontWeight="600">
                                Transformers
                            </Box>
                        </Box>
                        <TransformerMenu isLeftMenuOpen={leftMenuOpen} toggleLeftMenu={setLeftMenuOpen}></TransformerMenu>
                    </Box>
                    <Box>
                        <div className="canvas" ref={canvas}/>
                        {/*<a>{translationToUse[config['title']]}</a>*/}
                        {/*<br></br>*/}
                        {/*{message}*/}
                        {/*<Button ref={btnRef} variant="solid" bg={useColorModeValue('light.button', 'dark.button')} onClick={onOpen}>*/}
                        {/*    Open*/}
                        {/*</Button>*/}
                        {/*<Button ref={btnRef} variant="solid" bg={useColorModeValue('light.button', 'dark.button')} onClick={changeTranslation}>*/}
                        {/*    Change Translation*/}
                        {/*</Button>*/}
                        {/*<Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} colorScheme={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')}>*/}
                        {/*    <DrawerOverlay />*/}
                        {/*    <DrawerContent mt="44px" bg={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')}>*/}
                        {/*        <DrawerCloseButton />*/}
                        {/*        <DrawerHeader>Example React Schema Form</DrawerHeader>*/}

                        {/*        <DrawerBody>*/}
                        {/*            <Form schema={schema} formData={formData} uiSchema={layout} validator={validator} liveValidate />*/}
                        {/*        </DrawerBody>*/}

                        {/*        <DrawerFooter>*/}
                        {/*            <Button variant="outline" mr={3} onClick={onClose}>*/}
                        {/*                Cancel*/}
                        {/*            </Button>*/}
                        {/*            <Button colorScheme="blue">Save</Button>*/}
                        {/*        </DrawerFooter>*/}
                        {/*    </DrawerContent>*/}
                        {/*</Drawer>*/}
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default ExperimentsPage;
