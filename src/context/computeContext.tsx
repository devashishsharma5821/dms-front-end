import React, { useState } from 'react';
import { createContext } from 'react';

export const ComputeContext = createContext<any>({
    data: {
        id: '',
        max_inactivity_min: null,
        name: '',
        autoscale: false,
        num_workers: null,
        spot_instances: false,
        worker_type_id: '',
        min_workers: null,
        max_workers: null
    },
    updateFormData: (data: any) => {}
});

export const ContextCompute = (props: any) => {
    const [formData, setFormData] = useState<any>({
        id: '',
        max_inactivity_min: null,
        name: '',
        autoscale: false,
        num_workers: null,
        spot_instances: false,
        worker_type_id: '',
        min_workers: null,
        max_workers: null
    });
    const updateFormData = (data: any) => {
        setFormData({
            id: data.id,
            max_inactivity_min: data?.max_inactivity_min,
            name: data.name,
            autoscale: data.autoscale,
            num_workers: data?.num_workers,
            spot_instances: data.spot_instances,
            worker_type_id: data.worker_type_id,
            min_workers: data?.min_workers,
            max_workers: data?.max_workers
        });
    };

    return <ComputeContext.Provider value={{ formData: formData, updateFormData }}>{props.children}</ComputeContext.Provider>;
};
