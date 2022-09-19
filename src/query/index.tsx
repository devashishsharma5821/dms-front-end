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
                }
                error
            }
        }
    `;

    return { GET_USER_CONFIGURATION };
};
