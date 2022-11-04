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
