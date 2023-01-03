import React from 'react';
import { TextField, SelectField, FieldSwitch } from './Elements/FormElements';

function GetFormElements(props: any) {
    const getFormElement = (elementName: any, elementSchema: any) => {
        const props = {
            name: elementName,
            label: elementSchema.label,
            type: elementSchema.type,
            className: elementSchema.className,
            uioptions: elementSchema.uioptions,
            options: elementSchema.options,
            show: elementSchema.show,
            disable: elementSchema.disable,
            child: elementSchema.child
        };
        const container = [];

        if (elementSchema.child === 'child') {
            container.push(elementSchema);
            console.log('container', container);
        }

        if (elementSchema.type === 'text' || elementSchema.type === 'email' || elementSchema.type === 'number') {
            return <TextField {...props} />;
        }

        if (elementSchema.type === 'select') {
            return <SelectField {...props} />;
        }

        if (elementSchema.type === 'switch') {
            return <FieldSwitch {...props} />;
        }
    };

    return <>{getFormElement(props.keey, props.formSchemaKey)}</>;
}

export default GetFormElements;
