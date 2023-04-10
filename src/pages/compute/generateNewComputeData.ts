import { DmsComputeData } from '../../models/computeDetails';

export const newComputeData = (computedata: DmsComputeData[]) => {
    return computedata?.map((compute: DmsComputeData) => {
        return {
            ...compute,
            status: compute.status === 'STARTING' ? 'STARTING' : compute.status,
            totalMemory: Math.round(compute.resources.node_type.total_memory_mb / 1024) + '  GB',
            totalCores: compute.resources.node_type.total_num_cores
        };
    });
};
