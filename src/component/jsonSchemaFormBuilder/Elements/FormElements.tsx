import React, { useContext } from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage, useFormikContext, FormikProps } from 'formik';
import { FormLabel, Input, Select, Button, Switch } from '@chakra-ui/react';
import { FormContext } from '../../jsonSchemaBuilder/FormContext';
import InputField from './InputField';
import SelectFieldChakra from './SelectField';
import SwitchField from './SwitchField';

export function Form(props: any) {
    return (
        <Formik {...props}>
            <form className="needs-validation">{props.children}</form>
        </Formik>
    );
}

export function TextField(props: any) {
    console.log('props', props.show);
    if (!props.show) {
        return <></>;
    }

    return (
        <div className={props?.className && props.className}>
            <FormLabel htmlFor={props.name} style={props.uioptions?.label} className={props.className + '_' + props.label}>
                {props.label}
            </FormLabel>
            <InputField {...props}></InputField>
            <ErrorMessage name={props.name} render={(msg) => <div style={{ color: 'red' }}>{msg}</div>} />
        </div>
    );
}

export function SelectField(props: any) {
    const { name, label, uioptions, options } = props;
    return (
        <div className={props?.className && props.className}>
            {label && <label htmlFor={name}>{label}</label>}
            <SelectFieldChakra as="select" id={name} name={name} style={uioptions?.select}>
                <option value="">Choose...</option>
                {options.map((optn: any, index: any) => (
                    <option key={index} value={optn.node_type_id} label={optn.label || optn.node_type_id} />
                ))}
            </SelectFieldChakra>
            <ErrorMessage name={name} render={(msg) => <div style={{ color: 'red' }}>{msg}</div>} />
        </div>
    );
}

export const FieldSwitch = (props: any) => {
    const { name, label, uioptions } = props;
    const { handleChange } = useContext(FormContext);
    return (
        <div className={props?.className && props.className}>
            {label && <FormLabel style={uioptions?.label}>{label}</FormLabel>}
            {/* <Switch value={props.field_value} onChange={(event) => handleChange(props.field_id, event)}></Switch> */}
            <SwitchField {...props}></SwitchField>
        </div>
    );
};

export function SubmitButton(props: any) {
    const { title, ...rest } = props;

    return (
        <Button type="submit" {...rest}>
            {title}
        </Button>
    );
}
