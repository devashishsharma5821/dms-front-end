import { InputOutput } from "./inputOutput";
import { Schema } from "./schema";

export class TransformerDetail{
    category!: string;
    description!: string;
    documentation!: string;
    icon!: string;
    id!: string;
    inputs!: Array<InputOutput>; // ToDo: Verify type
    name!: string;
    outputs!: Array<InputOutput>;
    schema!: Schema;
    __typename!: string;
}

export interface TransformersAppStoreState {
    TransformersData: TransformerDetail[];
}
