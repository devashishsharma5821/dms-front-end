/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const TickIcon: React.FC<LogoProps> = () => {
    return (
        <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.00014 10.1703L2.53014 6.70031C2.14014 6.31031 1.51014 6.31031 1.12014 6.70031C0.730137 7.09031 0.730137 7.72031 1.12014 8.11031L5.30014 12.2903C5.69014 12.6803 6.32014 12.6803 6.71014 12.2903L17.2901 1.71031C17.6801 1.32031 17.6801 0.690313 17.2901 0.300312C16.9001 -0.0896875 16.2701 -0.0896875 15.8801 0.300312L6.00014 10.1703Z"
                fill="white"
            />
        </svg>
    );
};

export default TickIcon;
