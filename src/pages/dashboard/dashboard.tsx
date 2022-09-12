import React from 'react';
import { useQuery, gql } from '@apollo/client';

import './dashboard.scss';

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
function UserConfiguration() {
    const { loading, error, data } = useQuery(GET_USER_CONFIGURATION);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.log('--> ', data);

    return <p> User configuration </p>;
}

const DashboardPage = () => {
    return (
        <>
            <div className="welcome">Welcome to dashboard page..</div>
            <br></br>
            <UserConfiguration />
        </>
    );
};

export default DashboardPage;
