import { ErrorMessage } from 'formik';
import { FormControl, FormLabel } from '@chakra-ui/react';
import InputField from './InputField';
import SwitchField from './SwitchField';
import { FieldPropsType } from '../../../models/formBuilder';
import { options } from '../../../models/formBuilder';

export function TextField(props: FieldPropsType) {
    if (!props.show) {
        return <></>;
    }

    return (
        <FormControl isRequired className={props?.className && props.className} style={props.uiSchema} key={props?.uniqueKey}>
            <FormLabel htmlFor={props.name} style={props?.uiSchemaOptions?.label ? props.uiSchemaOptions.label : {}} className={props.className + '_' + props.label}>
                {props.label}
            </FormLabel>
            <InputField {...props} />
            <ErrorMessage name={props.name} render={(msg) => <div className="schemaErrorMessage">{msg}</div>} />
        </FormControl>
    );
}

export function SelectField(props: FieldPropsType) {
    const { name, label, options, uiSchema, uiSchemaOptions, className, defaultValue } = props;
    return (
        <FormControl className={className} style={uiSchema}>
            {label && (
                <label htmlFor={name} style={uiSchemaOptions?.label ? uiSchemaOptions.label : {}}>
                    {label}
                </label>
            )}
            <InputField as="select" {...props}>
                <option value="">{defaultValue}</option>
                {options.map((optn: options, index: string) => {
                    return (
                        <option
                            key={index}
                            value={optn.node_type_id}
                            label={optn.label || `${optn.node_type_id} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ${optn.memory_mb / 1024} GB Memory, ${optn.num_cores} Cores`}
                        />
                    );
                })}
            </InputField>
            <ErrorMessage name={name} render={(msg) => <div className="schemaErrorMessage">{msg}</div>} />
        </FormControl>
    );
}

export const FieldSwitch = (props: FieldPropsType) => {
    return (
        <FormControl className={props?.className && props.className} style={props.uiSchema}>
            {props.label && <FormLabel style={props?.uiSchemaOptions?.label && props.uiSchemaOptions.label}>{props.label}</FormLabel>}
            <SwitchField {...props} />
        </FormControl>
    );
};
