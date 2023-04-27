import client from '../apollo-client';
import { dmsEditExperiment, getTransformersData } from '../query';
import useAppStore from '../store';
import {
    getAndUpdateTransformersData as getAndUpdateTransformersDataType,
    updateTransformersData as updateTransformersDataType,
    updateSelectedStageId as updateSelectedStageIdType,
    updateSelectedTransformer as updateSelectedTransformerType,
    addStages as addStagesType,
    updateSelectedCellId as updateSelectedCellIdType,
    updateModuleConfigData as updateModuleConfigDataType,
    updateGraph as updateGraphType,
    updateGraphOnChangingPosition as updateGraphOnChangingPositionType,
    setStageHasRun as setStageHasRunType,
    setStageForm as setStageFormType,
    setStageStatus as setStageStatusType,
    setInputOutputs as setInputOutputsType,
    setExpandedSchema as setExpandedSchemaType
} from '../models/zustandStore';
import { TransformerListResponse } from '../models/transformerListResponse';
import { TransformerDetail } from '../models/transformerDetail';
import { StageHelper } from '../helpers/StageHelper';
import { StageStatus } from '../models/types';
import { Dictionary } from '../models/schema';
import { g } from '@antuit/rappid-v1';
import { getToastOptions } from '../models/toastMessages';
import { createStandaloneToast } from '@chakra-ui/react';
import { updateSpinnerInfo } from './commonActions';
import TransformerModel from '../models/transformerModal';
import { SchemaHelper } from '../helpers/SchemaHelper';
const { toast } = createStandaloneToast();

export const getAndUpdateTransformersData: getAndUpdateTransformersDataType = async () => {
    updateSpinnerInfo(true);
    const { GET_TRANSFORMERS } = getTransformersData();
    try {
        const response = await client.query<TransformerListResponse<Array<TransformerDetail>>>({
            query: GET_TRANSFORMERS
        });
        useAppStore.setState(() => ({ TransformersData: response.data.dmsTransformers }));
    } catch (error: any) {
        toast(getToastOptions(error.message, 'error'));
    } finally {
        updateSpinnerInfo(false);
    }
};

export const updateTransformersData: updateTransformersDataType = (TransformersData) => useAppStore.setState(() => ({ TransformersData: TransformersData }));

export const updateSelectedStageId: updateSelectedStageIdType = (stageId: any) => useAppStore.setState(() => ({ selectedStageId: stageId }));
export const updateSelectedCellId: updateSelectedCellIdType = (CellId: any) => useAppStore.setState(() => ({ selectedCellId: CellId }));

export const updateSelectedTransformer: updateSelectedTransformerType = (stageId: any) => {
    useAppStore.setState((state: any) => {
        const transformer = state.TransformersData.find((transformer: any) => transformer?.id === stageId);
        return { selectedTransformer: Object.create(transformer) };
    });
};

export const addStages: addStagesType = (stage: any) =>
    useAppStore.setState((state: any) => {
        console.log('lets check stages for now inside addStages', stage);
        let newStages;
        let newStage;
        if (stage?.stageId && state?.stages?.some((stage: any) => stage?.id === stage?.stageId)) {
            console.log('lets check coming inside addStage 2');
        } else {
            console.log('lets check coming inside addStage 1');
            // if (!state.stages) {
            //     state.stages = [];
            // }

            newStage = {
                id: stage?.stageId,
                name: stage?.name,
                transformerId: stage?.transformerId,
                outputs: stage?.outputs?.map((output: any) => {
                    return {
                        id: output?.id,
                        isValid: false,
                        signature: '',
                        inferredOutput: StageHelper.ioDefaultPopulate(output)
                    };
                }),
                inputs: stage?.inputs?.map((input: any) => {
                    return {
                        id: input?.id,
                        isConnected: false,
                        isValid: false,
                        connectedStageId: '',
                        connectedStageOutputId: '',
                        connectedStageOutputSignature: ''
                    };
                }),
                status: StageStatus.Invalid,
                hasRun: false,
                expandedSchema: stage?.schema,
                signature: ''
            };

            // newStages = [...state.stages, newStage];
        }
        console.log('lets check newStages where we are updating stages   ==>', newStages, ' newStage ===>', newStage);
        return { stages: [...state.stages, newStage] };
        // return state.stages.push(newStage);
    });

