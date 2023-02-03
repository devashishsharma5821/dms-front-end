export interface FormData {
    id: string;
    max_inactivity_min: number | null;
    compute_name: string;
    autoscale: boolean;
    workers: number | null;
    spot_instances: boolean;
    worker_type_id: string;
    driver_type_id: string;
    min_workers: number | null;
    max_workers: number | null;
    enable_autoscaling: boolean;
    terminate_after: boolean;
}
