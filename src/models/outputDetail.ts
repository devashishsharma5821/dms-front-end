export class OutputDetail {
    id!: string;
    name!: string;
    created_at!: string;
    resources_num_workers!: string;
    activeMemory!: any;
    actionsRow!: string;

}

export interface InstancePoolsType {
    instance_pool_id: string;
    instance_pool_name: string;
    max_capacity: number;
    min_idle_instances: number;
    node_type_id: string;
    stats: {
        idle_count: number;
        pending_idle_count: number;
        pending_used_count: number;
        used_count: number;
    };
}

export interface NodeTypesType {
    category: string;
    memory_mb: number;
    node_type_id: string;
    num_cores: number;
}
export interface DbSettingsDetail {
    cluster_policies?: [];
    instance_pools: InstancePoolsType[];
    node_types: NodeTypesType[];
}

export class RunOutputDetail {
    job_id!: string;
    job_run_id!: string;
}


export class Resource {
    instance_pool!: any;
    node_type!: nodeType;
    autoscale!: any;
    num_workers!: number;
    spot_instances!: false;
}

export class nodeType {
    worker_type_id!: string;
    driver_type_id!: any;
}

export class OutputDetailListResponse<T> {
    dmsComputes!: T;
}


export class GetDbSettingsType<T> {
    dmsDatabricksSettings!: T;
}

export type agGridClickHandler = (cellId: string | undefined) => void;

export interface DmsOutputData {
    created_by: string;
    id: string;
    max_inactivity_min: number;
    name: string;
    resources: {
        autoscale?: boolean;
        instance_pool?: boolean;
        num_workers: number;
        node_type: {
            driver_type_id: string;
            worker_type_id: string;
        };
        spot_instances: boolean;
    };
    status: string;
}

