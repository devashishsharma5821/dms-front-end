import { TextField, SelectField, FieldSwitch } from './Elements/FormElements';
import { FormSchemaType, GetFormElementsPropType } from '../.././models/formBuilder';

function GetFormElements(props: GetFormElementsPropType) {
    console.log('props ===>', props);
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
            defaultValue: props.defaultValue
        };

        if (props.isEdit === true && elementSchema.isDefault === true) {
            return (
                <p>
                    {elementSchema.default_heading_value} {elementSchema.value}
                </p>
            );
        }

        if (elementSchema.type === 'text' || elementSchema.type === 'email' || elementSchema.type === 'number') {
            return <TextField {...fieldProps} />;
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
