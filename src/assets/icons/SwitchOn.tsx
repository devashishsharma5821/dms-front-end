/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const SwitchOn: React.FC<LogoProps> = () => {
    return (
        <svg width="30" height="16" viewBox="0 0 30 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="0.5" width="30" height="15" rx="7.5" fill="#0387B0" />
            <circle cx="22.5" cy="8" r="6.25" fill="white" />
        </svg>
    );
};

export default SwitchOn;
