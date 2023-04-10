export interface FieldPropsType extends FormSchemaType {
    name: string;
    extraStyles?: any;
    uniqueKey?: string;
    // as?: string;
}

export interface FormSchemaKey {
    [key: string]: FormSchemaType;
}

export interface FormSchemaType {
    type?: string;
    label?: string;
    required?: boolean;
    show?: boolean;
    isDefaultValue?: boolean;
    defaultValue?: any;
    errormessage?: string;
    className?: string;
    uiSchema?: any;
    conditionalRender?: boolean;
    child?: string;
    min?: number;
    uiSchemaOptions?: any;
    disable?: boolean;
    options?: any;
    // uioptions?: any;
    // driver_type_id: any;
    extraStyles?: any;
    // worker_type_id?: any;
    value?: any;
    wrapper?: any;
    msg?: any;
}
export interface MainFormType {
    values: any;
    formSchema: FormSchemaKey;
    initForm: (formSchema: FormSchemaKey, values: any) => void;
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

export interface FormBuilderProps {
    formSchema: FormSchemaKey;
    onClose: () => void;
    onSubmit: (values: any) => void;
    isEdit?: boolean;
    isDisabled?: boolean;
}

export interface GetFormElementsPropType {
    uniqueKey: string;
    elementName: string;
    formSchemaKey: FormSchemaType;
    defaultValue: any;
    isEdit: boolean | undefined;
}
