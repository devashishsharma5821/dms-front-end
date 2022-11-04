import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { getUserConfig, wsconnect } from '../../query';
import './home.scss';
import {
    useDisclosure,
    Drawer,
    Button,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useColorModeValue,
    Box,
    IconButton
} from '@chakra-ui/react';
import Form from '@rjsf/chakra-ui';
import validator from '@rjsf/validator-ajv6';
import type { JSONSchema7 } from 'json-schema';
import TransformerMenu from '../../component/Transformers/TransformerMenu';
import DoubleAngleRightIcon from '../../assets/icons/DoubleAngleRightIcon';
let config = {
    "title": "Demand Modeling Studio",
    "isManage": true,
    "transformerMenu" : [
        {
            "name": "Input Output",
            "order": 1
        },
        {

        }
    ]
};
let i18n = {};
function UserConfiguration() {
    const { GET_USER_CONFIGURATION } = getUserConfig();
    const { loading, error, data } = useQuery(GET_USER_CONFIGURATION);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : `${error.toString()}`</p>;
    if (data?.userConfiguration?.user?.espUserToken) {
        localStorage['espUserToken'] = data.userConfiguration.user.espUserToken ?? '';
    }
    if(data?.userConfiguration?.user?.applications) {
        const dmsApplicationConfiguration = data?.userConfiguration?.user?.applications.filter((app: any) => {
            return app.applicationName === "dms";
        });
        config = dmsApplicationConfiguration[0].configJson;
        i18n = dmsApplicationConfiguration[0].i18n;
        console.log('Config', config);
    }

    return <span></span>;
}

const HomePage = () => {
    const [message, setMessage] = useState('Status');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef: any = React.useRef();
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const bgColor = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');

    const [ schema ] = React.useState<JSONSchema7>({
        "title": "Widgets",
        "type": "object",
        "properties": {
            "stringFormats": {
                "type": "object",
                "title": "String formats",
                "properties": {
                    "email": {
                        "type": "string",
                        "format": "email"
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

    useEffect(() => {
        wsconnect(setMessage);
    }, []);
    const toggleLeftMenu = () => {
        setLeftMenuOpen(!leftMenuOpen);
    }
    return (
        <>
            <Box height="100%" width="60px" bg={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')} marginInlineStart="0" float="left" mr={"30"}>
                <Box textAlign="center">
                    <IconButton aria-label="expand" minWidth="0" border="1px" width="24px" height="24px" borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryLightDarkGrayishBlue')} background={bgColor} _active={{background:bgColor}}  _hover={{background:bgColor}} icon={
                    <DoubleAngleRightIcon/>} mt={17} onClick={toggleLeftMenu} />
                    </Box>
                <Box position="absolute" width="150px" transform="rotate(270deg)" left={7} mt={75} textAlign="right" >
                    <Box fontFamily="Nunito" color={useColorModeValue('light.VeryDarkBlue', 'dark.Gray')} fontWeight="600">Transformers</Box></Box>
            </Box>
            <div className="wrap">
                <a>Welcome To Home Page</a>
                <br></br>
                <UserConfiguration />
                {message}
                <TransformerMenu isLeftMenuOpen={leftMenuOpen} toggleLeftMenu={setLeftMenuOpen}></TransformerMenu>
                <Button ref={btnRef} variant="solid" bg={useColorModeValue('light.button', 'dark.button')} onClick={onOpen}>
                    Open
                </Button>
                <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} colorScheme={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')}>
                    <DrawerOverlay />
                    <DrawerContent mt="44px" bg={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')}>
                        <DrawerCloseButton />
                        <DrawerHeader>Example React Schema Form</DrawerHeader>

                        <DrawerBody>
                            <Form schema={schema} formData={formData} uiSchema={layout} validator={validator} liveValidate />
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant="outline" mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue">Save</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    );
};

export default HomePage;
