import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { useField } from 'formik';

const Numbers = (props: any) => {
    const [field] = useField(props.name);
    console.log('lets check diable', props);
    return (
        <NumberInput defaultValue={props.defaultValue} min={props.min}>
            <NumberInputField
                width={props?.extraStyles?.inputWidth && props?.extraStyles?.inputWidth}
                {...props}
                {...field}
                disabled={props?.disable ? props.disable : false}
                required
                key={props?.uniqueKey}
            />
        </NumberInput>
    );
};

export default Numbers;

{
    /* <Input width={props?.extraStyles?.inputWidth && props?.extraStyles?.inputWidth} {...props} {...field} disabled={props?.disable ? props.disable : false} required key={props?.uniqueKey} />; */
}
