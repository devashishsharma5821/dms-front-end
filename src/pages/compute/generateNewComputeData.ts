import { DmsComputeData } from '../../models/computeDetails';

export const newComputeData = (computedata: DmsComputeData[]) => {
    return computedata.map((compute: DmsComputeData) => {
        return {
            ...compute,
            totalMemory: Math.round((compute.resources.node_type.driver_memory_mb + compute.resources.node_type.worker_memory_mb) / 1000) + '  GB',
            totalCores: compute.resources.node_type.driver_num_cores + compute.resources.node_type.worker_num_cores
        };
    });
};

Math.round(0.9);
