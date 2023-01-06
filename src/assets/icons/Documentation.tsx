/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const Documentation: React.FC<any> = (props:any) => {
    return (
        <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 8H10.5V2H1.5V20H16.5V8ZM15.879 6.5L12 2.621V6.5H15.879ZM0.75 0.5H12L18 6.5V20.75C18 20.9489 17.921 21.1397 17.7803 21.2803C17.6397 21.421 17.4489 21.5 17.25 21.5H0.75C0.551088 21.5 0.360322 21.421 0.21967 21.2803C0.0790178 21.1397 0 20.9489 0 20.75V1.25C0 1.05109 0.0790178 0.860322 0.21967 0.71967C0.360322 0.579018 0.551088 0.5 0.75 0.5ZM4.5 11H13.5V12.5H4.5V11ZM4.5 6.5H8.25V8H4.5V6.5ZM4.5 15.5H13.5V17H4.5V15.5Z" fill={props.color}/>
        </svg>
        
    );
};

export default Documentation;
