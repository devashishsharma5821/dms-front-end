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
