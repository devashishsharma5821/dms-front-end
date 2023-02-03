export interface FieldPropsType {
    name: string;
    type?: string;
    label?: string;
    show?: boolean;
    className?: string;
    uiSchema?: any;
    conditionalRender?: boolean;
    child?: string;
    min?: string;
    uiSchemaOptions?: any;
    disable?: boolean;
    options?: any;
    uioptions?: any;
    errormessage?: string | undefined;
    uniqueKey: string;
}

export class InputFieldType<T> {
    name: any;
    disabled?: boolean;
    disable?: boolean;
    uniqueKey!: string | undefined;
    children?: any;
    props?: T;
    as?: any;
}

export interface FormSchemaType {
    type?: string;
    label?: string;
    required?: boolean;
    show?: boolean;
    errormessage?: string;
    className?: string;
    uiSchema?: any;
    conditionalRender?: boolean;
    child?: string;
    min?: string;
    uiSchemaOptions?: any;
    disable?: boolean;
    options?: any;
    uioptions?: any;
    worker_type_id?: any;
}
export interface MainFormType {
    values: any;
    formSchema: any;
    initForm: (formSchema: FormSchemaType, values: any) => void;
    onClose: () => void;
    handleSubmit: (values: any) => void;
    isEdit?: boolean;
    isDisabled?: boolean;
}

export interface options {
    category: string;
    memory_mb: number;
    node_type_id: string;
    num_cores: number;
    label?: string;
}

export interface FormSchemaType {
    type?: string;
    label?: string;
    required?: boolean;
    show?: boolean;
    errormessage?: string;
    className?: string;
    uiSchema?: any;
    conditionalRender?: boolean;
    child?: string;
    min?: string;
    uiSchemaOptions?: any;
    disable?: boolean;
    options?: any;
    uioptions?: any;
    worker_type_id?: any;
}
export interface FormBuilderProps {
    formSchema: FormSchemaType;
    onClose: () => void;
    onSubmit: (values: any) => void;
    isEdit?: boolean;
    isDisabled?: boolean;
}

export interface FormSchemaType {
    type?: string;
    label?: string;
    required?: boolean;
    show?: boolean;
    errormessage?: string | undefined;
    className?: string;
    uiSchema?: any;
    conditionalRender?: boolean;
    child?: string;
    min?: string;
    uiSchemaOptions?: any;
    disable?: boolean;
    options?: any;
    uioptions?: any;
}
export interface GetFormElementsPropType {
    uniqueKey: string;
    elementName: string;
    formSchemaKey: FormSchemaType;
}
