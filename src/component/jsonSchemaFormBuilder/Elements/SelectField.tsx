import { FieldHookConfig, useField } from 'formik';
import { Input, InputProps as ChakraInputProps, Select } from '@chakra-ui/react';

// type Props = ChakraInputProps & FieldHookConfig<"input">;

const SelectField = ({ ...props }: any) => {
    const { name, label, uioptions, options } = props;
    const [field] = useField(name);
    return <Input {...props} {...field} />;
};

export default SelectField;
