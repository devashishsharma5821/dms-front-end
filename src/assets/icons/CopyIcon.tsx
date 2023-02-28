/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const CopyIcon: React.FC<LogoProps> = () => {
    return (
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.5 0H8.5L9.5 1H1.5V13V14H0.5V0ZM2.5 2H10.5L13.5 5V16H2.5V2ZM3.5 15H12.5V6H9.5V3H3.5V15ZM11.5 11H4.5V12H11.5V11ZM9.5 13H4.5V14H9.5V13ZM11.5 9H4.5V10H11.5V9Z"
                fill="#666C80"
            />
        </svg>
    );
};

export default CopyIcon;
