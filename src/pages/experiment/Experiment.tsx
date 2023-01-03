import React, { useState, useEffect } from 'react';
import { getComputeListData, wsconnect } from '../../query';
import './experiment.scss';
import { useNavigate } from 'react-router';
import { Button, Box, Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import TransformerMenu from '../../component/Transformers/TransformerMenu';
import Toolbar from '../../component/toolbar/Toolbar';
import Designer from '../../component/designer/Designer';
import Details from '../../component/details/Details';
import ComputeModal from '../../component/sideBarMenu/ComputeModal';
import Settings from '../../component/settings/Settings';
import { useApolloClient } from '@apollo/client';
import { GET_DMS_COMPUTE_STATUS } from '../../query/index';
import { ComputeDetailListResponse, ComputeDetail } from '../../models/computeDetails';
import { GET_DATABRICKS_CREDS } from '../../query/index';
import { DataBricksTokenResponse } from '../../models/dataBricksTokenResponse';
import { DataBricksTokenDetails } from '../../models/types';
import useAppStore from '../../store';
import ComputeJsonModal from '../../component/sideBarMenu/ComputeJsonModal';
import IsRunningModal from './IsRunningModal';

const ExperimentsPage = () => {
    const [updateDmsDatabricksCredentialsValidToken, token, updateDmsComputeStatus, DmsComputeStatus, DmsComputeData, updateDmsComputeData] = useAppStore((state: any) => [
        state.updateDmsDatabricksCredentialsValidToken,
        state.DmsDatabricksCredentialsValidToken,
        state.updateDmsComputeStatus,
        state.DmsComputeStatus,
        state.DmsComputeData,
        state.updateDmsComputeData
    ]);
    const computeRunningModal = useDisclosure();
    const [message, setMessage] = useState('Status');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const computeModal = useDisclosure();
    const client = useApolloClient();
    const settingsModal = useDisclosure();

    let dmsComputeRunningStatusIsDefaultOne;
    useEffect(() => {
        client
            .query<DataBricksTokenResponse<DataBricksTokenDetails>>({
                query: GET_DATABRICKS_CREDS
            })
            .then((response) => {
                updateDmsDatabricksCredentialsValidToken(response.data.dmsCheckDatabricksCredentials.valid);
                const { GET_COMPUTELIST } = getComputeListData();

                if (response.data.dmsCheckDatabricksCredentials.valid) {
                    if (DmsComputeStatus.length === 0) {
                        client
                            .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                                query: GET_COMPUTELIST
                            })
                            .then((response) => {
                                if (!(response.data.dmsComputes.length === 0)) {
                                    computeModal.onOpen();
                                } else {
                                    const dmsComputeRunningStatus = response.data.dmsComputes.filter((compute) => compute.status === 'RUNNING');
                                    if (dmsComputeRunningStatus.length === 0) {
                                        computeRunningModal.onOpen();
                                    } else {
                                        const dmsComputeRunningStatusIsDefault = dmsComputeRunningStatus.filter((compute) => compute?.is_default === true);
                                        if (dmsComputeRunningStatusIsDefault.length === 0) {
                                            response.data.dmsComputes[0].is_default = true;
                                            dmsComputeRunningStatusIsDefaultOne = response.data.dmsComputes[0];
                                        } else {
                                            dmsComputeRunningStatusIsDefaultOne = dmsComputeRunningStatusIsDefault[0];
                                        }
                                    }
                                }
                                updateDmsComputeStatus(response.data.dmsComputes);
                            });
                    } else {
                        if (DmsComputeStatus.length === 0) {
                            computeModal.onOpen();
                        } else {
                            const dmsComputeRunningStatus = DmsComputeStatus.filter((compute: any) => compute.status === 'RUNNING');
                            if (!(dmsComputeRunningStatus.length === 0)) {
                                computeRunningModal.onOpen();
                            } else {
                                const dmsComputeRunningStatusIsDefault = dmsComputeRunningStatus.filter((compute: any) => compute?.is_default === true);
                                if (dmsComputeRunningStatusIsDefault.length === 0) {
                                    DmsComputeStatus[0].is_default = true;
                                    dmsComputeRunningStatusIsDefaultOne = DmsComputeStatus[0];
                                } else {
                                    dmsComputeRunningStatusIsDefaultOne = dmsComputeRunningStatusIsDefault[0];
                                }
                            }
                        }
                    }
                } else {
                    settingsModal.onOpen();
                }
            });
    }, []);

    useEffect(() => {
        const { GET_COMPUTELIST } = getComputeListData();
        client
            .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                query: GET_COMPUTELIST
            })
            .then((response) => {
                let computedata = [...response.data.dmsComputes];
                updateDmsComputeData(computedata);
            })
            .catch((err) => console.error(err));
    }, []);

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
                    <Toolbar computeData={DmsComputeData} is_default={dmsComputeRunningStatusIsDefaultOne} />
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
                {computeModal.isOpen && <ComputeJsonModal isOpen={computeModal.isOpen} onClose={computeModal.onClose}></ComputeJsonModal>}
                {/* <ComputeModal isOpen={computeModal.isOpen} onClose={computeModal.onClose}></ComputeModal> */}
                <Settings isOpen={settingsModal.isOpen} onClose={settingsModal.onClose}></Settings>
                <IsRunningModal isOpen={computeRunningModal.isOpen} onClose={computeRunningModal.onClose}></IsRunningModal>
            </Box>
        </>
    );
};

export default ExperimentsPage;
