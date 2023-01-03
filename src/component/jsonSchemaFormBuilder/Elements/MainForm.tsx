import React, { useEffect } from 'react';
import GetFormElements from '../GetFormElements';
import { SubmitButton } from './FormElements';
import '../../../styles/FormBuilderClasses.scss';
import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';

const MainForm = (props: any) => {
    useEffect(() => {
        if (props?.values?.enable_autoscaling === false || props?.values?.enable_autoscaling === undefined) {
            props.formSchema['min_workers'].show = false;
            props.formSchema['max_workers'].show = false;
            props.formSchema['workers'].show = true;
        } else {
            props.formSchema['min_workers'].show = true;
            props.formSchema['max_workers'].show = true;
            props.formSchema['workers'].show = false;
        }
        if (props?.values?.terminate_after === false || props?.values?.terminate_after === undefined) {
            props.formSchema['max_inactivity_min'].disable = true;
        } else {
            props.formSchema['max_inactivity_min'].disable = false;
        }
    }, [props?.values]);

    return (
        <form className="needs-validation" onSubmit={props.handleSubmit}>
            {Object.keys(props.formSchema).map((key, ind) => (
                <GetFormElements keey={key} formSchemaKey={props.formSchema[key]} />
            ))}
            <Box className="main-container">
                <Button type="button" variant="outline" colorScheme="blue" className="cancel-button" onClick={props.onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="solid" colorScheme="blue">
                    Create
                </Button>
            </Box>
        </form>
    );
};

export default MainForm;