export const updateModuleConfigData: updateModuleConfigDataType = async (moduleConfigData: any, title: string) => {
    let stagesWithConfig: any;
    let experimentToSave: any;

    useAppStore.setState((state: any) => {
        stagesWithConfig = JSON.parse(state.experimentToSave.stages);
        console.log('lets check stagesWithConfig inside updateModuleConfigData ==> 1', stagesWithConfig);
        for (let key in stagesWithConfig.stages) {
            if (stagesWithConfig.stages[key].name === title) {
                console.log('lets check going inside or not ===>', moduleConfigData);
                // stagesWithConfig.stages[key].module_conf = JSON.stringify(moduleConfigData);
                console.log('lets check stagesWithConfig inside updateModuleConfigData ==> 2', stagesWithConfig);
            }
        }
        experimentToSave = state.experimentToSave;
        return { moduleConfigData: moduleConfigData };
    });

    console.log('lets check stagesWithConfig ===>', stagesWithConfig);

    experimentToSave.stages = JSON.stringify(stagesWithConfig);

    try {
        console.log('lets check experimentToSave inside updateModuleConfigData ====> 1', experimentToSave);
        const response = await client.mutate<any>({
            mutation: dmsEditExperiment(experimentToSave)
        });

        console.log('lets check experimentToSave inside updateModuleConfigData ====> 3', response);
    } catch (error: any) {
        toast(getToastOptions(`${error.message}`, 'error'));
    }
};

