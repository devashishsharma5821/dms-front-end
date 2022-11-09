/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const DeployedIcon: React.FC<LogoProps> = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.91864 0.5C4.67205 0.5 0.41864 4.75341 0.41864 10C0.41864 15.2466 4.67205 19.5 9.91864 19.5C15.1652 19.5 19.4186 15.2466 19.4186 10C19.4186 4.75341 15.1652 0.5 9.91864 0.5ZM14.0365 8.39364C14.1123 8.30696 14.17 8.206 14.2062 8.09669C14.2425 7.98738 14.2565 7.87193 14.2474 7.75712C14.2384 7.64232 14.2065 7.53049 14.1535 7.4282C14.1006 7.32592 14.0278 7.23525 13.9393 7.16152C13.8509 7.0878 13.7486 7.03251 13.6384 6.99892C13.5283 6.96532 13.4125 6.9541 13.2979 6.9659C13.1834 6.9777 13.0724 7.01229 12.9714 7.06764C12.8704 7.12299 12.7815 7.19797 12.7099 7.28818L8.99628 11.7437L7.07469 9.82123C6.9118 9.66391 6.69365 9.57686 6.4672 9.57883C6.24076 9.5808 6.02415 9.67162 5.86402 9.83175C5.7039 9.99187 5.61307 10.2085 5.6111 10.4349C5.60914 10.6614 5.69619 10.8795 5.8535 11.0424L8.44441 13.6333C8.52927 13.7181 8.63087 13.7843 8.74273 13.8277C8.85458 13.8711 8.97425 13.8906 9.0941 13.8852C9.21395 13.8798 9.33135 13.8494 9.43881 13.7961C9.54628 13.7427 9.64146 13.6676 9.71828 13.5755L14.0365 8.39364Z"
                fill="#00864F"
            />
        </svg>
    );
};

export default DeployedIcon;
