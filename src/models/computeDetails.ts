export class ComputeDetail{
        id!: string;
        name!: string;
        resources!: Resource;
        max_inactivity_min!: number;
        cluster_policy_id!: any;
        status!: string;
        created_by!: string;
        created_at!: string;
}

export class Resource{
    instance_pool!: any;
    node_type!: nodeType;
    autoscale!: any;
    num_workers!: number;
    spot_instances!: false
}

export class nodeType{
    worker_type_id!: string;
    driver_type_id!: any
}

export class ComputeDetailListResponse<T>{
    dmsComputes!: T;
}