import React, { useContext } from 'react';
import { FormContext } from '../FormContext';
import { FormLabel, Select } from '@chakra-ui/react';

function FieldSelect(props: any) {
    const { handleChange } = useContext(FormContext);
    return (
        <div className={props.field_className && props.field_className}>
            <FormLabel>{props.field_label}</FormLabel>
            <Select value={props.field_value} onChange={(event) => handleChange(props.field_id, event)}>
                {props.field_options.length > 0 &&
                    props.field_options?.map((option: any) => {
                        return <option value={option}>{option}</option>;
                    })}
            </Select>
        </div>
    );
}

export default FieldSelect;
