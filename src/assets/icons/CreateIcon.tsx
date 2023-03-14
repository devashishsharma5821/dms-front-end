/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const CreateIcon: React.FC<LogoProps> = () => {
    return (
        <svg width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="39.6398" rx="19" fill="#0073E6" />
            <path d="M28 18.7143V21.2857H20.2857V29H17.7143V21.2857H10V18.7143H17.7143V11H20.2857V18.7143H28Z" fill="white" />
        </svg>
    );
};

export default CreateIcon;
