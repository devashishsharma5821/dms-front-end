import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_DB_SETTINGS } from '../query/index';

interface dbSettingstype {
    __typename: String;
    node_type_id: String;
    memory_mb: Number;
    num_cores: Number;
    category: String;
}

function useGetDbSettings() {
    const [dbSettingsData, setDbSettingsData] = useState<dbSettingstype[]>();
    const client = useApolloClient();
    client
        .query<any>({
            query: GET_DB_SETTINGS
        })
        .then((response) => {
            setDbSettingsData(response.data.dmsDatabricksSettings.node_types);
        })
        .catch((err) => {});
    return dbSettingsData;
}

export default useGetDbSettings;
