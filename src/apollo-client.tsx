import { ApolloClient, InMemoryCache, createHttpLink, DefaultOptions } from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { ENVIRONMENT } from './environments';
import createUploadLink from 'apollo-upload-client/public/createUploadLink';
declare var CONFIG: any;
declare global {
    interface Window {
        CONFIG: any;
    }
    interface Window {
        CONFIG: any;
    }
}
// eslint-disable-next-line no-restricted-globals
if (location.href.indexOf('localhost') > 0) {
    window['CONFIG'] = ENVIRONMENT;
    window['CONFIG'] = ENVIRONMENT;
}

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('accessToken');
    const espUserToken = localStorage.getItem('espUserToken');
    
    console.log('headers', headers);
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
            espUserToken: espUserToken
        }
    };
});
const uploadLink = createUploadLink({ uri: CONFIG.GRAPHQL_SERVER });

const httpLink = createHttpLink({
    uri: CONFIG.GRAPHQL_SERVER
});
const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
    }
};

const client = new ApolloClient({
    link: authLink.concat(uploadLink).concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
});

export default client;
