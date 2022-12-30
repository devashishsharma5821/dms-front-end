import React, { useContext } from 'react';
import { FormContext } from '../FormContext';
import { FormLabel, Select, Switch } from '@chakra-ui/react';

const FieldSwitch = (props: any) => {
    const { handleChange } = useContext(FormContext);
    return (
        <div className={props?.field_className && props.field_className}>
            <FormLabel>{props.field_label}</FormLabel>
            <Switch value={props.field_value} onChange={(event) => handleChange(props.field_id, event)}></Switch>
        </div>
    );
};

export default FieldSwitch;
