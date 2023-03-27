import { TextField, SelectField, FieldSwitch, NumberField } from './Elements/FormElements';
import { FormSchemaType, GetFormElementsPropType } from '../.././models/formBuilder';

function GetFormElements(props: GetFormElementsPropType) {
    const getFormElement = (elementName: string, elementSchema: FormSchemaType) => {
        const fieldProps = {
            name: elementName,
            label: elementSchema.label,
            type: elementSchema.type,
            className: elementSchema.className,
            uioptions: elementSchema.uioptions,
            options: elementSchema.options,
            show: elementSchema.show,
            disable: elementSchema.disable,
            child: elementSchema.child,
            uiSchema: elementSchema.uiSchema,
            extraStyles: elementSchema.extraStyles,
            uiSchemaOptions: elementSchema.uiSchemaOptions,
            uniqueKey: props.uniqueKey,
            defaultValue: props.defaultValue,
            min: elementSchema.min,
            wrapper: elementSchema.wrapper
        };

        if (props.isEdit === true && elementSchema.isDefault === true) {
            return (
                <p>
                    {elementSchema.default_heading_value} {elementSchema.value}
                </p>
            );
        }

        if (elementSchema.type === 'text' || elementSchema.type === 'email') {
            return <TextField {...fieldProps} />;
        }

        if (elementSchema.type === 'number') {
            return <NumberField {...fieldProps} />;
        }

        if (elementSchema.type === 'select') {
            return <SelectField {...fieldProps} />;
        }

        if (elementSchema.type === 'switch') {
            return <FieldSwitch {...fieldProps} />;
        }
    };

    return <>{getFormElement(props.elementName, props.formSchemaKey)}</>;
}

export default GetFormElements;
