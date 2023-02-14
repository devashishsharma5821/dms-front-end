import { DmsComputeData } from '../../models/computeDetails';

export const newComputeData = (computedata: DmsComputeData[]) => {
    return computedata.map((compute: DmsComputeData) => {
        return {
            ...compute,
            totalMemory: compute.resources.node_type.driver_memory_mb + compute.resources.node_type.worker_memory_mb,
            totalCores: compute.resources.node_type.driver_num_cores + compute.resources.node_type.worker_num_cores
        };
    });
};
