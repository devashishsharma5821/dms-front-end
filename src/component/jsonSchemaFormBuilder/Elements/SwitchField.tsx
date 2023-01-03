import { FieldHookConfig, useField } from 'formik';
import { Input, InputProps as ChakraInputProps, Switch } from '@chakra-ui/react';

// type Props = ChakraInputProps & FieldHookConfig<"input">;

const SwitchField = ({ ...props }: any) => {
    const [field] = useField(props.name);
    return <Switch {...field}></Switch>;
};

export default SwitchField;
