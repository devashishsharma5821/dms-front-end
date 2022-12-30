import React, { useContext, useState } from 'react';
import { FormContext } from '../FormContext';
import { FormLabel, Input } from '@chakra-ui/react';

function FieldInput(props: any) {
    const { handleChange } = useContext(FormContext);
    return (
        <div className={props?.field_className && props.field_className}>
            {props?.field_show && (
                <>
                    <FormLabel>{props.field_label}</FormLabel>
                    <Input
                        type={props.field_type}
                        name={props.field_name}
                        isRequired={props.field_required ? props.field_required : false}
                        disabled={props?.field_disabled ? props.field_disabled : false}
                        id={props.field_id}
                        value={props.field_value}
                        onChange={(event) => handleChange(props.field_id, event)}
                    />
                </>
            )}
        </div>
    );
}

export default FieldInput;
