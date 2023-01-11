/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const PlayIcon: React.FC<LogoProps> = (props) => {
    return (
        <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0 1.37702V15.623C0 16.7093 1.20059 17.3693 2.12518 16.7781L13.3583 9.65508C14.2139 9.11879 14.2139 7.88121 13.3583 7.33117L2.12518 0.221946C1.20059 -0.369344 0 0.290701 0 1.37702Z"
                fill="#666C80"
            />
        </svg>
    );
};

export default PlayIcon;
