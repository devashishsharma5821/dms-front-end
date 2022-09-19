import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { getUserConfig, wsconnect } from '../../query';
import './home.scss';

function UserConfiguration() {
    const { GET_USER_CONFIGURATION } = getUserConfig();
    const { loading, error, data } = useQuery(GET_USER_CONFIGURATION);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : `${error.toString()}`</p>;
    if (data?.userConfiguration?.user?.espUserToken) {
        localStorage['espUserToken'] = data.userConfiguration.user.espUserToken ?? '';
    }

    return <span></span>;
}

const HomePage = () => {
    const [message, setMessage] = useState('Status');

    useEffect(() => {
        wsconnect(setMessage);
    }, []);
    return (
        <>
            <div className="welcome">Welcome to Home page..</div>
            <br></br>
            <UserConfiguration />
            {message}
        </>
    );
};

export default HomePage;
