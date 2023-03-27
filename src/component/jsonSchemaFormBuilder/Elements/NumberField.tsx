import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { useField } from 'formik';

const Numbers = (props: any) => {
    const [field] = useField(props?.name);

    return (
        <NumberInput defaultValue={props.defaultValue} min={props.min}>
            <NumberInputField
                width={props?.extraStyles?.inputWidth && props?.extraStyles?.inputWidth}
                {...props}
                {...field}
                disabled={props?.disable ? props.disable : false}
                required
                key={props?.uniqueKey}
                style={props?.uiSchemaOptions?.input && props.uiSchemaOptions.input}
            />
        </NumberInput>
    );
};

export default Numbers;
