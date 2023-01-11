import { useEffect } from 'react';
import GetFormElements from '../GetFormElements';
import '../../../styles/FormBuilderClasses.scss';
import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { MainFormType } from '../../../models/formBuilder';

const MainForm = ({ values, formSchema, initForm, handleSubmit, onClose }: MainFormType) => {
    useEffect(() => {
        if (values?.enable_autoscaling === false || values?.enable_autoscaling === undefined) {
            // const fieldKeys = Object.keys(props.formSchema);
            // const final = fieldKeys.filter((data: any) => {
            //     return props.formSchema[data].conditionalRender == true;
            // });
            // console.log('fieldKeys are ====>', final);

            formSchema['min_workers'].show = false;
            formSchema['max_workers'].show = false;
            formSchema['min_workers'].required = false;
            formSchema['max_workers'].required = false;
            formSchema['workers'].show = true;
            formSchema['workers'].required = true;
        } else {
            formSchema['min_workers'].show = true;
            formSchema['max_workers'].show = true;
            formSchema['workers'].show = false;
            formSchema['workers'].required = false;
            formSchema['min_workers'].required = true;
            formSchema['max_workers'].required = true;
        }
        if (values?.terminate_after === false || values?.terminate_after === undefined) {
            formSchema['max_inactivity_min'].disable = true;
        } else {
            formSchema['max_inactivity_min'].disable = false;
        }
        initForm(formSchema, values);
    }, [values]);

    return (
        <form className="needs-validation" onSubmit={handleSubmit}>
            {Object.keys(formSchema).map((key, idx) => {
                return <GetFormElements uniqueKey={`${key}_${idx}`} elementName={key} formSchemaKey={formSchema[key]} />;
            })}
            <Box className="main-container">
                <Button type="button" variant="outline" colorScheme="blue" className="cancel-button" onClick={onClose}>
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
