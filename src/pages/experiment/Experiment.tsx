import React, { useState, useEffect, useRef } from 'react';
import { wsconnect } from '../../query';
import './experiment.scss';
import {
    Button,
    Box,
    IconButton,
    Flex,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import TransformerMenu from '../../component/Transformers/TransformerMenu';
import DoubleAngleRightIcon from '../../assets/icons/DoubleAngleRightIcon';
import Toolbar from '../../component/toolbar/Toolbar';
import useAppStore from '../../store';
import Designer from '../../component/designer/Designer';
import Details from '../../component/details/Details';

const ExperimentsPage = () => {
    const [message, setMessage] = useState('Status');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {i18n,  config } = useAppStore();
    const [currentLang, setCurrentLang] = useState('en_US');
    const [translationToUse, setTranslationToUse] = useState(i18n.translations);
    const btnRef: any = React.useRef();
    
    
    const themebg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');

    useEffect(() => {
        wsconnect(setMessage);
    }, []);
   
    const changeTranslation = () => {

        let language = (currentLang === 'en_US') ?  'en_SP' :  'en_US';
       setCurrentLang(language);
    };
    useEffect(() => {
        setTranslationToUse(i18n.translations);
    }, [currentLang]);

    return (
        <>
            <Box width={'100%'}>
                <Box width={'100%'} height={'56px'} bg={themebg}>
                    <Toolbar />
                </Box>
                <Flex>
                <TransformerMenu />
                <Designer></Designer>
                    <Box >
                        
                        {/*<a>{translationToUse[config['title']]}</a>*/}
                        {/*<br></br>*/}
                        {/*{message}*/}
                        <Button ref={btnRef} variant="solid" bg={useColorModeValue('light.button', 'dark.button')} onClick={onOpen}>
                            Open
                        </Button>
                        <Details isOpen={isOpen} onClose={onClose}></Details>
                        {/*<Button ref={btnRef} variant="solid" bg={useColorModeValue('light.button', 'dark.button')} onClick={changeTranslation}>*/}
                        {/*    Change Translation*/}
                        {/*</Button>*/}
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default ExperimentsPage;
