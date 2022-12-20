import React, { useState, useEffect } from 'react';
import { wsconnect } from '../../query';
import './experiment.scss';
import { Button, Box, Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import TransformerMenu from '../../component/Transformers/TransformerMenu';
import Toolbar from '../../component/toolbar/Toolbar';
import Designer from '../../component/designer/Designer';
import Details from '../../component/details/Details';
import useDmsCheckDatabricksCred from '../../hooks/useDmsCheckDatabricksCred';
import useDmsComputeStatus from '../../hooks/useDmsComputeStatus';
import ComputeModal from '../../component/sideBarMenu/ComputeModal';
import Settings from '../../component/settings/Settings';

const ExperimentsPage = () => {
    const [message, setMessage] = useState('Status');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const settingsModal = useDisclosure();
    let dataBricksToken = useDmsCheckDatabricksCred();
    const computeData = useDmsComputeStatus();
    useEffect(() => {
        if (dataBricksToken) {
            if (computeData) {
                setIsModalOpen(true);
            }
        } else {
            // here we will open settingsModal which will set the databricks token. We have settings modal, so open it by uncommenting line below and for now staticly make dataBricksToken false.
            settingsModal.onOpen();
        }
    }, [dataBricksToken, computeData]);

    // const {i18n,  config } = useAppStore();
    // const [currentLang, setCurrentLang] = useState('en_US');
    // const [translationToUse, setTranslationToUse] = useState(i18n.translations);
    const btnRef: any = React.useRef();
    const themebg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');

    useEffect(() => {
        wsconnect(setMessage);
        console.log('Message From Websockets', message);
        // eslint-disable-next-line
    }, []);

    // const changeTranslation = () => {
    //
    //     let language = (currentLang === 'en_US') ?  'en_SP' :  'en_US';
    //    setCurrentLang(language);
    // };
    // useEffect(() => {
    //     setTranslationToUse(i18n.translations);
    // }, [currentLang]);
    // const computeData = [
    //     {
    //         active: true,
    //         name: 'my-compute1',
    //         memory: '8 GB',
    //         cpu: '3 Cores'
    //     },
    //     {
    //         active: false,
    //         name: 'my-compute1',
    //         memory: '8 GB',
    //         cpu: '3 Cores'
    //     },
    //     {
    //         active: false,
    //         name: 'my-compute1',
    //         memory: '8 GB',
    //         cpu: '3 Cores'
    //     },
    //     {
    //         active: false,
    //         name: 'my-compute1',
    //         memory: '8 GB',
    //         cpu: '3 Cores'
    //     }
    // ];
    // const computeDataEmpty: any = [];
    // React Hook
    return (
        <>
            <Box width={'100%'}>
                <Box width={'100%'} height={'56px'} bg={themebg}>
                    <Toolbar computeData={computeData} />
                </Box>
                <Flex>
                    <TransformerMenu />
                    <Designer></Designer>
                    <Box>
                        {/*<a>{translationToUse[config['title']]}</a>*/}
                        {/*<br></br>*/}
                        {/*{message}*/}
                        {/* <Button ref={btnRef} variant="solid" bg={useColorModeValue('light.button', 'dark.button')} onClick={onOpen}>
                            Open
                        </Button> */}
                        <Details isOpen={isOpen} onClose={onClose}></Details>
                        {/*<Button ref={btnRef} variant="solid" bg={useColorModeValue('light.button', 'dark.button')} onClick={changeTranslation}>*/}
                        {/*    Change Translation*/}
                        {/*</Button>*/}
                    </Box>
                </Flex>
                <ComputeModal isOpen={isModalOpen} onClose={setIsModalOpen}></ComputeModal>
                <Settings isOpen={settingsModal.isOpen} onClose={settingsModal.onClose}></Settings>
            </Box>
        </>
    );
};

export default ExperimentsPage;
