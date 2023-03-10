/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const LeftArrow: React.FC<LogoProps> = () => {
    return (
        <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.295 0L0 5.29575L5.295 10.5915L6.8865 9L3.1815 5.29575L6.8865 1.5915L5.295 0Z" fill="#75858F" />
        </svg>
    );
};

export default LeftArrow;
