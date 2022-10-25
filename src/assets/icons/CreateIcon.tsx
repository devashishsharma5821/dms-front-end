/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const CreateIcon: React.FC<LogoProps> = () => {
    return (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M21 14.6399V19.6399C21 20.1703 20.7893 20.679 20.4142 21.0541C20.0391 21.4292 19.5304 21.6399 19 21.6399H5C4.46957 21.6399 3.96086 21.4292 3.58579 21.0541C3.21071 20.679 3 20.1703 3 19.6399V5.63989C3 5.10946 3.21071 4.60075 3.58579 4.22568C3.96086 3.85061 4.46957 3.63989 5 3.63989H10V5.63989H5V19.6399H19V14.6399H21Z"
                fill="white"
            />
            <path d="M21 7.63989H17V3.63989H15V7.63989H11V9.63989H15V13.6399H17V9.63989H21V7.63989Z" fill="white" />
        </svg>
    );
};

export default CreateIcon;
