import React, { useEffect, useState } from 'react';
import jsonData from './jsonData.json';
import Element from './Element';
import { auto } from '@popperjs/core';
import { Button } from '@chakra-ui/button';
import { FormContext } from './FormContext';
import '../../styles/FormBuilderClasses.scss';

const JsonForm = () => {
    const [elements, setElements] = useState<any>(null);
    useEffect(() => {
        setElements(jsonData[0]);
        if (elements?.fields[6]?.field_id === 'Enable autoscaling') {
            if (elements?.fields[6]?.field_value === false) {
                elements.fields[2].field_show = true;
                elements.fields[3].field_show = false;
                elements.fields[4].field_show = false;
            } else {
                elements.fields[2].field_show = false;
                elements.fields[3].field_show = true;
                elements.fields[4].field_show = true;
            }
        }
        if (elements?.fields[7]?.field_id === 'Terminate after') {
            if (elements?.fields[7]?.field_value === false) {
                elements.fields[8].field_disabled = true;
            } else {
                elements.fields[8].field_disabled = false;
            }
        }
    }, [elements]);
    const { fields, page_label } = elements ?? {};

    const handleChange: any = (id: any, event: any) => {
        const newElements = { ...elements };
        newElements.fields.forEach((field: any) => {
            const { field_type, field_id } = field;
            if (id === field_id) {
                switch (field_type) {
                    case 'checkbox':
                        field['field_value'] = event.target.checked;
                        break;

                    default:
                        field['field_value'] = event.target.value;
                        break;
                }
            }
            setElements(newElements);
        });
    };

    const formSubmitHandler = (e: any) => {
        e.preventDefault();
        const createComputeData = {
            compute_name: elements.fields[0].field_value,
            worker_type_id: elements.fields[1].field_value,
            workers: elements.fields[2].field_value,
            min_workers: elements.fields[3].field_value,
            max_workers: elements.fields[4].field_value,
            spot_instances: elements.fields[5].field_value,
            enable_autoscaling: elements.fields[6].field_value,
            terminate_after: elements.fields[7].field_value,
            max_inactivity_min: elements.fields[8].field_value
        };
    };

    return (
        <FormContext.Provider value={{ handleChange }}>
            <div style={{ margin: auto }}>
                <div className="mainContainer">
                    <form onSubmit={formSubmitHandler}>
                        {fields ? fields.map((field: any, i: any) => <Element key={i} field={field} />) : null}
                        <Button colorScheme="blue" type="submit">
                            Create
                        </Button>
                    </form>
                </div>
            </div>
        </FormContext.Provider>
    );
};

export default JsonForm;
