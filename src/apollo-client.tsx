import { ApolloClient, InMemoryCache, createHttpLink, DefaultOptions } from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { ENVIRONMENT } from './environments';
import createUploadLink from 'apollo-upload-client/public/createUploadLink';
declare var CONFIG: any;
declare global {
    interface Window { CONFIG: any; }
}
// eslint-disable-next-line no-restricted-globals
if (location.href.indexOf('localhost') > 0) {
	window['CONFIG'] = ENVIRONMENT;
}

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('accessToken');
    const espUserToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJpZCI6ImVlYTc1Y2Y5LTA2ZGUtNGZlNy1iNDc2LWFjNDg4NTYzOThkZiIsIm5hbWUiOiJadWJpbiBTaGFoIiwiZ2l2ZW5OYW1lIjoiWnViaW4iLCJmYW1pbHlOYW1lIjoiU2hhaCIsImVtYWlsIjoienViaW4uc2hhaEBhbnR1aXQuY29tIiwidXNlckV4dGVybmFsSWQiOiI1ZjM4ZmIzMy1kMjhiLTRiNTctYTRkMy0zMjA3NWI5NDNhMzgifSwiaWF0IjoxNjgwMTg0ODg0LCJleHAiOjE2OTA1NTI4ODQsImF1ZCI6Imh0dHBzOi8vd3d3LmFudHVpdC5haS8iLCJpc3MiOiJBbnR1aXQgQUkiLCJzdWIiOiJhZG1pbkBhbnR1aXQuYWkifQ.a2-7z_fKDG-ZneT2rDbGzUxvDVxlxMAYDzzSoNIcUu2YxVXqMNQxG1IAwRqsG_taHJMKO6eo3EqVpqt5GUkfQA`
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
