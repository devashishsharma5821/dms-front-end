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

export const getTransformersData = () =>{
    const GET_TRANSFORMERS = gql`
        query get_transformers{
            dmsTransformers{
                id
                name
                description
                documentation
                category
                icon
                schema{
                uiSchema
                jsonSchema
                hasMacros
                outputMacros{
                    location
                    outputId
                }
                }
                inputs{
                id
                name
                type
                isRequired
                }
                outputs{
                id
                name
                type
                isExported
                }
            }
            }
        `;
        return { GET_TRANSFORMERS };
}

export const getComputeListData = () =>{
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
                max_inactivity_min
                cluster_policy_id
                status
                created_by
                created_at
            }
            }
        `;
        return { GET_COMPUTELIST };
}