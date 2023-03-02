import { useField, FieldHookConfig } from 'formik';
import { Input, InputProps as ChakraInputProps } from '@chakra-ui/react';
import { InputFieldType } from '../../../models/formBuilder';

type Props = ChakraInputProps & FieldHookConfig<'input'>;

const InputField = (props: InputFieldType<Props>) => {
    const [field] = useField(props.name);
    console.log('Props', props)
    return <Input width={props?.extraStyles?.inputWidth && props?.extraStyles?.inputWidth} {...props} {...field} disabled={props?.disable ? props.disable : false} required key={props?.uniqueKey} />;
};

export default InputField;
