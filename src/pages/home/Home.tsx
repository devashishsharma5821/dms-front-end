import React, { useState, useEffect } from 'react';
import { wsconnect } from '../../query';
import './home.scss';
import { Button, Wrap, WrapItem, Tooltip, useToast, useColorModeValue } from '@chakra-ui/react';
import ModalComponent from '../../component/modalSystem/modal';

const HomePage = () => {
    const [message, setMessage] = useState('Status');
    const toast = useToast();
    const statuses = ['success', 'error', 'warning', 'info'];

    // useEffect(() => {
    //     wsconnect(setMessage);
    // }, []);
    return (
        <>
            <div className="wrap">
                <Wrap ml={54} mt={10}>
                    {statuses.map((status: any, i: number) => (
                        <WrapItem key={i}>
                            <Button
                                variant="solid"
                                bg={'light.button'}
                                onClick={() =>
                                    toast({
                                        title: `${status} toast`,
                                        status: status,
                                        isClosable: true,
                                        position: 'top-right'
                                    })
                                }
                            >
                                Show {status} toast
                            </Button>
                        </WrapItem>
                    ))}
                    <WrapItem key={'modal'}>
                        <ModalComponent />
                    </WrapItem>
                    <WrapItem>
                        <Tooltip hasArrow label="Tooltip Example">
                            <Button variant="solid" bg={useColorModeValue('light.button', 'dark.button')}>
                                ToolTip Example
                            </Button>
                        </Tooltip>
                    </WrapItem>
                </Wrap>
            </div>
        </>
    );
};

export default HomePage;
