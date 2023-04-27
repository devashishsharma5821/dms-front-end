import { Schema, Dictionary, State, DataframeDetail } from '../models/schema';
import { InputOutputType, StageState } from '../models/types';
import { JSONSchemaExpander } from '../temp/json_schema_expander';
import { StringHelper } from './StringHelper';

export class SchemaHelper {
    static GetExpandedSchema(stageId: string, stages: Array<StageState>, schema: Schema, isSomeInputsInValid: boolean): { schema: string; expander: JSONSchemaExpander | null } {
        let expandedSchema: string = '{}';
        let expander: JSONSchemaExpander | null = null;

        let selectedStage = stages?.find((stage) => stage.id === stageId);
        if (selectedStage) {
            if (schema.hasMacros && selectedStage.inputs && !isSomeInputsInValid) {
                let { expanderResult, expanderValues, primaryDF } = this.GetExpander(stageId, stages, schema, isSomeInputsInValid);
                let parsedSchema = JSON.parse(schema.jsonSchema);

                expander = expanderResult;
                expandedSchema = JSON.stringify(expanderResult.expand_object(parsedSchema, primaryDF, expanderValues));
            } else {
                expandedSchema = schema.jsonSchema;
            }
        }

        return { schema: expandedSchema, expander: expander };
    }

    static GetExpander(
        stageId: string,
        stages: Array<StageState>,
        schema: Schema,
        isSomeInputsInValid: boolean
    ): { expanderResult: JSONSchemaExpander; expanderValues: Dictionary<string>; primaryDF: string } {
        let expanderResult: JSONSchemaExpander = new JSONSchemaExpander({});
        let expanderValues: Dictionary<string> = {};
        let primaryDF = '';
        let selectedStage = stages?.find((stage) => stage.id === stageId);

        if (selectedStage && schema.hasMacros && selectedStage.inputs && !isSomeInputsInValid) {
            // Populate the JSON Schema State
            let expanderState: State = {
                dataframes: {},
                datasets: {},
                models: {}
            };

            selectedStage?.inputs.forEach((input) => {
                // This is the connected stage
                let connectedStage = stages?.find((stage) => stage.id === input.connectedStageId);
                if (connectedStage) {
                    let indexVal = StringHelper.getSeparatedString('.', input.connectedStageId, input.connectedStageOutputId);

                    // This is the output from the connected stage
                    let connectedStageOutput = connectedStage.outputs?.find((output) => output.id === input.connectedStageOutputId);
                    if (connectedStageOutput) {
                        if (connectedStageOutput.inferredOutput.kind === InputOutputType.Dataset) {
                            // This is a dataset
                            // Get the dataframes included in the dataset
                            let dataframes: Dictionary<DataframeDetail> = {};
                            for (let df_id in connectedStageOutput.inferredOutput.spec.dataframes) {
                                let df = connectedStageOutput.inferredOutput.spec.dataframes[df_id];
                                if (df && df.spec) {
                                    dataframes[df_id] = {
                                        name: df_id,
                                        cols: df.spec.columns.map((op) => op.name)
                                    };
                                }
                            }
                            // Add the dataframes into the state
                            expanderState.datasets[indexVal] = {
                                name: connectedStage.name,
                                dataframes: dataframes
                            };
                        } else if (connectedStageOutput.inferredOutput.kind === InputOutputType.Model) {
                            // This is a model
                            expanderState.models[indexVal] = {
                                name: connectedStage.name
                            };
                        } else {
                            // This is a dataframe
                            expanderState.dataframes[indexVal] = {
                                name: connectedStage.name,
                                cols: connectedStageOutput.inferredOutput.spec.columns.map((op) => op.name)
                            };
                        }

                        // TODO: Figure out a better way than hardcoding to find the primary dataframe
                        if (input.id === '__primary_df__') {
                            primaryDF = indexVal;
                        } else {
                            expanderValues[input.id] = indexVal;
                        }
                    }
                }
            });
            expanderResult = new JSONSchemaExpander(expanderState);
        }

        return { expanderResult, expanderValues, primaryDF };
    }
}
