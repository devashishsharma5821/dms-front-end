import { useField, FieldHookConfig } from 'formik';
import { Input, InputProps as ChakraInputProps } from '@chakra-ui/react';
import { FieldPropsType } from '../../../models/formBuilder';

// type Props = ChakraInputProps & FieldHookConfig<'input'>;

const InputField = (props: FieldPropsType) => {
    const [field] = useField(props.name);
    return <Input width={props?.extraStyles?.inputWidth && props?.extraStyles?.inputWidth} {...props} {...field} disabled={props?.disable ? props.disable : false} required key={props?.uniqueKey} />;
};

export default InputField;
