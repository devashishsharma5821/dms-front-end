/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const MoreIconToolbar: React.FC<LogoProps> = () => {
    return (
        <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.68216 0C9.24796 0 9.79058 0.210714 10.1907 0.585786C10.5907 0.960859 10.8155 1.46957 10.8155 2C10.8155 2.53043 10.5907 3.03914 10.1907 3.41421C9.79058 3.78929 9.24796 4 8.68216 4C8.11637 4 7.57375 3.78929 7.17367 3.41421C6.77359 3.03914 6.54883 2.53043 6.54883 2C6.54883 1.46957 6.77359 0.960859 7.17367 0.585786C7.57375 0.210714 8.11637 0 8.68216 0ZM8.68216 8C9.24796 8 9.79058 8.21071 10.1907 8.58579C10.5907 8.96086 10.8155 9.46957 10.8155 10C10.8155 10.5304 10.5907 11.0391 10.1907 11.4142C9.79058 11.7893 9.24796 12 8.68216 12C8.11637 12 7.57375 11.7893 7.17367 11.4142C6.77359 11.0391 6.54883 10.5304 6.54883 10C6.54883 9.46957 6.77359 8.96086 7.17367 8.58579C7.57375 8.21071 8.11637 8 8.68216 8V8ZM8.68216 16C9.24796 16 9.79058 16.2107 10.1907 16.5858C10.5907 16.9609 10.8155 17.4696 10.8155 18C10.8155 18.5304 10.5907 19.0391 10.1907 19.4142C9.79058 19.7893 9.24796 20 8.68216 20C8.11637 20 7.57375 19.7893 7.17367 19.4142C6.77359 19.0391 6.54883 18.5304 6.54883 18C6.54883 17.4696 6.77359 16.9609 7.17367 16.5858C7.57375 16.2107 8.11637 16 8.68216 16Z"
                fill="#666C80"
            />
        </svg>
    );
};

export default MoreIconToolbar;