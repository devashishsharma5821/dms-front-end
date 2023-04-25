import React, { useState, useEffect } from 'react';
import * as joint from '@antuit/rappid-v1';
import { getComputeListData } from '../../query';
import { startCase } from 'lodash';
import { useColorModeValue, useDisclosure, useColorMode, Box, IconButton, Flex, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Button } from '@chakra-ui/react';
import { useApolloClient } from '@apollo/client';
import { ComputeDetailListResponse, ExperimentAppStoreState, DmsComputeData } from '../../models/computeDetails';
import { GET_DATABRICKS_CREDS } from '../../query/index';
import { DataBricksTokenResponse } from '../../models/dataBricksTokenResponse';
import { DataBricksTokenDetails, PersistedExperiment } from '../../models/types';
import Toolbar from '../../component/toolbar/Toolbar';
import { cloneDeep } from 'lodash';
import useAppStore from '../../store';
import { v4 } from 'uuid';
import { Action, Message } from '@antuit/web-sockets-gateway-client';
import { addStages, getAndUpdateTransformersData, updateSelectedStageId, updateSelectedTransformer, updateTransformersData } from '../../zustandActions/transformersActions';
import '@antuit/rappid-v1/build/package/rappid.css';
import './canvasStyles/style.css';
import './canvasStyles/style.modern.css';
import './canvasStyles/theme-picker.css';
import './experiment.scss';
// All this are new imports for the new ProjectDetailsMenu Page I am trying to Design
import { StencilService } from './services/stencil-service';
import { ToolbarService } from './services/toolbar-service';
import { InspectorService } from './services/inspector-service';
import { HaloService } from './services/halo-service';
import { KeyboardService } from './services/keyboard-service';
import DmsCanvasService from './services/dms-canvas-service';
import { TransformerDetail, TransformersAppStoreState } from '../../models/transformerDetail';
import transformerMenuConf from '../../models/transformersConfig';
import { g, shapes } from '@antuit/rappid-v1';
import { updateDmsComputeData } from '../../zustandActions/computeActions';
import { getAndUpdateAllUsersData, updateDmsDatabricksCredentialsValidToken, updateSpinnerInfo } from '../../zustandActions/commonActions';
import { hasSubscribed } from '../../zustandActions/socketActions';
import DoubleAngleRightIcon from '../../assets/icons/DoubleAngleRightIcon';
import DoubleAngleLeftIcon from '../../assets/icons/DoubleAngleLeftIcon';
import ZoomComponent from '../../component/zoomer/Zoomer';
import { newComputeData } from '../compute/generateNewComputeData';
import Details from '../../component/details/Details';
import { useNavigate, useParams } from 'react-router-dom';
import { GetSingleProjectAppStoreState } from '../../models/project';
import { GetExperimentAppStoreState } from '../../models/experimentModel';
import { getAndUpdateSingleProjectData } from '../../zustandActions/projectActions';
import { getFormattedUserData, getStencilMarkup } from '../../utils/common.utils';
import { getAndUpdateExperimentData } from '../../zustandActions/experimentActions';
import { getToastOptions } from '../../models/toastMessages';
import { createStandaloneToast } from '@chakra-ui/react';
import { Dictionary } from '../../models/schema';
import { Port } from '../../models/transformer';
import TransformerModel from '../../models/transformerModal';
import { uniqueId } from 'underscore';
const { toast } = createStandaloneToast();

interface ExtendedEmbeddedImage extends shapes.standard.EmbeddedImage {
    uuid?: string;
}

