import { InputOutputType } from "./types";

export class InputOutput{
    id!: string;
    isExported!: boolean;
    name!: string;
    type!: InputOutputType;
    isRequired?: boolean;
    __typename!: string;
}
