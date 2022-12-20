import { Switch } from "@chakra-ui/react";
import { useState } from "react";


export const SwitchComponent = (props:any) => {
    //const [isDefault, setDefault] = useState<boolean>();
    const defaultChange = ()=>{
        //setDefault(!isDefault);
    }
       // setDefault(props.params.data.default);
        return (
            <Switch id={'isDefault-'+ props.params.rowIndex} />
        )
}

export default SwitchComponent;