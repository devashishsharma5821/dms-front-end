import { Switch } from '@chakra-ui/react';

export const SwitchComponent = (props: any) => {
    return <Switch id={'isDefault-' + props.params.rowIndex} />;
};

export default SwitchComponent;
