import * as Yup from 'yup';

export const CreateYupSchema = (formSchema: any, values: any) => {
    let _formData: any = {};
    let _validationSchema: any = {};
    const setDefaultValue = (key: string) => {
        if (formSchema[key]?.defaultValue !== undefined && formSchema[key]?.defaultValue !== null) {
            _formData[key] = formSchema[key].defaultValue;
        } else {
            if (formSchema[key].type !== 'switch') {
                _formData[key] = '';
            } else {
                _formData[key] = false;
            }
        }
    };

    for (let key of Object.keys(formSchema)) {
        setDefaultValue(key);
        if (formSchema[key].type === 'text' || formSchema[key].type === 'select') {
            _validationSchema[key] = Yup.string();
        } else if (formSchema[key].type === 'email') {
            _validationSchema[key] = Yup.string().email();
        } else if (formSchema[key].type === 'number') {
            _validationSchema[key] = Yup.number();
        }
        if (formSchema[key].required) {
            // if (formSchema[key].min) {
            //     _validationSchema[key] = _validationSchema[key].min(formSchema[key].min);
            // }
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
