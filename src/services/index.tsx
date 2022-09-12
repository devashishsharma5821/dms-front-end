import { API_ENFPOINTS } from './../environments';

export const getUserConfig = async () => {
    const accessToken = '';
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append('Authorization', bearer);

    const options = {
        method: 'GET',
        headers: headers
    };

    return fetch(API_ENFPOINTS, options)
        .then((response) => response.json())
        .catch((error) => console.log(error));
};
