import { useField, FieldHookConfig } from 'formik';
import { Input, InputProps as ChakraInputProps } from '@chakra-ui/react';
import { InputFieldType } from '../../../models/formBuilder';

type Props = ChakraInputProps & FieldHookConfig<'input'>;

const InputField = (props: InputFieldType<Props>) => {
    const [field] = useField(props.name);
    return <Input {...props} {...field} disabled={props?.disable ? props.disable : false} key={props?.uniqueKey} />;
};

export default InputField;
