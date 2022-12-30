import { dmsCreateComputeOffEnableAutoscalingValues, dmsCreateComputeOnEnableAutoscalingValues } from '../models/types';
import { dmsCreateComputeCommonEnableAutoscalingValues } from '../models/types';
import { gql } from '@apollo/client';
import { wsconnect } from './socket';
export { wsconnect };
export const getUserConfig = () => {
    const GET_USER_CONFIGURATION = gql`
        query getUserConfiguration {
            userConfiguration {
                user {
                    userId
                    firstName
                    lastName
                    email
                    locale
                    defaultApp
                    appAlerts
                    espUserToken
                    applications {
                        applicationId
                        applicationName
                        configJson
                        i18n
                    }
                }
                error
            }
        }
    `;

    return { GET_USER_CONFIGURATION };
};

export const getTransformersData = () => {
    const GET_TRANSFORMERS = gql`
        query get_transformers {
            dmsTransformers {
                id
                name
                description
                documentation
                category
                icon
                schema {
                    uiSchema
                    jsonSchema
                    hasMacros
                    outputMacros {
                        location
                        outputId
                    }
                }
                inputs {
                    id
                    name
                    type
                    isRequired
                }
                outputs {
                    id
                    name
                    type
                    isExported
                }
            }
        }
    `;
    return { GET_TRANSFORMERS };
};

export const GET_DATABRICKS_CREDS = gql`
    query {
        dmsCheckDatabricksCredentials {
            defined
            valid
        }
    }
`;

export const GET_DMS_COMPUTE_STATUS = gql`
    query {
        dmsComputes {
            status
            id
            name
            resources {
                num_workers
                spot_instances
            }
            is_default
        }
    }
`;
// return { GET_TRANSFORMERS };

export const setSettingsData = (userName: string, token: string) => {
    return gql`
    mutation
         {   dmsSetDatabricksCredentials(  
               databricks_token: "${token}"  
               databricks_username: "${userName}" 
                  ) } 
        `;
};

// export const dmsCreateCompute = (values: any) => {
//     return gql`
//                         mutation {
//                             dmsCreateCompute(
//                                 name: "${values.compute_name}",
//                                 resources:{
//                                 node_type: {
//                                     worker_type_id: "${values.worker_type_id}"
//                                     },
//                                     num_workers: ${!values.enableAutoScaling ? values.workers : 0} ,
//                                     spot_instances: ${values.spot_instances},
//                                     autoscale:
//                                         ${
//                                             values.enableAutoScaling
//                                                 ? `{
//                                             min_workers: ${values.min_workers},
//                                             max_workers: ${values.max_workers}}`
//                                                 : null
//                                         }

//                                 } ,
//                                 max_inactivity_min: ${values.terminate_after ? values.max_inactivity_min : 0}
//                                 )
//                         }
//                         `;
// };

export const dmsCreateComputeOffEnableAutoscaling = (values: dmsCreateComputeOffEnableAutoscalingValues) => {
    return gql`mutation {
                        dmsCreateCompute(
                          name: "${values.compute_name}",
                          resources: {
                            node_type: {
                                worker_type_id: "${values.worker_type_id}"
                            },
                            spot_instances: ${values.spot_instances},
                            num_workers: ${values.workers}
                            
                        },
                          max_inactivity_min: ${values.terminate_after ? values.max_inactivity_min : 0},
                        )
                      }
                      `;
};

export const dmsCreateComputeOnEnableAutoscaling = (values: dmsCreateComputeOnEnableAutoscalingValues) => {
    return gql`mutation {
                        dmsCreateCompute(
                          name: "${values.compute_name}",
                          resources: {
                            node_type: {
                                worker_type_id: "${values.worker_type_id}"
                            },
                            spot_instances: ${values.spot_instances},
                            autoscale: {
                                min_workers: ${values.min_workers},
                                max_workers: ${values.max_workers}
                            }
                        },
                          max_inactivity_min: ${values.terminate_after ? values.max_inactivity_min : 0},
                        )
                      }
                      `;
};

export const dmsCreateComputeOffEnableAutoscalingJson = (values: dmsCreateComputeCommonEnableAutoscalingValues) => {
    return gql`
                        mutation {
                            dmsCreateCompute(
                                name: "${values.compute_name}",
                                resources:{
                                node_type: { 
                                    worker_type_id: "${values.worker_type_id}" 
                                    },
                                    num_workers: ${values.enableAutoScalingConditional.workers} ,
                                    spot_instances: ${values.spot_instances}
                                } ,
                                max_inactivity_min: ${values.terminateAfterConditional.terminate_after ? values.terminateAfterConditional.max_inactivity_min : 0}
                                )
                        }
                        `;
};

export const dmsCreateComputeOnEnableAutoscalingJson = (values: dmsCreateComputeCommonEnableAutoscalingValues) => {
    return gql`mutation {
                        dmsCreateCompute(
                          name: "${values.compute_name}",
                          resources: {
                            node_type: { 
                                worker_type_id: "${values.worker_type_id}" 
                            },
                            spot_instances: ${values.spot_instances},
                            autoscale: {
                                min_workers: ${values.enableAutoScalingConditional.min_workers},
                                max_workers: ${values.enableAutoScalingConditional.max_workers}
                            }
                        },
                          max_inactivity_min: ${values.terminateAfterConditional.terminate_after ? values.terminateAfterConditional.max_inactivity_min : 0},
                        )
                      }
                      `;
};

export const getComputeListData = () => {
    const GET_COMPUTELIST = gql`
        query {
            dmsComputes {
                id
                name
                resources {
                    instance_pool {
                        worker_pool_id
                        driver_pool_id
                    }
                    node_type {
                        worker_type_id
                        driver_type_id
                    }
                    autoscale {
                        min_workers
                        max_workers
                    }
                    num_workers
                    spot_instances
                }
                is_default
                max_inactivity_min
                cluster_policy_id
                status
                created_by
                created_at
            }
        }
    `;
    return { GET_COMPUTELIST };
};
export const GET_DB_SETTINGS = gql`
    query db_settings {
        dmsDatabricksSettings {
            node_types {
                node_type_id
                memory_mb
                num_cores
                category
            }
            instance_pools {
                instance_pool_id
                instance_pool_name
                min_idle_instances
                min_idle_instances
                max_capacity
                node_type_id
                stats {
                    used_count
                    idle_count
                    pending_used_count
                    pending_idle_count
                }
            }
            cluster_policies {
                policy_id
                policy_name
            }
        }
    }
`;
