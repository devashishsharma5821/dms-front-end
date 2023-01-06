import { FieldHookConfig, useField } from 'formik';
import { Input, InputProps as ChakraInputProps } from '@chakra-ui/react';

// type Props = ChakraInputProps & FieldHookConfig<"input">;

const InputField = ({ ...props }: any) => {
    const [field] = useField(props.name);
    console.log('props disable', props, field);
    return <Input {...props} {...field} value={props.value} disabled={props?.disable ? props.disable : false} />;
};

export default InputField;
