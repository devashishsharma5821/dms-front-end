import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_DATABRICKS_CREDS } from '../query/index';

const useDmsCheckDatabricksCred = () => {
    const [token, setToken] = useState();
    const client = useApolloClient();

    useEffect(() => {
        client
            .query<any>({
                query: GET_DATABRICKS_CREDS
            })
            .then((response) => {
                setToken(response.data.dmsCheckDatabricksCredentials.valid);
            });
    }, []);

    return token;
};

export default useDmsCheckDatabricksCred;
