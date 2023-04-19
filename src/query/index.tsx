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
      email
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
export const getSingleComputeData = (computeId: string) => {
    return gql`
query {
  dmsCompute(compute_id: ${computeId}, task_limit: 25) {
    id
    name
    created_by
    created_at
    updated_at
     is_default
                max_inactivity_min
                cluster_policy_id
                status
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
                        total_num_cores
                        total_memory_mb
                    }
                    autoscale {
                        min_workers
                        max_workers
                    }
                    num_workers
                    spot_instances
                }
    tasks {
      task_key
      cleanup_duration
      start_time
      end_time
      execution_duration
    }
  }
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
                        worker_memory_mb
                        driver_memory_mb
                        worker_num_cores
                        driver_num_cores
                        total_num_cores
                        total_memory_mb
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
                updated_at
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

// Dataset and Dataset API Start Here

export const GET_SINGLE_DATASET = (id: string) => {
    return gql`
        query dmsDataSource {
            dmsDataSource(id: "${id}") {
                id
                name
                spec {
                    ... on DMSDatabricksFileUpload {
                        path
                    }
                }
                df_profile
                created_by
                created_at
                updated_at
            }
            
        }
    `;
};

// Project and Projects API Start Here
export const GET_ALL_PROJECTS = gql`
    query dmsProjects {
        dmsProjects {
            id
            name
            created_by
            created_at
            updated_at
            project_variables
            tags
            description
            project_access {
                id
                user_id
                access_level
            }
            datasources {
                id
                name
                created_by
                created_at
                spec {
                    ... on DMSDatabricksFileUpload {
                        path
                    }
                }
            }
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
      updated_at
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
  datasources(type: DBFS) {
      id
      name
      spec {
        ... on DMSDatabricksFileUpload {
          path
        }
      }
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
    const tags = variables.tags !== null && variables.tags !== '' ? variables.tags.split(',') : [];
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
    return gql`mutation {
                dmsEditProject(
                    id: "${variables.id}",
                    name: "${variables.name}",
                    project_variables: "${variables.project_variables}",
                    description: "${variables.description}",
                    tags: ${JSON.stringify(variables.tags)}
                )
            }`;
};
export const editDataset = (variables: any) => {
    return gql`mutation {
                dmsEditProject(
                    id: "${variables.id}",
                    name: "${variables.name}",
                    project_variables: "${variables.project_variables}",
                
                )
            }`;
};

export const createAccess = () => {
    return gql`
        mutation dmsCreateAccess($input: DMSProjecAccessMutationInput!) {
            dmsCreateOrUpdateProjectAccess(input: $input)
        }
    `;
};

export const deleteAccess = (variables: any) => {
    return gql`
    mutation {
    dmsDeleteProjectAccess
    (
    user_id: "${variables.userId}", 
    project_ID:"${variables.projectId}"
    )
    }`;
};

export const deleteProject = (id: string) => {
    return gql`mutation {
        dmsDeleteProject(id: "${id}")
    }`;
};
// Project APIs end here
// Dataset APIs start here
export const uploadCSVDataset = () => {
    return gql`
        mutation dmsDatabricksUploadDBFS($file: Upload!, $projectId: ID!, $datasetName: String!, $format: DMSDataframeFormatSpec) {
            dmsDatabricksUploadDBFS(file: $file, project_id: $projectId, dataset_name: $datasetName, format: $format)
        }
    `;
};

export const deleteDataset = (dataSourceId: any) => {
    return gql`mutation {
        dmsDeleteDataSource(id: ${dataSourceId})
    }`;
};
// Dataset APIs End Here

// ProjectDetailsMenu APIs Start here
export const dmsEditExperiment = (variables: any) => {
    const displayNew = JSON.stringify({
        "stages": {
            "a84bf374-a13a-4f91-8a8c-184f496dc391": {
                "id": "a84bf374-a13a-4f91-8a8c-184f496dc391",
                "position": {
                    "x": 50,
                    "y": 50
                },
                "status": "Valid",
                "signature": "",
                "inputs": {},
                "outputs": {
                    "dataframe": {
                        "id": "dataframe",
                        "is_valid": true,
                        "dataframe_spec": {
                            "columns": [
                                {
                                    "name": "Product Type",
                                    "type": "string"
                                },
                                {
                                    "name": "Net Quantity",
                                    "type": "int"
                                },
                                {
                                    "name": "Gross Sales",
                                    "type": "double"
                                },
                                {
                                    "name": "Discounts",
                                    "type": "double"
                                },
                                {
                                    "name": "Returns",
                                    "type": "double"
                                },
                                {
                                    "name": "Total Net Sales",
                                    "type": "double"
                                }
                            ],
                            "signature": "b'\\r\\r\\x83\\x89\\x82\\xeb7\\x1f\\xc6\\xc0L\\x84\\x91\\xf7\\x10='"
                        }
                    }
                }
            },
            "0091b92b-511d-4af6-8bbc-9eec810bba76": {
                "id": "0091b92b-511d-4af6-8bbc-9eec810bba76",
                "position": {
                    "x": 250,
                    "y": 100
                },
                "status": "Valid",
                "signature": "",
                "inputs": {
                    "__primary_df__": {
                        "id": "__primary_df__",
                        "position": {
                            "x": 0,
                            "y": 0
                        }
                    }
                },
                "outputs": {
                    "df0": {
                        "id": "df0",
                        "is_valid": true,
                        "dataframe_spec": {
                            "columns": [
                                {
                                    "name": "Product Type",
                                    "type": "string"
                                },
                                {
                                    "name": "Gross Sales",
                                    "type": "double"
                                },
                                {
                                    "name": "Discounts",
                                    "type": "double"
                                },
                                {
                                    "name": "Returns",
                                    "type": "double"
                                },
                                {
                                    "name": "Total Net Sales",
                                    "type": "double"
                                }
                            ],
                            "signature": "b'0\\x81\\xefC\\xa2\\xa4\\xc2\\x16,\\x8e\\xa4\\xee:\\xc6\\xd4\\x1f'"
                        }
                    }
                }
            },
            "5feaa476-e6c6-4f96-8ff0-0c62d569fa03": {
                "id": "5feaa476-e6c6-4f96-8ff0-0c62d569fa03",
                "position": {
                    "x": 446,
                    "y": 128
                },
                "status": "Valid",
                "signature": "",
                "inputs": {
                    "__primary_df__": {
                        "id": "__primary_df__",
                        "position": {
                            "x": 0,
                            "y": 0
                        }
                    }
                },
                "outputs": {
                    "df0": {
                        "id": "df0",
                        "is_valid": true,
                        "dataframe_spec": {
                            "columns": [
                                {
                                    "name": "Product Type",
                                    "type": "string"
                                },
                                {
                                    "name": "Gross Sales",
                                    "type": "double"
                                },
                                {
                                    "name": "Discounts",
                                    "type": "double"
                                },
                                {
                                    "name": "Returns",
                                    "type": "double"
                                },
                                {
                                    "name": "Total Net Sales",
                                    "type": "double"
                                }
                            ],
                            "signature": "b'0\\x81\\xefC\\xa2\\xa4\\xc2\\x16,\\x8e\\xa4\\xee:\\xc6\\xd4\\x1f'"
                        }
                    }
                }
            },
            "c7edbce2-4d45-4223-82f6-6d2324a82f87": {
                "id": "c7edbce2-4d45-4223-82f6-6d2324a82f87",
                "position": {
                    "x": 583,
                    "y": 146
                },
                "status": "Valid",
                "signature": "",
                "inputs": {
                    "__primary_df__": {
                        "id": "__primary_df__",
                        "position": {
                            "x": 0,
                            "y": 0
                        }
                    }
                },
                "outputs": {
                    "df0": {
                        "id": "df0",
                        "is_valid": true,
                        "dataframe_spec": {
                            "columns": [
                                {
                                    "name": "Product Type",
                                    "type": "string"
                                },
                                {
                                    "name": "Gross Sales",
                                    "type": "double"
                                },
                                {
                                    "name": "Discounts",
                                    "type": "double"
                                },
                                {
                                    "name": "Returns",
                                    "type": "double"
                                },
                                {
                                    "name": "Total Net Sales",
                                    "type": "double"
                                }
                            ],
                            "signature": "b'0\\x81\\xefC\\xa2\\xa4\\xc2\\x16,\\x8e\\xa4\\xee:\\xc6\\xd4\\x1f'"
                        }
                    }
                }
            }
        }
    });
    //display: ${JSON.stringify(displayNew)};
    return gql`mutation {
  dmsEditExperiment(
    id: "${variables.id}"
    name: "${variables.name}",
    tags: ${JSON.stringify(variables.tags)},
    description: "${variables.description}",
    core: ${JSON.stringify(variables.stages)}
  )
}`;
};

export const createExperiment = (variables: any) => {
    // TODO replace transformer_libary_version to unhardcode.
    return gql`mutation {
  dmsCreateExperiment(
    project_id: "${variables.projectSelected}"
    name: "${variables.experimentName}",
    tags: ${JSON.stringify(variables.tags)},
    description: "${variables.description}",
    transformer_library_version: "adf_library-1.3.0+gce603324a-cp38-cp38-linux_x86_64.whl"
  )
}`;
};

export const cloneExperiment = (variables: any) => {
    // TODO replace transformer_libary_version to unhardcode.
    return gql`mutation {
  dmsCloneExperiment(
    project_id: "${variables.projectSelected}"
    experiment_id: "${variables.experimentId}",
    destination_project_id: "${variables.destination_project_id}",
    name: "${variables.experimentName}",
    transformer_library_version: "adf_library-1.3.0+gce603324a-cp38-cp38-linux_x86_64.whl"
  ){
    experiment_id
  }
}`;
};
export const GET_EXPERIMENT = (experiment_id: string) => {
    return gql`
  query {
  dmsExperiment(experiment_id: ${experiment_id}) {
    id
    name
    description
    tags
    core
    display
    outputs {
      name
      type
    }
    status
    created_by
    created_at
    modified_at
    is_deployed
    related_experiment_id
    related_experiment_name
  }
}
`;
};
// ProjectDetailsMenu APIs End here
