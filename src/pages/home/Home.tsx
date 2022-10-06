import React, { useState, useEffect,  } from 'react';
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
} from '@chakra-ui/react'
import Form from "@rjsf/chakra-ui";
import validator from "@rjsf/validator-ajv6";
import type { JSONSchema7 }            from 'json-schema';

function UserConfiguration() {
    const { GET_USER_CONFIGURATION } = getUserConfig();
    const { loading, error, data } = useQuery(GET_USER_CONFIGURATION);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : `${error.toString()}`</p>;
    if (data?.userConfiguration?.user?.espUserToken) {
        localStorage['espUserToken'] = data.userConfiguration.user.espUserToken ?? '';
    }

    return <span></span>;
}

const HomePage = () => {
    const [message, setMessage] = useState('Status');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef: any = React.useRef();
    const [ schema, setSchema ]                 = React.useState<JSONSchema7>({
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
                    "uri": {
                        "type": "string",
                        "format": "uri"
                    }
                }
            },
            "boolean": {
                "type": "object",
                "title": "Boolean field",
                "properties": {
                    "default": {
                        "type": "boolean",
                        "title": "checkbox (default)",
                        "description": "This is the checkbox-description",
                        "enum": [
                            true,
                            false
                        ]
                    },
                    "radio": {
                        "type": "boolean",
                        "title": "radio buttons",
                        "description": "This is the radio-description",
                        "enum": [
                            true,
                            false
                        ]
                    },
                    "select": {
                        "type": "boolean",
                        "title": "select box",
                        "description": "This is the select-description",
                        "enum": [
                            true,
                            false
                        ]
                    }
                }
            },
            "string": {
                "type": "object",
                "title": "String field",
                "properties": {
                    "default": {
                        "type": "string",
                        "title": "text input (default)"
                    },
                    "textarea": {
                        "type": "string",
                        "title": "textarea"
                    },
                    "placeholder": {
                        "type": "string"
                    },
                    "color": {
                        "type": "string",
                        "title": "color picker",
                        "default": "#151ce6"
                    }
                }
            },
            "secret": {
                "type": "string",
                "default": "I'm a hidden string."
            },
            "disabled": {
                "type": "string",
                "title": "A disabled field",
                "default": "I am disabled."
            },
            "readonly": {
                "type": "string",
                "title": "A readonly field",
                "default": "I am read-only."
            },
            "readonly2": {
                "type": "string",
                "title": "Another readonly field",
                "default": "I am also read-only.",
                "readOnly": true
            },
            "widgetOptions": {
                "title": "Custom widget with options",
                "type": "string",
                "default": "I am yellow"
            },
            "selectWidgetOptions": {
                "title": "Custom select widget with options",
                "type": "string",
                "enum": [
                    "fooasdfasdfasdfasdfasdf",
                    "barasdfasdfasdfasdfasdfasdf"
                ]
            },
            "selectWidgetOptions2": {
                "title": "Custom select widget with options, overriding the enum titles.",
                "type": "string",
                "oneOf": [
                    {
                        "const": "foo",
                        "title": "Foo"
                    },
                    {
                        "const": "bar",
                        "title": "Bar"
                    }
                ]
            }
        }
    });

    const formData = {
        "stringFormats": {
            "email": "chuck@norris.net",
            "uri": "http://chucknorris.com/"
        },
        "boolean": {
            "default": true,
            "radio": true,
            "select": true
        },
        "string": {
            "color": "#151ce6",
            "default": "Hello...",
            "textarea": "... World"
        },
        "secret": "I'm a hidden string.",
        "disabled": "I am disabled.",
        "readonly": "I am read-only.",
        "readonly2": "I am also read-only.",
        "widgetOptions": "I am yellow"
    };

    const layout = {
        "boolean": {
            "radio": {
                "ui:widget": "radio"
            },
            "select": {
                "ui:widget": "select",
            }
        },
        "string": {
            "textarea": {
                "ui:widget": "textarea",
                "ui:options": {
                    "rows": 5
                }
            },
            "placeholder": {
                "ui:placeholder": "This is a placeholder"
            },
            "color": {
                "ui:widget": "color"
            }
        },
        "secret": {
            "ui:widget": "hidden"
        },
        "disabled": {
            "ui:disabled": true
        },
        "readonly": {
            "ui:readonly": true
        },
        "widgetOptions": {
            "ui:options": {
                "backgroundColor": "yellow",
                "width": '300px'
            }
        },
        "selectWidgetOptions": {
            "ui:options": {
                "backgroundColor": "pink"
            }
        }
    };

    useEffect(() => {
        wsconnect(setMessage);
    }, []);
    return (
        <>
            <div className="wrap">
            <div className="welcome">Welcome to Home page..</div>
            <br></br>
            <UserConfiguration />
            {message}
            <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
                Open
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Create your account</DrawerHeader>

                    <DrawerBody>
                        ... Hello
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Form schema={schema} formData={formData} uiSchema={layout}  validator={validator} liveValidate />
            </div>
        </>
    );
};

export default HomePage;
