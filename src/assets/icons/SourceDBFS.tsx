/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const SourceDBFS: React.FC<any> = (props: any) => {
    return (
        <svg width="46" height="48" viewBox="0 0 46 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0.899902 28.368L22.9999 40.806L42.8379 29.706V34.126L22.9999 45.324L2.0319 33.404L0.901902 34.02V35.56L22.9999 48L45.0999 35.564V26.93L44.0699 26.312L22.9999 38.236L3.2659 26.93V22.51L22.9999 33.61L45.0999 21.174V12.64L44.0699 12.024L22.9999 23.948L4.2939 13.362L22.9999 2.776L38.5199 11.512L39.8559 10.69V9.558L22.9999 0L0.899902 12.54V13.98L22.9999 26.414L42.8379 15.314V19.834L22.9999 31.04L2.0319 19.12L0.901902 19.736L0.899902 28.368Z"
                fill={props.color}
            />
        </svg>
    );
};

export default SourceDBFS;
