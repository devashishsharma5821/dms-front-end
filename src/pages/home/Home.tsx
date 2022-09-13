import React from 'react';
import { useQuery } from '@apollo/client';
import { getUserConfig } from '../../query';

import './home.scss';

function UserConfiguration() {
    const { GET_USER_CONFIGURATION } = getUserConfig();
    const { loading, error, data } = useQuery(GET_USER_CONFIGURATION);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : `${error.toString()}`</p>;
    if (data) console.log('--> ', data);

    return <h4> User configuration </h4>;
}

const HomePage = () => {
    return (
        <>
            <div className="welcome">Welcome to Home page..</div>
            <br></br>
            <UserConfiguration />
        </>
    );
};

export default HomePage;
