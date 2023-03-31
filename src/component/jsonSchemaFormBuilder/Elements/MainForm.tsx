import { useEffect } from 'react';
import GetFormElements from '../GetFormElements';
import '../../../styles/FormBuilderClasses.scss';
import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { MainFormType } from '../../../models/formBuilder';
import { Spinner } from '@chakra-ui/react';

const MainForm = ({ values, formSchema, initForm, handleSubmit, onClose, isEdit, isDisabled }: MainFormType) => {
    useEffect(() => {
        if (values?.enable_autoscaling === false || values?.enable_autoscaling === undefined) {
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
            formSchema['max_inactivity_min'].required = false;
        } else {
            formSchema['max_inactivity_min'].disable = false;
            formSchema['max_inactivity_min'].required = true;
        }

        if (values?.computeId) {
            formSchema['compute_id'].value = values.computeId;
        }

        if (values?.workers) {
            formSchema['workers'].defaultValue = values.workers;
        }

        if (values?.max_workers) {
            formSchema['max_workers'].defaultValue = values.max_workers;
        }
        if (values?.min_workers) {
            formSchema['min_workers'].defaultValue = values.min_workers;
        }
        if (values?.max_inactivity_min) {
            formSchema['max_inactivity_min'].defaultValue = values.max_inactivity_min;
        }

        if (values.worker_type_id && isEdit) {
            formSchema['worker_type_id'].defaultValue = values.worker_type_id;
        }

        if (values.driver_type_id && isEdit) {
            formSchema['driver_type_id'].defaultValue = values.driver_type_id;
        }
        initForm(formSchema, values);
    }, [values]);

    return (
        <form className="needs-validation" onSubmit={handleSubmit}>
            {Object.keys(formSchema).map((key, idx) => {
                return <GetFormElements uniqueKey={`${key}_${idx}`} elementName={key} formSchemaKey={formSchema[key]} defaultValue={formSchema[key].defaultValue} isEdit={isEdit} />;
            })}
            <Box borderTop={'1px solid #EAEAEA'} pt={'10px'} className="main-container">
                <Button type="button" variant="outline" colorScheme="blue" className="cancel-button" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="solid" colorScheme="blue" isDisabled={isDisabled}>
                    {!isDisabled ? isEdit ? 'Edit' : 'Create' : <Spinner />}
                </Button>
            </Box>
        </form>
    );
};

export default MainForm;
