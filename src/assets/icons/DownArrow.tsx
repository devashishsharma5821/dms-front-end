/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const DownArrow: React.FC<LogoProps> = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_5961_5274)">
                <path
                    d="M7.41289 11.2341L11.0199 14.6179C11.563 15.1274 12.4404 15.1274 12.9835 14.6179L16.5905 11.2341C17.4679 10.411 16.8412 9 15.6018 9H8.38776C7.14829 9 6.53552 10.411 7.41289 11.2341Z"
                    fill="white"
                />
            </g>
            <defs>
                <clipPath id="clip0_5961_5274">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default DownArrow;
