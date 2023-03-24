import { useState, useEffect, useContext } from 'react';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import MainForm from './Elements/MainForm';
import { CreateYupSchema } from './CreateYupSchema';
import { FormSchemaType, FormBuilderProps } from '../.././models/formBuilder';
import { ComputeContext } from '../../context/computeContext';

function FormBuilder({ formSchema, onClose, onSubmit, isEdit, isDisabled }: FormBuilderProps) {
    const [formData, setFormData] = useState<any>({});
    const [validationSchema, setValidationSchema] = useState({});
    const context = useContext(ComputeContext);

    useEffect(() => {
        initForm(formSchema);
    }, [formSchema]);

    const initForm = (formSchema: FormSchemaType, values?: any) => {
        if (values?.worker_type_id && !values.driver_type_id) {
            values.driver_type_id = values.worker_type_id;
        }
        const { _formData, _validationSchema } = CreateYupSchema(formSchema, values);
        isEdit ? setFormData(context.formData) : setFormData(_formData);

        setValidationSchema(Yup.object().shape({ ..._validationSchema }));
    };

    return (
        <div className="App">
            <Formik enableReinitialize initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
                {(props: FormikProps<any>) => <MainForm {...props} formSchema={formSchema} isEdit={isEdit} isDisabled={isDisabled} onClose={onClose} initForm={initForm}></MainForm>}
            </Formik>
        </div>
    );
}

export default FormBuilder;
