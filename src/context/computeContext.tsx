import React, { useState } from 'react';
import { createContext } from 'react';
import { FormData } from '../models/context';

export const ComputeContext = createContext<any>({
    data: {
        id: '',
        max_inactivity_min: null,
        compute_name: '',
        autoscale: false,
        workers: null,
        spot_instances: false,
        worker_type_id: '',
        driver_type_id: '',
        min_workers: null,
        max_workers: null,
        enable_autoscaling: false,
        terminate_after: false
    },
    updateFormData: (data: FormData) => {}
});

export const ContextCompute = (props: React.PropsWithChildren) => {
    const [formData, setFormData] = useState<FormData>({
        id: '',
        max_inactivity_min: null,
        compute_name: '',
        autoscale: false,
        workers: null,
        spot_instances: false,
        worker_type_id: '',
        driver_type_id: '',
        min_workers: null,
        max_workers: null,
        enable_autoscaling: false,
        terminate_after: false
    });
    const updateFormData = (data: FormData) => {
        setFormData({
            id: data.id,
            max_inactivity_min: data?.max_inactivity_min,
            compute_name: data.compute_name,
            autoscale: data.autoscale,
            workers: data?.workers,
            spot_instances: data.spot_instances,
            worker_type_id: data.worker_type_id,
            driver_type_id: data.driver_type_id,
            min_workers: data?.min_workers,
            max_workers: data?.max_workers,
            enable_autoscaling: data?.enable_autoscaling,
            terminate_after: data?.terminate_after
        });
    };

    return <ComputeContext.Provider value={{ formData: formData, updateFormData }}>{props.children}</ComputeContext.Provider>;
};
