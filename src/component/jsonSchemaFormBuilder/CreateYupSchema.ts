import * as Yup from 'yup';

export const CreateYupSchema = (formSchema: any, values: any) => {
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
            if (formSchema[key].min) {
                _validationSchema[key] = _validationSchema[key].min(0);
            }
            _validationSchema[key] = _validationSchema[key].required(formSchema[key].errormessage);
        }

        if (formSchema[key].lessThan) {
            _validationSchema[key] = _validationSchema[key].lessThan(Yup.ref(formSchema[key].ref), formSchema[key].msg);
        }

        if (formSchema[key].moreThan) {
            _validationSchema[key] = _validationSchema[key].moreThan(Yup.ref(formSchema[key].ref), formSchema[key].msg);
        }

        if (formSchema[key].yup) {
            _validationSchema[key] = formSchema[key].yup;
        }
    }
    return { _formData, _validationSchema };
};
