import React from 'react';
import FieldInput from './elements/FieldInput';
import FieldSelect from './elements/FieldSelect';
import FieldSwitch from './elements/FieldSwitch';
const Element = ({ field: { field_type, field_id, field_label, field_placeholder, field_value, field_options, field_show, field_disabled, field_className, field_required } }: any) => {
    switch (field_type) {
        case 'text':
            return (
                <FieldInput
                    field_type={field_type}
                    field_id={field_id}
                    field_label={field_label}
                    field_placeholder={field_placeholder}
                    field_value={field_value}
                    field_show={field_show}
                    field_className={field_className}
                    field_required={field_required}
                />
            );
        case 'number':
            return (
                <FieldInput
                    field_type={field_type}
                    field_id={field_id}
                    field_label={field_label}
                    field_placeholder={field_placeholder}
                    field_value={field_value}
                    field_show={field_show}
                    field_disabled={field_disabled}
                    field_className={field_className}
                    field_required={field_required}
                />
            );
        case 'select':
            return (
                <FieldSelect
                    field_id={field_id}
                    field_label={field_label}
                    field_placeholder={field_placeholder}
                    field_value={field_value}
                    field_options={field_options}
                    field_className={field_className}
                />
            );
        case 'checkbox':
            return <FieldSwitch field_id={field_id} field_label={field_label} field_value={field_value} field_className={field_className} />;

        default:
            return null;
    }
};

export default Element;
