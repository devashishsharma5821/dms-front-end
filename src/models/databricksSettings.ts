
export interface Stats {
    used_count: number;
    idle_count: number;
    pending_used_count: number;
    pending_idle_count: number;
}

export interface DatabricksInstancePool {
    instance_pool_id: string;
    instance_pool_name: string;
    min_idle_instances: number;
    max_capacity: number;
    node_type_id: string;
    stats: Stats;
}

export interface DatabricksSparkVersion {
    key: string;
    name: string;
}

export interface DmsDatabricksSettings {
    databricks_instance_pools: DatabricksInstancePool[];
    databricks_spark_versions: DatabricksSparkVersion[];
}

export interface DatabricksSettingsResponse {
    dmsDatabricksSettings: DmsDatabricksSettings;
}

export interface DatabricksCredentailsResponse {
    dmsCheckDatabricksCredentials: DatabricksCredentails;
}

export interface PidStatusResponse {
    dmsIsPIDRunning: boolean;
}

export interface DatabricksCredentails {
    defined: boolean;
    valid: boolean;
}
