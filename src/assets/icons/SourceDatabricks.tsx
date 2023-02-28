/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const SourceDatabricks: React.FC<any> = (props: any) => {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M39 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V39C0 39.2652 0.105357 39.5196 0.292893 39.7071C0.48043 39.8946 0.734784 40 1 40H39C39.2652 40 39.5196 39.8946 39.7071 39.7071C39.8946 39.5196 40 39.2652 40 39V1C40 0.734784 39.8946 0.48043 39.7071 0.292893C39.5196 0.105357 39.2652 0 39 0ZM13 38H2V27H13V38ZM13 25H2V15H13V25ZM13 13H2V2H13V13ZM25 38H15V27H25V38ZM25 25H15V15H25V25ZM25 13H15V2H25V13ZM38 38H27V27H38V38ZM38 25H27V15H38V25ZM38 13H27V2H38V13Z"
                fill={props.color}
            />
        </svg>
    );
};

export default SourceDatabricks;
