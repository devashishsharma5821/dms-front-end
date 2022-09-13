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
                }
                error
            }
        }
    `;

    return { GET_USER_CONFIGURATION };
};
