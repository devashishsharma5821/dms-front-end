/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const SwitchOff: React.FC<LogoProps> = () => {
    return (
        <svg width="30" height="16" viewBox="0 0 30 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="0.5" width="30" height="15" rx="7.5" fill="#929AA9" />
            <circle cx="7.5" cy="8" r="6.25" fill="white" />
        </svg>
    );
};

export default SwitchOff;
