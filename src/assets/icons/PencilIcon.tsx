/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const PencilIcon: React.FC<LogoProps> = () => {
    return (
        <svg width="13.94" height="13.94" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.707 19.707L18 10.414L13.586 6L4.293 15.293C4.16506 15.4211 4.07418 15.5814 4.03 15.757L3 21L8.242 19.97C8.418 19.926 8.579 19.835 8.707 19.707ZM21 7.414C21.3749 7.03895 21.5856 6.53033 21.5856 6C21.5856 5.46967 21.3749 4.96106 21 4.586L19.414 3C19.0389 2.62506 18.5303 2.41443 18 2.41443C17.4697 2.41443 16.9611 2.62506 16.586 3L15 4.586L19.414 9L21 7.414Z"
                fill="#ffffff"
            />
        </svg>
    );
};

export default PencilIcon;
