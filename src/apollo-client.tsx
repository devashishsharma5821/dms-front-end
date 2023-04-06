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
    // const espUserToken = localStorage.getItem('espUserToken');
    const espUserToken =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJpZCI6ImVlYTc1Y2Y5LTA2ZGUtNGZlNy1iNDc2LWFjNDg4NTYzOThkZiIsIm5hbWUiOiJadWJpbiBTaGFoIiwiZ2l2ZW5OYW1lIjoiWnViaW4iLCJmYW1pbHlOYW1lIjoiU2hhaCIsImVtYWlsIjoienViaW4uc2hhaEBhbnR1aXQuY29tIiwidXNlckV4dGVybmFsSWQiOiI1ZjM4ZmIzMy1kMjhiLTRiNTctYTRkMy0zMjA3NWI5NDNhMzgifSwiaWF0IjoxNjc1MjI1MjEyLCJleHAiOjE2ODU1OTMyMTIsImF1ZCI6Imh0dHBzOi8vd3d3LmFudHVpdC5haS8iLCJpc3MiOiJBbnR1aXQgQUkiLCJzdWIiOiJhZG1pbkBhbnR1aXQuYWkifQ.EGX6MTLl9CVmt34Q6YdXsiE2Hg6k_F3_RLv3r4tKpdfPd3WQbiUjaVzWeeFFiEx_TjsQk3LZpYojaAxnl2fJWg';
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
