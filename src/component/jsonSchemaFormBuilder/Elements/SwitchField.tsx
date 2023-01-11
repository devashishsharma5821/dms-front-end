import { FieldHookConfig, useField } from 'formik';
import { InputProps as ChakraInputProps, Switch } from '@chakra-ui/react';

type Props = ChakraInputProps & FieldHookConfig<'input'>;

const SwitchField = (props: Props) => {
    const [field] = useField(props.name);
    return <Switch {...field} />;
};

export default SwitchField;
