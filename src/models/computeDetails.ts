export class ComputeDetail {
    id!: string;
    name!: string;
    resources!: Resource;
    max_inactivity_min!: number;
    cluster_policy_id!: any;
    status!: string;
    created_by!: string;
    created_at!: string;
    is_default!: boolean;
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

export class RunComputeDetail {
    job_id!: string;
    job_run_id!: string;
}

export class DeleteComputeDetail {
    dmsDeleteCompute!: boolean;
}

export class StopComputeDetail {
    dmsCancelComputeRun!: boolean;
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

export class ComputeDetailListResponse<T> {
    dmsComputes!: T;
}

export class ComputeRun<T> {
    dmsRunCompute!: T;
}

export class ComputeDelete<T> {
    dmsDeleteCompute!: T;
}

export class ComputeStop<T> {
    dmsStopComputeRun!: T;
}

export class GetDbSettingsType<T> {
    dmsDatabricksSettings!: T;
}

export type agGridClickHandler = (cellId: string | undefined) => void;

export interface STOP_COMPUTE_RUNNING_MODALS_PROPS {
    cellId: string | undefined;
    isOpen: boolean;
    onClose: () => void;
}

export interface DELETE_COMPUTE_MODAL_PROPS {
    cellId: string | undefined;
    isOpen: boolean;
    onClose: () => void;
}

export interface createCompute {
    dmsCreateCompute: string;
}

export interface DmsComputeData {
    cluster_policy_id?: string;
    created_at: string;
    created_by: string;
    id: string;
    is_default: boolean;
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

export interface ExperimentAppStoreState {
    updateDmsDatabricksCredentialsValidToken: (token: boolean) => void;
    DmsDatabricksCredentialsValidToken: boolean;
    DmsComputeData: DmsComputeData[];
    updateDmsComputeData: (computeData: any) => void;
    submitMessage?: any;
    UserConfig: any;
    config: any;
    message: any;
}
