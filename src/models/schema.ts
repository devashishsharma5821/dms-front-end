export class Schema{
    hasMacros!: boolean;
    jsonSchema!: string;
    outputMacros!: Array<string>; // ToDo: Verify the type
    uiSchema!: string;
    __typename!: string;
}

export interface Dictionary<T> {
    [Key: string]: T;
}

export interface DataframeDetail {
    name: string;
    cols: Array<string>;
}

export interface DatasetDetail {
    name: string;
    dataframes: Dictionary<DataframeDetail>;
}

export interface ModelDetail {
    name: string;
}

export interface State{
    dataframes: Dictionary<DataframeDetail>;
    datasets: Dictionary<DatasetDetail>;
    models: Dictionary<ModelDetail>;
}