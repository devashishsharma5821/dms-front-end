import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import MainForm from './Elements/MainForm';
import { CreateYupSchema } from './CreateYupSchema';
import { FormSchemaType, FormBuilderProps } from '../.././models/formBuilder';

function FormBuilder({ formSchema, onClose, onSubmit }: FormBuilderProps) {
    const [formData, setFormData] = useState<any>({});
    const [validationSchema, setValidationSchema] = useState({});

    useEffect(() => {
        initForm(formSchema);
    }, [formSchema]);

    const initForm = (formSchema: FormSchemaType, values?: any) => {
        const { _formData, _validationSchema } = CreateYupSchema(formSchema, values);

        setFormData(_formData);
        setValidationSchema(Yup.object().shape({ ..._validationSchema }));
    };

    return (
        <div className="App">
            <Formik enableReinitialize initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
                {(props: FormikProps<any>) => <MainForm {...props} formSchema={formSchema} onClose={onClose} initForm={initForm}></MainForm>}
            </Formik>
        </div>
    );
}

export default FormBuilder;
