import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form as FormikForm, Field, ErrorMessage, useFormikContext, useFormik, FormikProps } from 'formik';
import { useApolloClient, DocumentNode } from '@apollo/client';
import GetFormElements from './GetFormElements';
import { Button } from '@chakra-ui/button';
import { SubmitButton, Form } from './Elements/FormElements';
import MainForm from './Elements/MainForm';
import { useToast } from '@chakra-ui/toast';
import { dmsCreateComputeOffEnableAutoscaling, dmsCreateComputeOnEnableAutoscaling, getComputeListData } from '../../query';
import { dmsCreateComputeResponse } from '../../models/dmsCreateComputeResponse';
import { ComputeDetail, ComputeDetailListResponse } from '../../models/computeDetails';
import useAppStore from '../../store';

function FormBuilder({ formSchema, onClose }: any) {
    const [formData, setFormData] = useState<any>({});
    const [validationSchema, setValidationSchema] = useState({});
    const [updateDmsComputeData] = useAppStore((state: any) => [state.updateDmsComputeData]);
    const [element, setElements] = useState(formSchema);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const client = useApolloClient();
    const toast = useToast();
    useEffect(() => {
        initForm(element);
    }, [element]);

    const initForm = (formSchema: any) => {
        let _formData: any = {};
        let _validationSchema: any = {};

        for (let key of Object.keys(formSchema)) {
            if (formSchema[key].type === 'switch') {
                _formData[key] = false;
            } else {
                _formData[key] = '';
            }
            if (formSchema[key].type === 'text') {
                _validationSchema[key] = Yup.string();
            } else if (formSchema[key].type === 'email') {
                _validationSchema[key] = Yup.string().email();
            } else if (formSchema[key].type === 'number') {
                _validationSchema[key] = Yup.number();
            } else if (formSchema[key].type === 'select') {
                _validationSchema[key] = Yup.string();
            } else if (formSchema[key].type === 'switch') {
            }
            if (formSchema[key].required) {
                _validationSchema[key] = _validationSchema[key].required(formSchema[key].errormessage);
                if (formSchema[key].min) {
                    _validationSchema[key] = _validationSchema[key].min(0, 'minimum 0');
                }
            }
            if (formSchema[key].yup) {
                _validationSchema[key] = formSchema[key].yup;
            }
        }

        setFormData(_formData);
        setValidationSchema(Yup.object().shape({ ..._validationSchema }));
    };

    const onSubmit = (values: any) => {
        let mutation: DocumentNode | null = null;
        if (!values.enable_autoscaling) {
            mutation = dmsCreateComputeOffEnableAutoscaling(values);
        } else {
            mutation = dmsCreateComputeOnEnableAutoscaling(values);
        }

        interface createCompute {
            dmsCreateCompute: string;
        }

        client
            .mutate<dmsCreateComputeResponse<createCompute>>({
                mutation: mutation
            })
            .then((response) => {
                setIsLoading(false);
                toast({
                    title: `Compute created successfully`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                const { GET_COMPUTELIST } = getComputeListData();
                client
                    .query<ComputeDetailListResponse<Array<ComputeDetail>>>({
                        query: GET_COMPUTELIST
                    })
                    .then((response) => {
                        let computedata = [...response.data.dmsComputes];
                        updateDmsComputeData(computedata);
                        //updateTransformersData(transformerdata)
                    })
                    .catch((err) => console.error(err));
                onClose();
            })
            .catch((err) => {
                toast({
                    title: `${err}`,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    };

    return (
        <div className="App">
            <Formik enableReinitialize initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
                {(props: FormikProps<any>) => <MainForm {...props} formSchema={formSchema} onClose={onClose}></MainForm>}
            </Formik>
        </div>
    );
}

export default FormBuilder;
