import React, { useState } from 'react';
import useDmsCheckDatabricksCred from './useDmsCheckDatabricksCred';
import { useApolloClient } from '@apollo/client';
import { GET_DMS_COMPUTE_STATUS } from '../query/index';

const useDmsComputeStatus = () => {
    const [computeStatus, setComputeStatus] = useState();
    const client = useApolloClient();
    const token = useDmsCheckDatabricksCred();

    if (token) {
        client
            .query<any>({
                query: GET_DMS_COMPUTE_STATUS
            })
            .then((response) => {
                setComputeStatus(response.data.dmsComputes);
            });
    }

    return computeStatus;
};

export default useDmsComputeStatus;
