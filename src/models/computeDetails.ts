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
    totalMemory?: number;
    totalCores?: number;
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
    node_types: any;
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
export class EditCompute<T> {
    dmsEditCompute!: T;
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

export type agGridClickHandler = (id: any, DmsComputeData?: any) => void;

export interface STOP_COMPUTE_RUNNING_MODALS_PROPS {
    computeId: string | undefined;
    isOpen: boolean;
    onClose: () => void;
}

export interface DELETE_COMPUTE_MODAL_PROPS {
    computeId: string | undefined;
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
            driver_memory_mb: number;
            worker_memory_mb: number;
            driver_num_cores: number;
            worker_num_cores: number;
        };
        spot_instances: boolean;
    };
    status: string;
    totalMemory?: number;
    totalCores?: number;
}

export interface getComputeListQueryData {
    data: { dmsComputes: DmsComputeData[] };
}

export interface GetComputeListResponse {
    data: {
        dmsComputes: Array<DmsComputeData>;
    };
}

export interface ExperimentAppStoreState {
    DmsComputeData: DmsComputeData[];
    UserConfig: any;
    connectionState: { connected: boolean; subscribed: boolean };
}

export interface SocketWrapperAppStoreState {
    DmsComputeData: DmsComputeData[];
    UserConfig: any;
    connectionState: { connected: boolean; subscribed: boolean };
    message: any;
}

export interface ComputeAppStoreState {
    DmsComputeData: DmsComputeData[];
    UserConfig: any;
    dbSettingsData: any;
}

export interface CreateComputeSubmitHandlerValues {
    compute_name: string;
    enable_autoscaling: boolean;
    max_inactivity_min: number;
    max_workers: number;
    min_workers: number;
    spot_instances: boolean;
    terminate_after: boolean;
    worker_type_id: string;
    driver_type_id: string;
    workers: number;
}

export interface DeleteComputeModalStoreState {
    updateDmsComputeData: (computeData: DmsComputeData[]) => void;
}
