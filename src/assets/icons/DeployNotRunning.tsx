/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const DeployedNotRunningIcon: React.FC<LogoProps> = () => {
    return (
        <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9.5" cy="10" r="9.5" fill="#E3E3E3"/>
        </svg>

    );
};

export default DeployedNotRunningIcon;