export const updateGraph: updateGraphType = async (graph: any, stages: any) => {
    useAppStore.setState((state: any) => {
        return { graph: graph };
    });
    let experimentToSave: any = {
        id: '',
        name: '',
        tags: null,
        description: '',
        stages: []
    };
    useAppStore.setState((state: any) => {
        let currentStages: any;

        let inputsPosition: Dictionary<g.PlainPoint> = {};
        let extractedPorts: any;
        let extractedPortsIdArray: any = [];

        console.log('lets check newStages to add in current newStages ==> inside update graph', stages);

        graph?.getCells().map((cell: any) => {
            console.log('lets check cell data ', cell);
            if (cell.get('type') === 'standard.Link') {
                console.log('lets check its going inside link check standard');
                let [port1, port2] = extractedPortsIdArray;
                let source = cell.get('source');
                let target = cell.get('target');
                let port = cell.get('_byId');
                inputsPosition[`${source.id}.${port1}-${target.id}.${port2}`] = cell.position();
            }
            let stageId = cell.get('id');
            if (cell?.attributes?.type !== 'standard.Link') {
                console.log('lets check its going inside link check EmbeddedImage', 'stageLength', stages.length, 'stages', stages, 'stageId ==>', stageId);
                let stage = stages?.find((st: any) => {
                    console.log('let check st.id ===>', st.id, 'stageId===>', stageId);
                    return st.id === stageId;
                });
                // let stage = state.stages[0];
                console.log('lets check stage only ===>', stage);
                if (stageId && stage) {
                    console.log('lets check stageId and stage ', stageId, stage);
                    let stageInputs = stage.inputs?.map((input: any) => {
                        return {
                            id: input.id,
                            isConnected: input.isConnected,
                            connectedStageId: input.connectedStageId,
                            connectedStageOutputId: input.connectedStageOutputId,
                            position: inputsPosition[`${input.connectedStageId}.${input.connectedStageOutputId}-${stageId}.${input.id}`]
                        };
                    });
                    let stageOutput = stage.outputs?.map((output: any) => {
                        return {
                            id: output.id,
                            isValid: output.isValid,
                            inferredOutput: output.inferredOutput,
                            signature: output.signature
                        };
                    });

                    let position = cell.position();
                    console.log('POSITION', cell.position().x);
                    console.log('POSITION', cell.position().y);
                    position.x = Math.ceil(cell.position().x);
                    position.y = Math.ceil(cell.position().y);
                    experimentToSave.stages.push({
                        id: cell.id.toString(),
                        transformerId: stage.transformerId,
                        name: stage.name,
                        inputs: stageInputs,
                        outputs: stageOutput,
                        formData: stage.formState?.currentForm.formData,
                        status: stage.status,
                        signature: stage.signature,
                        position: position
                    });
                }
            }
        });

        experimentToSave.id = state.ExperimentData.id;
        experimentToSave.name = state.ExperimentData.name;
        experimentToSave.description = state.ExperimentData.description;
        experimentToSave.tags = state.ExperimentData.tags;

        return {
            updatedGraph: experimentToSave
        };
    });

    let newGeneratedObj: any = {};
    let displayObj: any = {};

    experimentToSave.stages.map((stage: any) => {
        console.log('1111', stage);
        if (stage.inputs.length > 0) {
            newGeneratedObj[stage.id] = {
                id: stage.id,
                name: stage.name,
                module_id: stage.transformerId,
                module_conf: '',
                inputs: {
                    [stage.inputs[0].id]: {
                        intermediate: {}
                    }
                }
                // position: stage.position
            };
            displayObj[stage.id] = {
                id: stage.id,
                position: stage.position,
                status: StageStatus.Valid,
                signature: '',
                inputs: {},
                outputs: {}
            };
        } else {
            newGeneratedObj[stage.id] = {
                id: stage.id,
                name: stage.name,
                module_id: stage.transformerId,
                module_conf: ''
                // position: stage.position
            };
            displayObj[stage.id] = {
                id: stage.id,
                position: stage.position,
                status: StageStatus.Valid,
                signature: '',
                inputs: {},
                outputs: {}
            };
        }
    });

    let newStages = {
        stages: newGeneratedObj
    };

    let newDisplay = {
        stages: displayObj
    };

    let stringifyStages: any = JSON.stringify(newStages);
    let display: any = JSON.stringify(newDisplay);
    experimentToSave.stages = stringifyStages;
    experimentToSave.display = display;

    useAppStore.setState((state: any) => {
        return { experimentToSave: experimentToSave };
    });
    console.log('Step 5', experimentToSave);
    try {
        const response = await client.mutate<any>({
            mutation: dmsEditExperiment(experimentToSave)
        });

        console.log('lets check response ===>', response);
    } catch (error: any) {
        toast(getToastOptions(`${error.message}`, 'error'));
    }
};

export const updateGraphOnChangingPosition: updateGraphOnChangingPositionType = async (dataFormed: any) => {
    let experimentToSave: any;
    useAppStore.setState((state: any) => {
        experimentToSave = state.experimentToSave;
        return state;
    });
    let stagesWithConfig = JSON.parse(experimentToSave.stages);
    for (let key in stagesWithConfig.stages) {
        if (stagesWithConfig.stages[key].id === dataFormed.id) {
            // Can make what ever changes we want to with experimentToSave
            console.log('lets check going inside if check or not', dataFormed.id);
        }
    }
    experimentToSave.stages = JSON.stringify(stagesWithConfig);

    try {
        const response = await client.mutate<any>({
            mutation: dmsEditExperiment(experimentToSave)
        });

        console.log('lets check response ===>', response);
    } catch (error: any) {
        toast(getToastOptions(`${error.message}`, 'error'));
    }
};

