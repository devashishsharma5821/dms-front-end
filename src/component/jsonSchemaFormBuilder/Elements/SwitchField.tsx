import { FieldHookConfig, useField } from 'formik';
import { InputProps as ChakraInputProps, Switch } from '@chakra-ui/react';

type Props = ChakraInputProps & FieldHookConfig<'input'>;

const SwitchField = (props: any) => {
    const [field] = useField(props.name);
    return <Switch {...field} isChecked={field.value ? true : false} />;
};

export default SwitchField;
