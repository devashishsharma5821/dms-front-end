import React, { useState, useEffect } from 'react';
import { getComputeListData } from '../../query';
import './experiment.scss';
import { Box, Flex, useColorModeValue, useDisclosure, Spinner } from '@chakra-ui/react';
import TransformerMenu from '../../component/Transformers/TransformerMenu';
import Toolbar from '../../component/toolbar/Toolbar';
import Designer from '../../component/designer/Designer';
import Details from '../../component/details/Details';
import Settings from '../../component/settings/Settings';
import { useApolloClient } from '@apollo/client';
import { ComputeDetailListResponse, ComputeDetail, ExperimentAppStoreState, DmsComputeData } from '../../models/computeDetails';
import { GET_DATABRICKS_CREDS } from '../../query/index';
import { DataBricksTokenResponse } from '../../models/dataBricksTokenResponse';
import { DataBricksTokenDetails } from '../../models/types';
import useAppStore from '../../store';
import ComputeJsonModal from '../../component/modalSystem/ComputeJsonModal';
import IsRunningModal from './IsRunningModal';
import { BusHelper } from '../../helpers/BusHelper';
import { v4 } from 'uuid';

const ExperimentsPage = () => {
    const opid = v4();
    const [updateDmsDatabricksCredentialsValidToken, token, DmsComputeData, updateDmsComputeData, submitMessage, config, UserConfig, message] = useAppStore((state: ExperimentAppStoreState) => [
        state.updateDmsDatabricksCredentialsValidToken,
        state.DmsDatabricksCredentialsValidToken,
        state.DmsComputeData,
        state.updateDmsComputeData,
        state.submitMessage,
        state.config,
        state.UserConfig,
        state.message
    ]);
    const computeRunningModal = useDisclosure();
    // const [message, setMessage] = useState('Status');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const computeModal = useDisclosure();
    const client = useApolloClient();
    const settingsModal = useDisclosure();
    const [computeId, setComputeId] = useState<string>();
    const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
    const [loaderOpen, setLoaderOpen] = useState<boolean | undefined>();
    const [connected, setConnected] = useState<boolean | undefined>();
    const [modalSettings, setModalSettings] = useState<{ openModal: boolean }>({ openModal: false });
    const [computeStatus, setComputeStatus] = useState<{ started: boolean }>({ started: false });
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
    const [clearTimeouts, setClearTimeouts] = useState<{ clear: boolean }>({ clear: false });
    const [computeStats, setComputeStats] = useState<any>();

    let dmsComputeRunningStatusIsDefaultOne;

    const checkComputeStatus = (dmsComputes: any) => {
        if (dmsComputes.length === 0) {
            computeModal.onOpen();
        } else {
            //Checking if compute is already in running condition.
            const computeRunningStatus = dmsComputes.filter((compute: any) => compute.status === 'RUNNING');
            if (computeRunningStatus.length === 0) {
                // unsubscribe = useAppStore.subscribe(onComputeStarted);
                setLoadingMessage('Checking session status....');
                // waitForCompute(5000);
                computeRunningModal.onOpen();
            } else {
                //Checking isdefualt condition
                const defaultCompute = computeRunningStatus.filter((runningCompute: any) => runningCompute?.is_default === true);
                if (defaultCompute?.length > 0) setComputeId(defaultCompute[0].id);
                else setComputeId(computeRunningStatus[0].id);
                //TODO:- Compute socket connect
                // computeRunningStatus.map((compute: any) => {
                //     if (compute.status && compute.id) {
                //         onComputeStart();
                //         submitMessage({
                //             content: BusHelper.GetKeepAliveRequestMessage({
                //                 experimentId: parseInt(compute.id),
                //                 opId: opid,
                //                 userId: UserConfig.userConfiguration.user.userId
                //             })
                //         });
                //         // unsubscribe = useAppStore.subscribe(onComputeStarted);
                //     }
                // });
            }
        }
    };
    useEffect(() => {
        console.log('data of computes', DmsComputeData);
        if (DmsComputeData !== null) checkComputeStatus(DmsComputeData);
    }, [DmsComputeData]);

    useEffect(() => {
        let unsubscribe: any = null;
        client
            .query<DataBricksTokenResponse<DataBricksTokenDetails>>({
                query: GET_DATABRICKS_CREDS
            })
            .then((response) => {
                updateDmsDatabricksCredentialsValidToken(response.data.dmsCheckDatabricksCredentials.valid);
                const { GET_COMPUTELIST } = getComputeListData();

                if (response.data.dmsCheckDatabricksCredentials.valid) {
                    if (DmsComputeData.length === 0) {
                        client
                            .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                                query: GET_COMPUTELIST
                            })
                            .then((response) => {
                                updateDmsComputeData(response.data.dmsComputes);
                            });
                    } else {
                        if (DmsComputeData.length === 0) {
                            computeModal.onOpen();
                        } else {
                            const dmsComputeRunningStatus = DmsComputeData.filter((compute: DmsComputeData) => compute.status === 'RUNNING');
                            if (!(dmsComputeRunningStatus.length === 0)) {
                                computeRunningModal.onOpen();
                            } else {
                                const dmsComputeRunningStatusIsDefault = dmsComputeRunningStatus.filter((compute: DmsComputeData) => compute?.is_default === true);
                                if (dmsComputeRunningStatusIsDefault.length === 0) {
                                    DmsComputeData[0].is_default = true;
                                    dmsComputeRunningStatusIsDefaultOne = DmsComputeData[0];
                                } else {
                                    dmsComputeRunningStatusIsDefaultOne = dmsComputeRunningStatusIsDefault[0];
                                }
                            }
                        }
                    }
                } else {
                    unsubscribe = useAppStore.subscribe(onComputeStarted);
                    settingsModal.onOpen();
                }
            });
    }, []);

    useEffect(() => {
        if (connected) {
            // Clear any timeouts if set.
            setClearTimeouts({ clear: true });
            setLoaderOpen(false);
            if (modalSettings.openModal) {
                setComputeStatus({ started: true });
            }
        }
    }, [connected]);

    const onComputeStarted = () => {
        let currentValue = select(useAppStore.getState());
        if (currentValue) {
            setComputeStats(currentValue);
            setConnected(true);
        }
    };

    const waitForCompute = (waitTime: number) => {
        let timeout = setTimeout(() => {
            setLoaderOpen(false);
            if (computeId) {
                setModalSettings({ openModal: true });
                setComputeStatus({ started: false });
            }
            setClearTimeouts({ clear: true });
        }, waitTime);
        setTimeoutId(timeout);
    };

    const onComputeStart = () => {
        setLoadingMessage('Starting session....');
        setLoaderOpen(true);
        setConnected(false);
        waitForCompute(360000);
    };

    const onComputeStop = () => {
        if (UserConfig && computeId) {
            const shutDownRequest = BusHelper.GetShutdownRequestMessage({
                experimentId: parseInt(computeId),
                opId: opid,
                userId: UserConfig.userConfiguration.user.userId
            });
            submitMessage({
                content: shutDownRequest
            });
        }
    };

    const select = (state: any) => {
        return state.lastAliveMessage;
    };

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
        // wsconnect(setMessage);
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
            {loaderOpen && (
                <Spinner color="red.500" size="xl">
                    Runnings
                </Spinner>
            )}
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
                {settingsModal.isOpen && <Settings isOpen={settingsModal.isOpen} onClose={settingsModal.onClose} />}
                {computeRunningModal.isOpen && <IsRunningModal isOpen={computeRunningModal.isOpen} onClose={computeRunningModal.onClose} />}
            </Box>
        </>
    );
};

export default ExperimentsPage;
