import React, { useState, useEffect } from 'react';
import { getComputeListData, getTransformersData } from '../../query';
import { startCase } from 'lodash';
import { useColorModeValue, useDisclosure, useColorMode, Box, IconButton, Flex, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from '@chakra-ui/react';
import { useApolloClient } from '@apollo/client';
import { ComputeDetailListResponse, ExperimentAppStoreState, DmsComputeData } from '../../models/computeDetails';
import { GET_DATABRICKS_CREDS } from '../../query/index';
import { DataBricksTokenResponse } from '../../models/dataBricksTokenResponse';
import { DataBricksTokenDetails } from '../../models/types';
import Toolbar from '../../component/toolbar/Toolbar';
import useAppStore from '../../store';
import { BusHelper } from '../../helpers/BusHelper';
import { v4 } from 'uuid';
import { Action, Message } from '@antuit/web-sockets-gateway-client';

import '@antuit/rappid-v1/build/package/rappid.css';
import './canvasStyles/style.css';
import './canvasStyles/style.modern.css';
import './canvasStyles/theme-picker.css';
import './experiment.scss';
// All this are new imports for the new Experiment Page I am trying to Design
import { StencilService } from './services/stencil-service';
import { ToolbarService } from './services/toolbar-service';
import { InspectorService } from './services/inspector-service';
import { HaloService } from './services/halo-service';
import { KeyboardService } from './services/keyboard-service';
import RappidService from './services/kitchensink-service';
import { sampleGraphs } from './services/sample-graphs';
import { TransformerListResponse } from '../../models/transformerListResponse';
import { TransformerDetail } from '../../models/transformerDetail';
import transformerMenuConf from '../../models/transformersConfig';
import { shapes } from '@antuit/rappid-v1';
import { updateDmsComputeData } from '../../zustandActions/computeActions';
import { updateDmsDatabricksCredentialsValidToken } from '../../zustandActions/commonActions';
import { hasSubscribed, submitMessage } from '../../zustandActions/socketActions';
import DoubleAngleRightIcon from '../../assets/icons/DoubleAngleRightIcon';
import DoubleAngleLeftIcon from '../../assets/icons/DoubleAngleLeftIcon';
import ZoomInIcon from '../../assets/icons/ZoomInIcon';
import ZoomOutIcon from '../../assets/icons/ZoomOutIcon';
import FitToContent from '../../assets/icons/FitToContent';
import ZoomComponent from '../../component/zoomer/Zoomer';
import { newComputeData } from '../compute/generateNewComputeData';

const ExperimentsPage = () => {
    // New Consts For the new Experiment Page I am designing.
    let rappid: RappidService;
    const elementRef = React.useRef<HTMLDivElement>(null);

    const [DmsComputeData, UserConfig, connectionState] = useAppStore((state: ExperimentAppStoreState) => [state.DmsComputeData, state.UserConfig, state.connectionState]);

    const opid = v4();
    const computeRunningModal = useDisclosure();
    const computeModal = useDisclosure();
    const client = useApolloClient();
    const settingsModal = useDisclosure();
    const [computeId, setComputeId] = useState<string>();
    const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
    const [loaderOpen, setLoaderOpen] = useState<boolean | undefined>();
    const [connected, setConnected] = useState<boolean | undefined>();
    const [computeStatus, setComputeStatus] = useState<{ started: boolean }>({ started: false });
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
    const [clearTimeouts, setClearTimeouts] = useState<{ clear: boolean }>({ clear: false });
    const [computeStats, setComputeStats] = useState<string | undefined>();
    const [transformedNewDataForStencil, setTransformedNewDataForStencil] = useState<any>({});
    const [transformersGroup, setTransformersGroup] = useState<any>({});
    const { colorMode } = useColorMode();
    const [paperScrollerState, setPaperScrollerState] = React.useState<any>(undefined);
    const [newComputedata, setNewComputedata] = useState<DmsComputeData[]>([]);

    let dmsComputeRunningStatusIsDefaultOne;

    let unsubscribe: any = null;
    const checkComputeStatus = (dmsComputes: DmsComputeData[]) => {
        if (dmsComputes.length === 0) {
            computeModal.onOpen();
        } else {
            //Checking if compute is already in running condition.
            const computeRunningStatus = dmsComputes.filter((compute: DmsComputeData) => compute.status === 'RUNNING' || 'STARTING');
            if (computeRunningStatus.length === 0) {
                // unsubscribe = useAppStore.subscribe(onComputeStarted);
                setLoadingMessage('Checking session status....');
                // waitForCompute(5000);
                computeRunningModal.onOpen();
            } else {
                //Checking isdefualt condition
                const defaultCompute = computeRunningStatus.filter((runningCompute: DmsComputeData) => runningCompute?.is_default === true);
                if (defaultCompute?.length > 0) setComputeId(defaultCompute[0].id);
                else setComputeId(computeRunningStatus[0].id);
                //TODO:- Compute socket connect
                computeRunningStatus.map((compute: DmsComputeData) => {
                    if (compute.status && compute.id) {
                        onComputeStart();
                        // submitMessage({
                        //     content: BusHelper.GetKeepAliveRequestMessage({
                        //         experimentId: parseInt(compute.id),
                        //         opId: opid,
                        //         // userId: UserConfig.userConfiguration.user.userId,
                        //         userId: compute?.id,
                        //         //TODO Below are added just for fixing errors
                        //         project_id: 12,
                        //         get_datatables: undefined,
                        //         az_blob_get_containers: undefined,
                        //         az_blob_browse_container: undefined
                        //     })
                        // });
                        unsubscribe = useAppStore.subscribe(onComputeStarted);
                    }
                });
            }
        }
    };

    const intializeAndStartRapid = (stencil: any, group: any) => {
        if (!rappid) {
            rappid = new RappidService(elementRef.current, new StencilService(), new ToolbarService(), new InspectorService(), new HaloService(), new KeyboardService());
            setTimeout(() => {
                setPaperScrollerState(rappid.getPaperScroller());
            }, 500);

            rappid.startRappid(stencil, group);
            // Use below to load a sample Ready to go JSON
            // rappid.graph.fromJSON(JSON.parse(sampleGraphs.emergencyProcedure));
        }
    };
    useEffect(() => {
        if (DmsComputeData !== null) {
            checkComputeStatus(DmsComputeData);
            const newGeneratedComputeData = newComputeData(DmsComputeData);
            setNewComputedata(newGeneratedComputeData);
        }
    }, [DmsComputeData]);

    const returnCurrentTransformersIcon = (icon: string) => {
        const location = window.location.host;
        if(location === 'localhost:4200') {
            return `/v3-dms/assets/icon/transformersIcons/${icon}`;
        } else {
            return `/assets/icon/transformersIcons/${icon}`;
        }
    }
    useEffect(() => {
        const { GET_TRANSFORMERS } = getTransformersData();
        client
            .query<TransformerListResponse<Array<TransformerDetail>>>({
                query: GET_TRANSFORMERS
            })
            .then((response) => {
                let transformerData = [...response.data.dmsTransformers];
                let transformersGroup: any = {};
                let transformedNewDataForStencil: any;
                if (transformerData && transformerData.length > 0) {
                    transformedNewDataForStencil = transformerData.reduce((transformersList: any = [], currentObj: any) => {
                        //const { colorMode } = useColorMode();
                        let stencilBg = colorMode === 'dark' ? transformerMenuConf[currentObj['category']].backgroundDark : transformerMenuConf[currentObj['category']].backgroundLight;
                        let stencilStroke = colorMode === 'dark' ? transformerMenuConf[currentObj['category']].backgroundDarkStroke : transformerMenuConf[currentObj['category']].backgroundLightStroke;
                        let icon = colorMode === 'dark' ? transformerMenuConf[currentObj['category']].iconDark : transformerMenuConf[currentObj['category']].iconLight;
                        if (!transformersGroup[currentObj['category']])
                            transformersGroup[currentObj['category']] = { index: transformerMenuConf[currentObj['category']].order, label: transformerMenuConf[currentObj['category']].category };
                        currentObj.name = startCase(currentObj.name ? currentObj.name : currentObj.id.split('.').pop());
                        const stencilMarkup = new shapes.standard.EmbeddedImage({
                            size: { width: 257, height: 52 },
                            attrs: {
                                root: {
                                    dataTooltip: currentObj.name,
                                    dataTooltipPosition: 'left',
                                    dataTooltipPositionSelector: '.joint-stencil'
                                },
                                body: {
                                    rx: 2,
                                    ry: 2,
                                    fill: stencilBg,
                                    stroke: stencilStroke || '#000000',
                                    strokeWidth: 1,
                                    strokeDasharray: '0'
                                },
                                label: {
                                    text: currentObj.name,
                                    fill: '#08192E',
                                    fontFamily: 'ibm-plex-sans',
                                    fontWeight: '600',
                                    fontSize: 14,
                                    strokeWidth: 1,
                                    x: -30,
                                    y: 6
                                },
                                image: {
                                    width: 40,
                                    height: 40,
                                    x: 0,
                                    y: 10,
                                    href: returnCurrentTransformersIcon(icon)
                                }
                            },
                            ports: {
                                groups: {
                                    in: {
                                        markup: [
                                            {
                                                tagName: 'circle',
                                                selector: 'portBody',
                                                attributes: {
                                                    r: 5
                                                }
                                            }
                                        ],
                                        attrs: {
                                            portBody: {
                                                magnet: true,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                strokeWidth: 1
                                            },
                                            portLabel: {
                                                fontSize: 11,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                fontWeight: 800
                                            }
                                        },
                                        position: {
                                            name: 'left'
                                        },
                                        label: {
                                            position: {
                                                name: 'left',
                                                args: {
                                                    y: 0
                                                }
                                            }
                                        }
                                    },
                                    inPoly2: {
                                        markup: `<polygon cursor="pointer" class="port-body" points="-7,0 -4.0,-7 4.0,-7 7,0 4.0,7 -4.0,7" fill='#FFFFFF' stroke="${stencilStroke}" />`,
                                        attrs: {
                                            portBody: {
                                                magnet: true,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                strokeWidth: 1
                                            },
                                            portLabel: {
                                                fontSize: 11,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                fontWeight: 800
                                            }
                                        },
                                        position: {
                                            name: 'left'
                                        },
                                        label: {
                                            position: {
                                                name: 'left',
                                                args: {
                                                    y: 0
                                                }
                                            }
                                        }
                                    },
                                    inPoly: {
                                        markup: `<polygon cursor="pointer" className="port-body" cy='20' points="0,-7, 7,7, -7,7" fill="#FFFFFF" stroke="${stencilStroke}" />`,
                                        attrs: {
                                            portBody: {
                                                magnet: true,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                strokeWidth: 1
                                            },
                                            portLabel: {
                                                fontSize: 11,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                fontWeight: 800
                                            }
                                        },
                                        position: {
                                            name: 'left'
                                        },
                                        label: {
                                            position: {
                                                name: 'left',
                                                args: {
                                                    y: 0
                                                }
                                            }
                                        }
                                    },
                                    inRect: {
                                        markup: `<rect cursor="pointer" class="port-body" x="-7" y="-7" width="10" height="10" fill="#FFFFFF" stroke="${stencilStroke}" />`,
                                        attrs: {
                                            portBody: {
                                                magnet: true,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                strokeWidth: 1
                                            },
                                            portLabel: {
                                                fontSize: 11,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                fontWeight: 800
                                            }
                                        },
                                        position: {
                                            name: 'left'
                                        },
                                        label: {
                                            position: {
                                                name: 'left',
                                                args: {
                                                    y: 0
                                                }
                                            }
                                        }
                                    },
                                    out: {
                                        markup: [
                                            {
                                                tagName: 'circle',
                                                selector: 'portBody',
                                                attributes: {
                                                    r: 5
                                                }
                                            }
                                        ],
                                        position: {
                                            name: 'right'
                                        },
                                        attrs: {
                                            portBody: {
                                                magnet: true,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                strokeWidth: 1
                                            },
                                            portLabel: {
                                                fontSize: 11,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                fontWeight: 800
                                            }
                                        },
                                        label: {
                                            position: {
                                                name: 'right',
                                                args: {
                                                    y: 0
                                                }
                                            }
                                        }
                                    },
                                    outRect: {
                                        markup: `<rect cursor="pointer" class="port-body" x="-7" y="-7" width="10" height="10" fill="#FFFFFF" stroke="${stencilStroke}" />`,
                                        attrs: {
                                            portBody: {
                                                magnet: true,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                strokeWidth: 1
                                            },
                                            portLabel: {
                                                fontSize: 11,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                fontWeight: 800
                                            }
                                        },
                                        position: {
                                            name: 'right'
                                        },
                                        label: {
                                            position: {
                                                name: 'right',
                                                args: {
                                                    y: 0
                                                }
                                            }
                                        }
                                    },
                                    outPoly2: {
                                        markup: `<polygon cursor="pointer" class="port-body" points="-7,0 -4.0,-7 4.0,-7 7,0 4.0,7 -4.0,7" fill='#FFFFFF' stroke="${stencilStroke}" />`,
                                        attrs: {
                                            portBody: {
                                                magnet: true,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                strokeWidth: 1
                                            },
                                            portLabel: {
                                                fontSize: 11,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                fontWeight: 800
                                            }
                                        },
                                        position: {
                                            name: 'right'
                                        },
                                        label: {
                                            position: {
                                                name: 'right',
                                                args: {
                                                    y: 0
                                                }
                                            }
                                        }
                                    },
                                    outPoly: {
                                        markup: `<polygon cursor="pointer" className="port-body" cy='20' points="0,-7, 7,7, -7,7" fill="#FFFFFF" stroke="${stencilStroke}" />`,
                                        attrs: {
                                            portBody: {
                                                magnet: true,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                strokeWidth: 1
                                            },
                                            portLabel: {
                                                fontSize: 11,
                                                fill: '#FFFFFF',
                                                stroke: stencilStroke || '#000000',
                                                fontWeight: 800
                                            }
                                        },
                                        position: {
                                            name: 'right'
                                        },
                                        label: {
                                            position: {
                                                name: 'right',
                                                args: {
                                                    y: 0
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        let inputPorts = [];
                        let outputPorts = [];
                        if (currentObj.inputs.length > 0) {
                            inputPorts = currentObj.inputs.map((input: any) => {
                                let typeOfPort = 'in';
                                if (input.type === 'DATAFRAME') {
                                    typeOfPort = 'inRect';
                                } else if (input.type === 'DATASET') {
                                    typeOfPort = 'in';
                                } else if (input.type === 'MODEL') {
                                    typeOfPort = 'inPoly';
                                } else if (input.type === 'METADATA') {
                                    typeOfPort = 'inPoly2';
                                } else {
                                    typeOfPort = 'in';
                                }
                                return {
                                    group: typeOfPort,
                                    id: input.id,
                                    isRequired: input.isRequired || null,
                                    isExported: input.isExported || null,
                                    type: input.type || null,
                                    attrs: {
                                        label: {
                                            text: input.name
                                        }
                                    }
                                };
                            });
                        }
                        if (currentObj.outputs.length > 0) {
                            outputPorts = currentObj.outputs.map((output: any) => {
                                let typeOfPort = 'out';
                                if (output.type === 'DATAFRAME') {
                                    typeOfPort = 'outRect';
                                } else if (output.type === 'DATASET') {
                                    typeOfPort = 'out';
                                } else if (output.type === 'MODEL') {
                                    typeOfPort = 'outPoly';
                                } else if (output.type === 'METADATA') {
                                    typeOfPort = 'outPoly2';
                                } else {
                                    typeOfPort = 'out';
                                }
                                return {
                                    group: typeOfPort,
                                    id: output.id,
                                    isRequired: output.isRequired || null,
                                    isExported: output.isExported || null,
                                    type: output.type || null,
                                    attrs: {
                                        label: {
                                            text: output.name
                                        }
                                    }
                                };
                            });
                        }
                        const combinedGroupPorts = [...inputPorts, ...outputPorts];
                        stencilMarkup.addPorts(combinedGroupPorts);
                        (transformersList[currentObj['category']] = transformersList[currentObj['category']] || []).push(stencilMarkup);
                        return transformersList;
                    });
                }
                setTransformersGroup(transformersGroup);
                setTransformedNewDataForStencil(transformedNewDataForStencil);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        client
            .query<DataBricksTokenResponse<DataBricksTokenDetails>>({
                query: GET_DATABRICKS_CREDS
            })
            .then((response) => {
                updateDmsDatabricksCredentialsValidToken(response.data.dmsCheckDatabricksCredentials.valid);
                const { GET_COMPUTELIST } = getComputeListData();

                if (response.data.dmsCheckDatabricksCredentials.valid) {
                    if (DmsComputeData?.length === 0) {
                        client
                            .query<ComputeDetailListResponse<Array<DmsComputeData>>>({
                                query: GET_COMPUTELIST
                            })
                            .then((response) => {
                                updateDmsComputeData(response.data.dmsComputes);
                            });
                    } else {
                        if (DmsComputeData?.length === 0) {
                            computeModal.onOpen();
                        } else {
                            const dmsComputeRunningStatus = DmsComputeData?.filter((compute: DmsComputeData) => compute.status === 'RUNNING');
                            if (!(dmsComputeRunningStatus?.length === 0)) {
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
            // if (modalSettings.openModal) {
            setComputeStatus({ started: true });
            // }
        }
    }, [connected]);

    useEffect(() => {
        if (connectionState && UserConfig && computeId) {
            let subscribeMessage: Message = {
                action: Action.Subscribe,
                // subject: `dms_pid.out.${UserConfig.userConfigFromStore.user.userId}`
                subject: `dms_pid.out.${computeId}`
            };

            // If the socket disconnects, this listener fires once but will not call subscribe
            // On the next reconnect, this listener fires and will now attempt to subscribe
            if (connectionState?.connected) {
                if (!connectionState?.subscribed) {
                    // submitMessage({ content: subscribeMessage });
                    // submitMessage({
                    //     content: BusHelper.GetKeepAliveRequestMessage({
                    //         // experimentId: parseInt(computeId),
                    //         experimentId: parseInt(UserConfig?.userConfigFromStore?.user?.userId),
                    //         opId: opid,
                    //         // userId: UserConfig.userConfigFromStore.user.userId,
                    //         userId: computeId,
                    //         //TODO Below are added just for fixing errors
                    //         project_id: 12,
                    //         get_datatables: undefined,
                    //         az_blob_get_containers: undefined,
                    //         az_blob_browse_container: undefined
                    //     })
                    // });
                    hasSubscribed();
                }
            } else {
                // The socket will disconnect and reconnect periodically. This is an optimization by the browser to preserve battery life.
                // For prolonged disconnects (network down etc.) the socket will stop trying to reconnect after several attempts.
                // In the socketmiddeware, we have a socket error listener which will attempt to manually reconnect if socketio has given up connecting
                console.log('Disconnected.');
            }
        }
    }, [connectionState]);

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
        waitForCompute(3000);
    };

    const onComputeStop = () => {
        if (UserConfig && computeId) {
            const shutDownRequest = BusHelper.GetShutdownRequestMessage({
                experimentId: parseInt(UserConfig.userConfiguration.user.userId),
                opId: opid,
                userId: computeId,
                //TODO Below are added just for fixing errors
                project_id: 12,
                get_datatables: undefined,
                az_blob_get_containers: undefined,
                az_blob_browse_container: undefined
            });
            // submitMessage({
            //     content: shutDownRequest
            // });
        }
    };

    const select = (state: any) => {
        return state.lastAliveMessage;
    };

    useEffect(() => {
        const { GET_COMPUTELIST } = getComputeListData();
        client
            .query<ComputeDetailListResponse<Array<DmsComputeData>>>({
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

    // useEffect(() => {
    // wsconnect(setMessage);
    // console.log('Message From Websockets', message);
    // eslint-disable-next-line
    // }, []);

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
    const bgColor = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const transformerMenuDrawer = useDisclosure();
    const themeBg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
    const panelCloseBtnBg = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    const toggleLeftMenu = () => {
        console.log('1', leftMenuOpen);
        setLeftMenuOpen(!leftMenuOpen);
    };
    useEffect(() => {
        console.log('LeftMenOpen', leftMenuOpen);
        if (leftMenuOpen) {
            transformerMenuDrawer.onOpen();
            setTimeout(() => {
                intializeAndStartRapid(transformedNewDataForStencil, transformersGroup);
            }, 10);
        } else transformerMenuDrawer.onClose();
    }, [leftMenuOpen]);
    return (
        <>
            <Box ref={elementRef} width={'100%'}>
                <Box width={'100%'} height={'56px'} bg={themebg}>
                    <Toolbar computeData={newComputedata} is_default={dmsComputeRunningStatusIsDefaultOne} />
                </Box>
                <Flex>
                    <Box w="var(--chakra-space-60)" h="calc(90vh)" bg={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')} marginInlineStart="0" ml={44}>
                        <Box textAlign="right" ml="26">
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
                                mr={18}
                                onClick={toggleLeftMenu}
                            />
                        </Box>
                        <Box position="relative" width="104px" transform="rotate(270deg)" left={-16} mt={30} textAlign="right">
                            <Box color={useColorModeValue('light.VeryDarkBlue', 'dark.Gray')} fontWeight="600">
                                Transformers
                            </Box>
                        </Box>
                        <Box>
                            <Drawer isOpen={transformerMenuDrawer.isOpen} placement="left" onClose={toggleLeftMenu} finalFocusRef={btnRef} id="left-overlay-menu" colorScheme={themeBg}>
                                <DrawerOverlay bg="transparent" />
                                <DrawerContent bg={themeBg} mt="44" ml="54" w="350px" maxWidth="292px">
                                    <DrawerCloseButton
                                        bg={panelCloseBtnBg}
                                        _hover={{ background: panelCloseBtnBg }}
                                        border="px"
                                        mt="17"
                                        mr={2.5}
                                        w="24px"
                                        h="24px"
                                        borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryLightDarkGrayishBlue')}
                                        color={useColorModeValue('light.lightestDarkGray', 'dark.Gray')}
                                    >
                                        <Box onClick={toggleLeftMenu}>
                                            <DoubleAngleLeftIcon></DoubleAngleLeftIcon>
                                        </Box>
                                    </DrawerCloseButton>
                                    <DrawerHeader mt="17" p="0" ml="15px">
                                        Transformers
                                    </DrawerHeader>

                                    <DrawerBody pl="0" pt="14" pr="17">
                                        <div id="stencil-container" className="stencil-container" />
                                    </DrawerBody>
                                </DrawerContent>
                            </Drawer>
                        </Box>
                    </Box>
                    <Box className="joint-app joint-theme-modern">
                        {/*<div className="app-header">*/}
                        {/*    <div className="app-title">*/}
                        {/*        <h1>Transformers</h1>*/}
                        {/*    </div>*/}
                        {/*    <div className="toolbar-container" />*/}
                        {/*</div>*/}
                        <div className="app-body">
                            {/*<div id="stencil-container" className="stencil-container" />*/}
                            <Box className="paper-container" />
                            {/*<div className="inspector-container" />*/}
                            <Box className="navigator-container" />
                            <ZoomComponent paperScroll={paperScrollerState}></ZoomComponent>
                        </div>
                    </Box>
                    <Box>
                        {/*<a>{translationToUse[config['title']]}</a>*/}
                        {/*<br></br>*/}
                        {/*{message}*/}
                        {/* <Button ref={btnRef} variant="solid" bg={useColorModeValue('light.button', 'dark.button')} onClick={onOpen}>
                            Open
                        </Button> */}
                        {/*<Details isOpen={isOpen} onClose={onClose}></Details>*/}
                        {/*<Button ref={btnRef} variant="solid" bg={useColorModeValue('light.button', 'dark.button')} onClick={changeTranslation}>*/}
                        {/*    Change Translation*/}
                        {/*</Button>*/}
                    </Box>
                </Flex>
                {/*{computeModal.isOpen && <ComputeJsonModal isOpen={computeModal.isOpen} onClose={computeModal.onClose}></ComputeJsonModal>}*/}
                {/*/!* <ComputeModal isOpen={computeModal.isOpen} onClose={computeModal.onClose}></ComputeModal> *!/*/}
                {/*{settingsModal.isOpen && <Settings isOpen={settingsModal.isOpen} onClose={settingsModal.onClose} />}*/}
                {/*{computeRunningModal.isOpen && <IsRunningModal isOpen={computeRunningModal.isOpen} onClose={computeRunningModal.onClose} />}*/}
            </Box>
        </>
    );
};

export default ExperimentsPage;
