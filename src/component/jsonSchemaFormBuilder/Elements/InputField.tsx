import { FieldHookConfig, useField } from 'formik';
import { Input, InputProps as ChakraInputProps } from '@chakra-ui/react';

// type Props = ChakraInputProps & FieldHookConfig<"input">;

const InputField = ({ ...props }: any) => {
    const [field] = useField(props.name);
    console.log('props disable', props.disable);
    return <Input {...props} {...field} disabled={props?.disable ? props.disable : false} />;
};

export default InputField;
