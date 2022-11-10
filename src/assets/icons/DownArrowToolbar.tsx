/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const DownArrowToolbar: React.FC<LogoProps> = () => {
    return (
        <svg width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1.67815 0.71875C0.553152 0.71875 -0.00934771 2.09375 0.803152 2.90625L8.80315 10.9062C9.30315 11.4062 10.1157 11.4062 10.6157 10.9062L18.6157 2.90625C19.4282 2.09375 18.8657 0.71875 17.7407 0.71875H1.67815Z"
                fill="black"
                fill-opacity="0.54"
            />
        </svg>
    );
};

export default DownArrowToolbar;
