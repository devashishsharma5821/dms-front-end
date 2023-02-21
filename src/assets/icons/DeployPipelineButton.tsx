/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const DeployPipelineButton: React.FC<any> = (props: any) => {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.25 8.75L1.25 8.25C1.25 8.25 1.25 6.75 1.75 5.25C2.25 3.75 5.75 3.75 5.75 3.75M5.25 10.75L5.75 12.75C5.75 12.75 7.25 12.75 8.75 12.25C10.25 11.75 10.25 8.25 10.25 8.25M3.25 8.75L5.25 10.75C5.25 10.75 10.25 8.75 11.75 6.25C13.25 3.75 13.25 0.75 13.25 0.75C13.25 0.75 10.25 0.75 7.75 2.25C5.25 3.75 3.25 8.75 3.25 8.75Z"
                stroke=" #AEB1B8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M0.75 13.25L2.75 12.25L1.75 11.25L0.75 13.25Z" fill="#AEB1B8" stroke=" #AEB1B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M9.25 5.25C9.52614 5.25 9.75 5.02614 9.75 4.75C9.75 4.47386 9.52614 4.25 9.25 4.25C8.97386 4.25 8.75 4.47386 8.75 4.75C8.75 5.02614 8.97386 5.25 9.25 5.25Z"
                fill="#AEB1B8"
                stroke="#AEB1B8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default DeployPipelineButton;
