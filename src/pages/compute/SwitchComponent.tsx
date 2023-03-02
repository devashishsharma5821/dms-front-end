import { Switch } from '@chakra-ui/react';

export const SwitchComponent = (props: any) => {
    const onChangeSwitch = (event: any, params: any) => {
        props.gridRef.current!.api.recomputeAggregates();
        props.defaultRowOnChange(event, params);
    };
    if (props.params.data.is_default) {
        return (
            <Switch
                id={'isDefault-' + props.params.rowIndex}
                onChange={(event: any) => {
                    onChangeSwitch(event, props.params);
                }}
                isChecked={props.params.data.is_default}
            />
        );
    } else {
        return (
            <Switch
                id={'isDefault-' + props.params.rowIndex}
                onChange={(event: any) => {
                    onChangeSwitch(event, props.params);
                }}
            />
        );
    }
};

export default SwitchComponent;
