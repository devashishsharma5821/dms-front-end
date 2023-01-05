/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const PlusIcont:  React.FC<any> = (props:any) => {
    return (
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 7.71429V10.2857H10.2857V18H7.71429V10.2857H0V7.71429H7.71429V0H10.2857V7.71429H18Z" fill={props.color}/>
</svg>

    );
};

export default PlusIcont;
