import { TextField, SelectField, FieldSwitch } from './Elements/FormElements';
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
            uiSchemaOptions: elementSchema.uiSchemaOptions,
            uniqueKey: props.uniqueKey
        };

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
