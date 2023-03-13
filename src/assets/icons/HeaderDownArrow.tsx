/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const HeaderDownArrow: React.FC<LogoProps> = () => {
    return (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.23356 0.741675L5.00023 3.97501L1.76689 0.741675C1.44189 0.416675 0.916894 0.416675 0.591895 0.741675C0.266895 1.06667 0.266895 1.59167 0.591895 1.91667L4.41689 5.74167C4.74189 6.06668 5.26689 6.06668 5.59189 5.74167L9.41689 1.91667C9.74189 1.59167 9.74189 1.06667 9.41689 0.741675C9.09189 0.425008 8.55856 0.416675 8.23356 0.741675Z"
                fill="white"
            />
        </svg>
    );
};

export default HeaderDownArrow;