export const setStageHasRun: setStageHasRunType = (data: any) => {
    console.log('lets check data inside setSTageHasRun ==>', data);
    useAppStore.setState((state: any) => {
        console.log('lets check stage inside setStageHasRun =====>', state.stages, 'data ====>', data);
        let stage = state.stages.find((stage: any) => stage.id === data.stageId);

        if (stage) {
            console.log('lets check stage after find inside setStageHasRun ==>', stage, 'data ===>', data);

            stage.hasRun = data.hasRun;
            if (!data.hasRun) {
                console.log('lets check graph inside setStageHasRun ==>', state.graph);
                let currentCell = state.graph.getCells().find((cell: any) => cell.get('id') === data.stageId);
                console.log('ltes check currentCell inside setStageHasRun ===>', currentCell);
                if (currentCell) {
                    let connections = state.graph.getConnectedLinks(currentCell); // Only get outbound connections
                    console.log('lets check connections inside setStageHasRun ===>', connections);

                    // TODO: Currently no connections are forming so need to check below commented after connections made

                    connections.forEach((conn: any) => {
                        let target = conn.get('target');
                        let targetCell = state.graph?.getCell(target.id);
                        if (targetCell instanceof TransformerModel) {
                            let targetTransformer = targetCell.getTransformer();
                            let connectedTargetStage = state.stages?.find((stage: any) => stage.id === targetTransformer.stageId);
                            if (connectedTargetStage) {
                                connectedTargetStage.hasRun = data.hasRun;
                            }
                        }
                    });
                }
            }
        }
        return state;
    });
};

export const setStageForm: setStageFormType = (data: any) => {
    console.log('lets check data inside setStageForm ===>', data);
    useAppStore.setState((state: any) => {
        if (data.stageId && state.stages.some((stage: any) => data.stageId === stage.id)) {
            console.log('lets check going inside or not setStageForm==>');
            let stage = state.stages.find((stage: any) => stage.id === data.stageId);
            if (stage) {
                stage.formState = { currentForm: data.currentForm };
                console.log('stage has been found lets check ==>', stage);
            } else {
                console.log('Stage not found.');
            }
        } else {
            console.log('Stage not found.');
        }
        return state;
    });
};

export const setStageStatus: setStageStatusType = (data: any) => {
    console.log('lets check data inside setStageStatus ===>', data);
    useAppStore.setState((state) => {
        let stage = state.stages?.find((stage: any) => {
            return stage.id === data.stageId;
        });
        if (stage) {
            console.log('lets check stage inside setStageStatus ===>', stage);
            stage.status = data.status;
            if (data.status === StageStatus.Invalid) {
                console.log('lets check going inside invalid check or not ===>', data.status);
                stage.hasRun = false;
            }
        }
        return state;
    });
};

// TODO: There are further functionality to cherry-pick from poc pipelineSlices.ts
export const setInputOutputs: setInputOutputsType = (payload: any) => {
    console.log('lets check payload inside setInputOutputs ===>', payload);
    useAppStore.setState((state: any) => {
        if (payload && payload.stageId && state.graph) {
            let currentStage = state.stages?.find((stage: any) => stage.id === payload.stageId);
            console.log('lets check going inside or not currentStage ====>', currentStage);

            let currentCell = state.graph.getCells().find((cell: any) => cell.get('id') === payload.stageId);

            console.log('lets check currentCell ===>', currentCell);

            if (currentCell) {
                let connections = state.graph.getConnectedLinks(currentCell, { outbound: true }); // Only get outbound connections
                console.log('lets check connections in setInputOutputs ==>', connections);

                connections.forEach((conn: any) => {
                    let source = conn.get('source');
                    let target = conn.get('target');
                    let targetCell = state.graph?.getCell(target.id);
                    console.log('lets check going inside connections forEach source ===>', source, '   target==>', target, '   targetCell===>', targetCell);
                    if (targetCell instanceof TransformerModel) {
                        let targetTransformer = targetCell.getTransformer();
                        console.log('lets check targetTransformer ==>', targetTransformer);
                        let connectedSourceOutput = currentStage?.outputs.find((output: any) => output.id === source.port);
                        console.log('lets check connectedSourceOutput ==>', connectedSourceOutput);
                        let connectedTargetStage = state.stages?.find((stage: any) => stage.id === targetTransformer.stageId);
                        console.log('lets check connectedTargetStage ==>', connectedTargetStage);

                        if (connectedTargetStage && connectedTargetStage.inputs) {
                            let connectedTargetInput = connectedTargetStage.inputs?.find((inp: any) => inp.id === target.port);
                            console.log('lets check connectedTargetInput ==>', connectedTargetInput);

                            if (connectedTargetInput && connectedSourceOutput) {
                                if (!connectedTargetInput.connectedStageOutputSignature || connectedTargetInput.connectedStageOutputSignature !== connectedSourceOutput.signature) {
                                    connectedTargetInput.connectedStageOutputSignature = connectedSourceOutput.signature;
                                }

                                if (connectedTargetInput.isValid !== connectedSourceOutput.isValid) {
                                    connectedTargetInput.isValid = connectedSourceOutput.isValid;
                                }
                            }
                        }
                    }
                });
            }
        }

        return state;
    });
};

