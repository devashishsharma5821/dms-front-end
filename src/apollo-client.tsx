import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { DMS_CONFIG } from './environments';

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('accessToken');
    // const espUserToken = localStorage.getItem('espUserToken');
    const espUserToken =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJpZCI6ImVlYTc1Y2Y5LTA2ZGUtNGZlNy1iNDc2LWFjNDg4NTYzOThkZiIsIm5hbWUiOiJadWJpbiBTaGFoIiwiZ2l2ZW5OYW1lIjoiWnViaW4iLCJmYW1pbHlOYW1lIjoiU2hhaCIsImVtYWlsIjoienViaW4uc2hhaEBhbnR1aXQuY29tIiwidXNlckV4dGVybmFsSWQiOiI1ZjM4ZmIzMy1kMjhiLTRiNTctYTRkMy0zMjA3NWI5NDNhMzgifSwiaWF0IjoxNjcyMTU1NzQyLCJleHAiOjE2ODI1MjM3NDIsImF1ZCI6Imh0dHBzOi8vd3d3LmFudHVpdC5haS8iLCJpc3MiOiJBbnR1aXQgQUkiLCJzdWIiOiJhZG1pbkBhbnR1aXQuYWkifQ.hynuIVtmou68D6TRH593Hgn5p1Afu-jnzuQ7GcVQd_J7uZl8K_ZJBXTF373ywg76Fj5nhKZ3Q6cqwgQLROMiYw';
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
            espUserToken: espUserToken
        }
    };
});

const httpLink = createHttpLink({
    uri: DMS_CONFIG.GRAPHQL_SERVER
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;