const ExperimentsPage = () => {
    const { projectId, experimentId } = useParams();
    // TODO remove this hack for the Share Modal

    // New Consts For the new ProjectDetailsMenu Page I am designing.
    const elementRef = React.useRef<HTMLDivElement>(null);
    const [DmsComputeData, UserConfig, connectionState, selectedStageId, ExperimentData, TransformersData, SingleProjectData, selectedTransformer, selectedCellId, stages] = useAppStore(
        (state: ExperimentAppStoreState) => [
            state.DmsComputeData,
            state.UserConfig,
            state.connectionState,
            state.selectedStageId,
            state.ExperimentData,
            state.TransformersData,
            state.SingleProjectData,
            state.selectedTransformer,
            state.selectedCellId,
            state.stages
        ]
    );
    const navigate = useNavigate();
    const uuid = v4();
    const computeRunningModal = useDisclosure();
    const computeModal = useDisclosure();
    const client = useApolloClient();
    const settingsModal = useDisclosure();
    const detailsDrawer = useDisclosure();
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
    const [AllUsersData] = useAppStore((state: any) => [state.AllUsersData]);
    const [accessUserList, setAccessUserList] = React.useState<any>([]);
    // React Hook
    const bgColor = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    const themeBg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
    const panelCloseBtnBg = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');

    // DATA: Drawer related code
    const transformerMenuDrawer = useDisclosure();
    const [rappidData, setRappidData] = React.useState<DmsCanvasService>();
    const [drawerInitialized, setDrawerInitialzed] = React.useState<boolean>(false);

    let dmsComputeRunningStatusIsDefaultOne;

    // This useEffect will need to remove after implementation of child routing.
    useEffect(() => {
        if (SingleProjectData === null || SingleProjectData === undefined) {
            getAndUpdateSingleProjectData(projectId!.toString());
            if (AllUsersData && SingleProjectData) {
                setAccessUserList(getFormattedUserData(AllUsersData, SingleProjectData));
            }
        } else {
            // @ts-ignore
            localStorage.setItem('projectId', projectId.toString());
            if (AllUsersData && SingleProjectData) {
                setAccessUserList(getFormattedUserData(AllUsersData, SingleProjectData));
            }
        }
    }, [SingleProjectData]);

    useEffect(() => {
        if (AllUsersData === null) {
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        } else {
            if (AllUsersData && SingleProjectData) {
                setAccessUserList(getFormattedUserData(AllUsersData, SingleProjectData));
            }
        }
    }, [AllUsersData]);

    let unsubscribe: any = null;
    const checkComputeStatus = (dmsComputes: DmsComputeData[]) => {
        if (dmsComputes?.length === 0) {
            computeModal.onOpen();
        } else {
            //Checking if compute is already in running condition.
            const computeRunningStatus = dmsComputes?.filter((compute: DmsComputeData) => compute?.status === 'RUNNING' || 'STARTING');
            if (!computeRunningStatus || computeRunningStatus?.length === 0) {
                // unsubscribe = useAppStore.subscribe(onComputeStarted);
                setLoadingMessage('Checking session status....');
                // waitForCompute(5000);
                computeRunningModal.onOpen();
                console.log('lets check computeRunningStatus====>', computeRunningStatus);
            } else {
                //Checking isdefualt condition
                const defaultCompute = computeRunningStatus?.filter((runningCompute: DmsComputeData) => runningCompute?.is_default === true);
                if (defaultCompute?.length > 0) {
                    setComputeId(defaultCompute[0]?.id);
                } else {
                    console.log('lets check computeRunningStatus====>', computeRunningStatus);
                    setComputeId(computeRunningStatus[0]?.id);
                }
                //TODO:- Compute socket connect
                computeRunningStatus.map((compute: DmsComputeData) => {
                    if (compute?.status && compute?.id) {
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

    useEffect(() => {
        if (DmsComputeData !== null) {
            checkComputeStatus(DmsComputeData);
            const newGeneratedComputeData = newComputeData(DmsComputeData);
            setNewComputedata(newGeneratedComputeData);
        }
    }, [DmsComputeData]);

    useEffect(() => {
        updateSpinnerInfo(true);
        getAndUpdateExperimentData(experimentId as string);
    }, [experimentId]);

    const addLoadDataframeInTransformers = (TransformersData: any) => {
        const transData = cloneDeep(TransformersData);
        if (transData[0].name === 'Load Dataframe') {
            return;
        }

        const arr = cloneDeep(transData);
        const [obj] = arr.filter((transformer: any) => transformer.name === 'LoadingSparkDataframe');

        obj['name'] = 'Load Dataframe';
        obj['id'] = 'antuit.dms.dfp.io.Load Dataframe';

        let newArr: any = [];
        SingleProjectData?.datasources.map((csvData: any) => newArr.push(csvData.name));

        let newParseSchemaData = JSON.parse(obj?.schema?.jsonSchema);

        newParseSchemaData['title'] = 'Load Dataframe';
        newParseSchemaData['description'] = 'Loads a csv file';
        newParseSchemaData.properties['files'] = {
            type: 'string',
            enum: newArr
        };

        delete newParseSchemaData.properties.input_name;
        delete newParseSchemaData.properties.file_type;

        newParseSchemaData.required.pop();
        newParseSchemaData.required.pop();
        newParseSchemaData.required.push('files');
        obj.schema.jsonSchema = JSON.stringify(newParseSchemaData);
        transData.unshift(obj);
        updateTransformersData(transData);
    };

    const createCanvasSchemaFromTransformersData = () => {
        console.log('lets check createCanvasSchemaFromTransformersData how many time calling');
        addLoadDataframeInTransformers(TransformersData);
        let transformerData = cloneDeep(TransformersData);
        let transformersGroup: any = {};
        let transformedNewDataForStencil: any;
        if (transformerData && transformerData.length > 0) {
            transformedNewDataForStencil = transformerData.reduce((transformersList: any = [], currentObj: any) => {
                let stencilBg = colorMode === 'dark' ? transformerMenuConf[currentObj['category']]?.backgroundDark : transformerMenuConf[currentObj['category']]?.backgroundLight;
                let stencilStroke = colorMode === 'dark' ? transformerMenuConf[currentObj['category']]?.backgroundDarkStroke : transformerMenuConf[currentObj['category']]?.backgroundLightStroke;
                let icon = colorMode === 'dark' ? transformerMenuConf[currentObj['category']]?.iconDark : transformerMenuConf[currentObj['category']]?.iconLight;
                if (!transformersGroup[currentObj['category']])
                    transformersGroup[currentObj['category']] = { index: transformerMenuConf[currentObj['category']]?.order, label: transformerMenuConf[currentObj['category']]?.category };
                currentObj.name = startCase(currentObj.name ? currentObj?.name : currentObj?.id?.split('.').pop());
                const stencilMarkup = getStencilMarkup(currentObj, stencilBg, stencilStroke, icon, uuid);
                (transformersList[currentObj['category']] = transformersList[currentObj['category']] || []).push(stencilMarkup);
                return transformersList;
            }, transformerData[0]);
        }
        setTransformersGroup(transformersGroup);
        setTransformedNewDataForStencil(transformedNewDataForStencil);
    };


    useEffect(() => {
        client
            .query<DataBricksTokenResponse<DataBricksTokenDetails>>({
                query: GET_DATABRICKS_CREDS
            })
            .then((response) => {
                updateDmsDatabricksCredentialsValidToken(response?.data.dmsCheckDatabricksCredentials?.valid);
                const { GET_COMPUTELIST } = getComputeListData();

                if (response?.data?.dmsCheckDatabricksCredentials?.valid) {
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
                            const dmsComputeRunningStatus = DmsComputeData?.filter((compute: DmsComputeData) => compute?.status === 'RUNNING');
                            if (!(dmsComputeRunningStatus?.length === 0)) {
                                computeRunningModal.onOpen();
                            } else {
                                const dmsComputeRunningStatusIsDefault = dmsComputeRunningStatus.filter((compute: DmsComputeData) => compute?.is_default === true);
                                if (dmsComputeRunningStatusIsDefault?.length === 0) {
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
            setComputeStatus({ started: true });
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

    const select = (state: any) => {
        return state?.lastAliveMessage;
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
            .catch((err) => toast(getToastOptions(err?.message, 'error')));
    }, []);

    const themebg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlu');

    const handleDrawerOpen = () => {
        console.log('opened simple function');
        setDrawerInitialzed(true);
        transformerMenuDrawer.onOpen();
    };

    // useEffect(() => {
    //     console.log('opened');
    //     setTimeout(() => {
    //         handleDrawerOpen();
    //     }, 500);
    // }, []);

    //Method to initialize DMS and stencil services
    const initializeAndStartRapid = async (stencil?: any, group?: any) => {
        console.log('STEP 1', rappidData);
        try {
            if (!rappidData || rappidData === undefined) {
                console.log('STEP 1.1', rappidData);
                const rappid = await new DmsCanvasService(elementRef?.current, new StencilService(), new ToolbarService(), new InspectorService(), new HaloService(), new KeyboardService());
                console.log('STEP 1.2', rappid);
                setRappidData(rappid);
            }
        } catch (err) {
            toast(getToastOptions('Something went wrong', 'error'));
        }
    };

    // //Side effect to call DMS canvas and stencil services
    // useEffect(() => {
    //     if (transformerMenuDrawer.isOpen && drawerInitialized) {
    //         setTimeout(() => {
    //             console.log('lets check transformedNewDataForStencil ===>', transformedNewDataForStencil, 'transformersGroup ===>', transformersGroup);
    //             initializeAndStartRapid(transformedNewDataForStencil, transformersGroup);
    //         }, 10);
    //     } else transformerMenuDrawer.onClose();
    // }, [drawerInitialized]);

    // TODO : Need to work on Below useEffect

    const addTransformersBackToCanvas = () => {
        let transformerOnPaper: any = [];
        const expDataDisplay = JSON.parse(ExperimentData.display);
        const expCore = JSON.parse(ExperimentData.core);
        if(Object.keys(expCore).length > 0 && Object.keys(expDataDisplay).length > 0) {
            const displayKeys = Object.keys(expDataDisplay.stages);
            const coreMapped = displayKeys.map((dis) => {
                return {
                    core: expCore.stages[dis],
                    display: expDataDisplay.stages[dis]
                };
            });
            console.log('STEP 6', coreMapped);
            console.log('STEP 6.1', TransformersData);
            const transFormerData = cloneDeep(TransformersData);
            coreMapped.forEach((coreDisplay) => {
                if (transFormerData) {
                    const currentTransformer = transFormerData.filter(trans => {
                        console.log('6.2', trans.id, coreDisplay.core.module_id)
                        return trans.id === coreDisplay.core.module_id;
                    })[0];
                    console.log('STEP 6.4', currentTransformer);
                    let stencilBg = colorMode === 'dark' ? transformerMenuConf[currentTransformer['category']]?.backgroundDark : transformerMenuConf[currentTransformer['category']]?.backgroundLight;
                    let stencilStroke = colorMode === 'dark' ? transformerMenuConf[currentTransformer['category']]?.backgroundDarkStroke : transformerMenuConf[currentTransformer['category']]?.backgroundLightStroke;
                    let icon = colorMode === 'dark' ? transformerMenuConf[currentTransformer['category']]?.iconDark : transformerMenuConf[currentTransformer['category']]?.iconLight;
                    if (!transformersGroup[currentTransformer['category']])
                        transformersGroup[currentTransformer['category']] = { index: transformerMenuConf[currentTransformer['category']]?.order, label: transformerMenuConf[currentTransformer['category']]?.category };
                    currentTransformer.name = startCase(currentTransformer.name ? currentTransformer?.name : currentTransformer?.id?.split('.').pop());
                    const stencilMarkup = getStencilMarkup(currentTransformer, stencilBg, stencilStroke, icon, uuid);
                    stencilMarkup.attributes.position = coreDisplay.display.position;
                    transformerOnPaper.push(stencilMarkup);
                }});
            console.log('STEP 6.3', transformerOnPaper);
            transformerOnPaper.map((element: any) => {
                rappidData?.graph.addCell(element);
                const portsToAdd = element.attributes.CombinedPorts;
                console.log('STEP 6.5', transformerOnPaper);
                const lastCell = rappidData?.graph?.getLastCell();
                lastCell.addPorts(portsToAdd);
            });
        }
    }
    useEffect(() => {
        if (TransformersData === null) {
            updateSpinnerInfo(true);
            getAndUpdateTransformersData();
        } else {
            TransformersData && createCanvasSchemaFromTransformersData();
        }
    }, [TransformersData]);

    useEffect(() => {
        console.log('STEP 2', ExperimentData);
        if(ExperimentData && TransformersData) {
            init();
        }
        async function init() {
            console.log('STEP 2.1');
            updateSpinnerInfo(false);
            await initializeAndStartRapid(transformedNewDataForStencil, transformersGroup);
        }
    }, [ExperimentData, TransformersData]);

    //SideEffect to handle all canvas services call
    useEffect(() => {
        console.log('STEP 3', rappidData);
        if (rappidData) {
            console.log('STEP 3.1', rappidData);
            setPaperScrollerState(rappidData.getPaperScroller());
            rappidData.startRappid(transformedNewDataForStencil, transformersGroup, false);
            // TODO The Experiment and Core and Display Data needs to be attached here.
            console.log('STEP 3.3', ExperimentData);
            if(ExperimentData) {
                addTransformersBackToCanvas();
            }
        }
    }, [rappidData]);

    useEffect(() => {
        if (rappidData && drawerInitialized && transformerMenuDrawer.isOpen) {
            setTimeout(() => {
                rappidData.initializeStencil(transformedNewDataForStencil, transformersGroup);
            }, 200);
        }
    }, [transformerMenuDrawer.isOpen]);

    const onCloseEventHandler = () => {
        updateSelectedStageId(null);
        detailsDrawer.onClose();
    };

    useEffect(() => {
        if (selectedStageId) {
            detailsDrawer.onOpen();
        }
    }, [selectedStageId]);

    useEffect(() => {
        addTransformerAsStage(selectedTransformer, undefined, selectedCellId);
    }, [selectedTransformer, selectedCellId]);

    const addTransformerAsStage = (selectedTransformer: TransformerDetail, position?: g.PlainPoint, cellId?: string, restoring?: boolean) => {
        console.log('lets check addTransformerAsStage ==>', selectedTransformer, ' position ===>', position, 'cellID', cellId, '===>', restoring);

        if (restoring === undefined) {
            restoring = false;
        }

        let outputs = selectedTransformer?.outputs;
        console.log('lets check output ==>', outputs, selectedTransformer?.id);
        let outPorts = new Array<Port>();
        if (outputs?.length > 0) {
            outputs.forEach((output: any) => {
                outPorts.push({
                    label: output.name,
                    name: output.id,
                    required: true,
                    type: output.type
                });
            });
        }
        let inputs = selectedTransformer?.inputs;
        let inPorts = new Array<Port>();
        if (inputs?.length > 0) {
            inputs.forEach((input: any) => {
                inPorts.push({
                    label: input.name,
                    name: input.id,
                    required: true,
                    type: input.type
                });
            });
        }

        let lastCell = rappidData?.graph?.getLastCell();
        let box = lastCell?.getBBox();
        let attrs: any;
        attrs = {
            name: selectedTransformer?.name,
            label: selectedTransformer?.name,
            transformerId: selectedTransformer?.id,
            icon: selectedTransformer?.icon,
            layout: null,
            inPorts: inPorts,
            outPorts: outPorts,
            position: position ? position : { x: box?.x, y: box?.y }
        };
        if (cellId) {
            attrs.id = cellId;
        } else {
            attrs.id = uuid;
        }
        let model = new TransformerModel(attrs);
        console.log('lets check optidAttr: ', attrs, model, uuid);

        if (box && !position) {
            model.translate(box.x, box.y);
        }

        // TODO AFTER confirmation gonna add this line
        rappidData?.graph?.addCell(model);

        let currentModel = model?.getTransformer();

        if (!restoring && currentModel.name) {
            addStages({
                stageId: currentModel?.stageId,
                name: currentModel?.name,
                transformerId: selectedTransformer?.id,
                outputs: outputs?.map((op) => {
                    return { id: op?.id, name: op?.name, type: op?.type };
                }),
                inputs: inputs?.map((ip) => {
                    return { id: ip?.id, name: ip?.name, type: ip?.type };
                }),
                schema: selectedTransformer?.schema?.jsonSchema
            });
        }
    };

    const refreshExperiment = () => {
        getAndUpdateExperimentData(ExperimentData.id);
    };

    const onSaveClickHandler = () => {
        let currentStages: any;

        let experimentToSave: any = {
            stages: []
        };

        // Collect the position of the arrows
        let inputsPosition: Dictionary<g.PlainPoint> = {};
        let extractedPorts: any;
        let extractedPortsIdArray: any = [];
        console.log('lets check cellsData ===>', rappidData?.graph?.getCells());

        // This map is for getting port type
        rappidData?.graph?.getCells().map((cell: any) => {
            if (cell.get('type') === 'standard.EmbeddedImage') {
                console.log('lets check cells of standard.EmbeddedImage ==>', cell);
                if (cell._portSettingsData.ports.length > 1) {
                    extractedPortsIdArray.push(cell._portSettingsData.ports[0].id);
                } else {
                    extractedPortsIdArray.push(cell._portSettingsData.ports[0].id);
                }
            }
        });
        console.log('lets check extractedPorts ==>', extractedPorts);

        rappidData?.graph?.getCells().map((cell: any) => {
            if (cell.get('type') === 'standard.Link') {
                console.log('lets check going inside if check for inputsPostion ===>');
                console.log('lets check extractedPortsIdArray ==>', extractedPortsIdArray);
                let [port1, port2] = extractedPortsIdArray;
                let source = cell.get('source');
                let target = cell.get('target');
                let port = cell.get('_byId');
                console.log('lets check and find ports ===>', port);
                inputsPosition[`${source.id}.${port1}-${target.id}.${port2}`] = cell.position();
            }
        });
        console.log('lets check inputsPosition ===>', inputsPosition);

        console.log('lets check transformerData ===>', TransformersData);

        // Collect the stages
        rappidData?.graph?.getCells()?.map((cell: any) => {
            let stageId = cell.get('id');
            console.log('let me check cell inside onSvaeHandler ==>', cell, 'stages =>>', stages);
            if (cell?.attributes?.type !== 'standard.EmbeddedImage') {
                let stage = stages?.find((st: any) => st.id === stageId);

                console.log('lets check stage after filter ===>', stage, 'currentStages ===>', stages, 'stageId ===>', stageId);
                if (stageId && stage) {
                    let stageInputs = stage.inputs?.map((input: any) => {
                        return {
                            id: input.id,
                            isConnected: input.isConnected,
                            connectedStageId: input.connectedStageId,
                            connectedStageOutputId: input.connectedStageOutputId,
                            position: inputsPosition[`${input.connectedStageId}.${input.connectedStageOutputId}-${stageId}.${input.id}`]
                        };
                    });

                    console.log('lets check stageInputs ===>', stageInputs);

                    let stageOutput = stage.outputs?.map((output: any) => {
                        return {
                            id: output.id,
                            isValid: output.isValid,
                            inferredOutput: output.inferredOutput,
                            signature: output.signature
                        };
                    });

                    experimentToSave.stages.push({
                        id: cell.id.toString(),
                        transformerId: stage.transformerId,
                        name: stage.name,
                        inputs: stageInputs,
                        outputs: stageOutput,
                        formData: stage.formState?.currentForm.formData,
                        status: stage.status,
                        signature: stage.signature,
                        position: cell.position()
                    });
                }
            }
        });

        // Save it into local storage
        localStorage.setItem('savedGraph', JSON.stringify(experimentToSave));
    };

    return (
        <>
            <Box ref={elementRef} width={'100%'}>
                <Box width={'100%'} height={'56px'} bg={themebg}>
                    <Toolbar
                        computeData={newComputedata}
                        is_default={dmsComputeRunningStatusIsDefaultOne}
                        experimentData={ExperimentData}
                        projectData={SingleProjectData}
                        usersData={AllUsersData}
                        userAccessList={accessUserList}
                        onSaveClickHandler={onSaveClickHandler}
                    />
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
                                onClick={handleDrawerOpen}
                            />
                        </Box>
                        <Box position="relative" width="104px" transform="rotate(270deg)" left={-16} mt={30} textAlign="right">
                            <Box color={useColorModeValue('light.VeryDarkBlue', 'dark.Gray')} fontWeight="600">
                                Transformers
                            </Box>
                        </Box>

                        <Box>
                            <Drawer isOpen={transformerMenuDrawer.isOpen} placement="left" onClose={transformerMenuDrawer.onClose} id="left-overlay-menu" colorScheme={themeBg}>
                                <DrawerOverlay bg="transparent" />
                                <DrawerContent bg={themeBg} className="leftStencilsDrawer">
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
                                        <Box onClick={transformerMenuDrawer.onClose}>
                                            <DoubleAngleLeftIcon></DoubleAngleLeftIcon>
                                        </Box>
                                    </DrawerCloseButton>
                                    <DrawerHeader mt="17" p="0" ml="15px">
                                        Transformer
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
                        {detailsDrawer.isOpen && (
                            <Details
                                isOpen={detailsDrawer.isOpen}
                                onClose={() => {
                                    updateSelectedStageId(null);
                                    detailsDrawer.onClose();
                                }}
                                onCloseEventHandler={onCloseEventHandler}
                                selectedStageId={selectedStageId}
                            />
                        )}

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
