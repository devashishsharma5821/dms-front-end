/* eslint-disable max-len */
import { propNames } from '@chakra-ui/react';
import React from 'react';

type LogoProps = {
    children?: never;
};

export const DownloadIcon: React.FC<any> = (props:any) => {
    return (

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.125 0H13.875C14.4984 0 15 0.501562 15 1.125V9H19.1109C19.9453 9 20.3625 10.0078 19.7719 10.5984L12.6422 17.7328C12.2906 18.0844 11.7141 18.0844 11.3625 17.7328L4.22344 10.5984C3.63281 10.0078 4.05 9 4.88437 9H9V1.125C9 0.501562 9.50156 0 10.125 0ZM24 17.625V22.875C24 23.4984 23.4984 24 22.875 24H1.125C0.501562 24 0 23.4984 0 22.875V17.625C0 17.0016 0.501562 16.5 1.125 16.5H8.00156L10.2984 18.7969C11.2406 19.7391 12.7594 19.7391 13.7016 18.7969L15.9984 16.5H22.875C23.4984 16.5 24 17.0016 24 17.625ZM18.1875 21.75C18.1875 21.2344 17.7656 20.8125 17.25 20.8125C16.7344 20.8125 16.3125 21.2344 16.3125 21.75C16.3125 22.2656 16.7344 22.6875 17.25 22.6875C17.7656 22.6875 18.1875 22.2656 18.1875 21.75ZM21.1875 21.75C21.1875 21.2344 20.7656 20.8125 20.25 20.8125C19.7344 20.8125 19.3125 21.2344 19.3125 21.75C19.3125 22.2656 19.7344 22.6875 20.25 22.6875C20.7656 22.6875 21.1875 22.2656 21.1875 21.75Z"
         fill={props.color}/>
        </svg>
        
        

    );
};

export default DownloadIcon;