/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const Output: React.FC<LogoProps> = () => {
    return (
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M23.376 18V16.5H21.801C21.726 16.05 21.501 15.6 21.276 15.15L22.401 14.025L21.351 12.975L20.226 14.1C19.851 13.875 19.401 13.65 18.876 13.575V12H17.376V13.575C16.926 13.65 16.476 13.875 16.026 14.1L14.901 12.975L13.851 14.025L14.976 15.15C14.751 15.525 14.526 15.975 14.451 16.5H12.876V18H14.451C14.526 18.45 14.751 18.9 14.976 19.35L13.851 20.475L14.901 21.525L16.026 20.4C16.401 20.625 16.851 20.85 17.376 20.925V22.5H18.876V20.925C19.326 20.85 19.776 20.625 20.226 20.4L21.351 21.525L22.401 20.475L21.276 19.35C21.501 18.975 21.726 18.525 21.801 18H23.376ZM18.126 19.5C16.851 19.5 15.876 18.525 15.876 17.25C15.876 15.975 16.851 15 18.126 15C19.401 15 20.376 15.975 20.376 17.25C20.376 18.525 19.401 19.5 18.126 19.5Z"
                fill="#666C80"
            />
            <path
                d="M21.876 6H12.876L10.326 3.45C10.026 3.15 9.65104 3 9.27604 3H3.87604C3.05104 3 2.37604 3.675 2.37604 4.5V19.5C2.37604 20.325 3.05104 21 3.87604 21H11.376V19.5H3.87604V4.5H9.27604L11.826 7.05L12.276 7.5H21.876V11.25H23.376V7.5C23.376 6.675 22.701 6 21.876 6Z"
                fill="#666C80"
            />
        </svg>
    );
};

export default Output;