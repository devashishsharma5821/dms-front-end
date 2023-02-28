import { dmsCreateComputeOffEnableAutoscalingValues, dmsCreateComputeOnEnableAutoscalingValues } from '../models/types';
import { dmsCreateComputeCommonEnableAutoscalingValues } from '../models/types';
import { gql } from '@apollo/client';
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

export const GET_USERS_OF_ESP = (variables: any) => {
    return gql`
query getUsers {
  getUsers(
    input: { isActive: ${variables.isActive}, pageNumber: ${variables.pageNumber}, limit: ${variables.limit}, searchText: "${variables.searchText}" }
  ) {
    users {
      userId
      firstName
      lastName
      applicationName
    }
    rowCount
  }
}
`;
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

export const setSettingsData = (userName: string, token: string) => {
    return gql`
    mutation
         {   dmsSetDatabricksCredentials(  
               databricks_token: "${token}"  
               databricks_username: "${userName}" 
                  ) } 
        `;
};
export const setSaveAs = (userName: string, token: string) => {
    return gql`
    mutation
         {   dmsSetDatabricksCredentials(  
               databricks_token: "${token}"  
               databricks_username: "${userName}" 
                  ) } 
        `;
};

export const dmsCreateComputeOffEnableAutoscaling = (values: dmsCreateComputeOffEnableAutoscalingValues) => {
    return gql`mutation {
                        dmsCreateCompute(
                          name: "${values.compute_name}",
                          resources: {
                            node_type: {
                                worker_type_id: "${values.worker_type_id}",
                                driver_type_id: "${values.driver_type_id}"
                            },
                            spot_instances: ${values.spot_instances},
                            num_workers: ${values.workers}
                            
                        },
                          max_inactivity_min: ${values.terminate_after ? values.max_inactivity_min : 0},
                        )
                      }
                      `;
};

export const dmsEditComputeOffEnableAutoscaling = (values: dmsCreateComputeOffEnableAutoscalingValues) => {
    return gql`mutation {
                        dmsEditCompute(
                            id:"${values.id}",
                          name: "${values.compute_name}",
                          resources: {
                            node_type: {
                                worker_type_id: "${values.worker_type_id}",
                                driver_type_id: "${values.driver_type_id}"
                            },
                            spot_instances: ${values.spot_instances},
                            num_workers: ${values.workers}
                            
                        },
                          max_inactivity_min: ${values.terminate_after ? values.max_inactivity_min : 0},
                        )
                      }`;
};

export const dmsCreateComputeOnEnableAutoscaling = (values: dmsCreateComputeOnEnableAutoscalingValues) => {
    return gql`mutation {
                        dmsCreateCompute(
                          name: "${values.compute_name}",
                          resources: {
                            node_type: {
                                worker_type_id: "${values.worker_type_id}",
                                driver_type_id: "${values.driver_type_id}"
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

export const dmsEditComputeOnEnableAutoscaling = (values: dmsCreateComputeOnEnableAutoscalingValues) => {
    return gql`mutation {
                        dmsEditCompute(
                            id:"${values.id}"
                          name: "${values.compute_name}",
                          resources: {
                            node_type: {
                                worker_type_id: "${values.worker_type_id}",
                                driver_type_id: "${values.driver_type_id}"
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
                                    worker_type_id: "${values.worker_type_id}",
                                    driver_type_id: "${values.driver_type_id}" 
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
                                worker_type_id: "${values.worker_type_id}",
                                driver_type_id: "${values.driver_type_id}" 
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

export const dmsRunCompute = (cellId: string | undefined) => {
    return gql` mutation {
            dmsRunCompute(  
               id: "${cellId}"  
                  ) {
                    job_id,
                    job_run_id
                  }
            }`;
};

export const dmsDeleteCompute = (cellId: string | null) => {
    return gql` mutation {
            dmsDeleteCompute(  
               id: "${cellId}"  
                  ) 
            }`;
};

export const dmsEditCompute = (computeId: string | null, isDefault: boolean) => {
    return gql`mutation {
            dmsEditCompute(  
               id: "${computeId}",
               is_default: ${isDefault}  
                  )
            }`;
};
export const dmsStopComputeRun = (cellId: string | null) => {
    return gql`mutation {
            dmsCancelComputeRun(  
               id: "${cellId}"  
                  )
            }`;
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
                        worker_memory_mb
                        driver_memory_mb
                        worker_num_cores
                        driver_num_cores
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
            cluster_policies {
                policy_id
                policy_name
            }
        }
    }
`;

// Project and Projects API Start Here
export const GET_ALL_PROJECTS = gql`
    query dmsProjects {
        dmsProjects {
            id
            name
            created_by
            created_at
            project_variables
            tags
            description
        }
    }
`;

export const GET_SINGLE_PROJECT = (id: string) => {
    return gql`
   query dmsProject {
  dmsProject(project_id: "${id}") {
    basic {
      id
      name
      created_by
      created_at
      project_variables
      tags
      description
    }
    tasks {
      id
      title
      description
      is_completed
      created_by
      created_at
}
    experiments {
      id
      name
    }
    project_access {
      id
      user_id
      access_level
    }
  }
}
`;
};

export const createProject = (variables: any) => {
    const tags = (variables.tags !== null && variables.tags !== "") ? variables.tags.split(',') : [];
    return gql`mutation {
                dmsCreateProject(
                    name: "${variables.name}",
                    project_variables: "${variables.project_variables}",
                    description: "${variables.description}",
                    tags: ${JSON.stringify(tags)}
                )
            }`;
};

export const editProject = (variables: any) => {
    const tags = (variables.tags !== null && variables.tags !== "" ) ? variables.tags.split(',') : [];
    return gql`mutation {
                dmsEditProject(
                    id: "${variables.id}",
                    name: "${variables.name}",
                    project_variables: "${variables.project_variables}",
                    description: "${variables.description}",
                    tags: ${JSON.stringify(tags)}
                )
            }`;
};

export const createAccess = (variables: any) => {
    return gql `mutation {dmsCreateOrUpdateProjectAccess(user_id:"eea75cf9-06de-4fe7-b476-ac48856398df", project_ID:"22", access_level:VIEWER)}`;
};

export const deleteProject = (id: string) => {
    return gql `mutation {
        dmsDeleteProject(id: "${id}")
    }`;
}