export const setExpandedSchema: setExpandedSchemaType = (payload: any) => {
    console.log('lets check payload is coming or not ==>', payload);
    useAppStore.setState((state: any) => {
        console.log('lets check stages inside setExpandedSchema state updating function ==>', state.stages);
        if (state.stages) {
            let selectedStage = state.stages?.find((stage: any) => stage.id === payload.stageId);
            if (selectedStage) {
                selectedStage.expandedSchema = payload.expandedSchema;
                console.log('lets check selectedStage.expandedSchema ===>', selectedStage.expandedSchema);
            }
        }
        return state;
    });
};

export const updateLink: any = (link: any, isConnect: boolean) => {
    useAppStore.setState((state: any) => {
        console.log('lets check link inside updateLink jalaj 2', link);
        return { link: link, isConnect: isConnect };
    });
};

export const handleConnect: any = (payload: any) => {
    useAppStore.setState((state: any) => {
        if (payload && payload.fromStage && payload.toStage) {
            let output = null;
            let fromStage = state.stages?.find((stage: any) => stage.id === payload.fromStage.stageId);
            if (fromStage) {
                output = fromStage.outputs.find((output: any) => {
                    return output.id === payload.fromStage.inputOutputId;
                });
                if (output) {
                    let toStage = state.stages?.find((stage: any) => stage.id === payload.toStage.stageId);
                    if (toStage && toStage.inputs) {
                        let targetInput = toStage.inputs?.find((inp: any) => inp.id === payload.toStage.inputOutputId);
                        if (targetInput) {
                            // The below properties are set regardless of the signature.
                            targetInput.isConnected = true;
                            targetInput.isValid = output.isValid;
                            targetInput.connectedStageId = fromStage.id;
                            targetInput.connectedStageOutputId = output.id;
                            targetInput.connectedStageOutputSignature = output.signature;
                        }
                    }
                }
            }
        }
        return state;
    });
};

export const expandSchema: any = (expandSchemaPayload: any) => {
    useAppStore.setState((state: any) => {
        let selectedStage = state.stages?.find((stage: any) => stage.id === expandSchemaPayload.payload.stageId);
        if (selectedStage && state.stages) {
            let result = SchemaHelper.GetExpandedSchema(selectedStage.id, state.stages, expandSchemaPayload.payload.schema, false);
            selectedStage.expandedSchema = result.schema;
        }
        return state;
    });
};

export const handleDisconnect: any = (payload: any) => {
    useAppStore.setState((state: any) => {
        if (payload && payload.toStage) {
            let toStage = state.stages?.find((stage: any) => stage.id === payload.toStage.stageId);
            if (toStage && toStage.inputs) {
                let targetInput = toStage.inputs?.find((inp: any) => inp.id === payload.toStage.inputOutputId);
                if (targetInput) {
                    targetInput.isConnected = false;
                    targetInput.isValid = false;
                    targetInput.connectedStageId = '';
                    targetInput.connectedStageOutputId = '';
                } else {
                    console.error(`Target input with id ${payload.toStage.inputOutputId} not found for stage with name: ${toStage.name}`); // should never hit
                }
            }
        }
        return state;
    });
};
