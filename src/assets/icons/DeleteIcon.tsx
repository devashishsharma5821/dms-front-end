/* eslint-disable max-len */
import React, { useState } from 'react';

import DeleteComputeModal from '../../pages/compute/DeleteComputeModal';
import { useDisclosure } from '@chakra-ui/react-use-disclosure';

type LogoProps = {
    children?: never;
};

export const DeleteIcon: React.FC<LogoProps> = () => {
    return (
        <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.17136 19.4142C2.79628 19.0391 2.58557 18.5304 2.58557 18V6H0.585571V4H4.58557V2C4.58557 1.46957 4.79628 0.960859 5.17136 0.585786C5.54643 0.210714 6.05514 0 6.58557 0H12.5856C13.116 0 13.6247 0.210714 13.9998 0.585786C14.3749 0.960859 14.5856 1.46957 14.5856 2V4H18.5856V6H16.5856V18C16.5856 18.5304 16.3749 19.0391 15.9998 19.4142C15.6247 19.7893 15.116 20 14.5856 20H4.58557C4.05514 20 3.54643 19.7893 3.17136 19.4142ZM12.5856 2H6.58557V4H12.5856V2ZM14.5856 6H5.58557H4.58557V18H14.5856V6ZM8.58557 8H6.58557V16H8.58557V8ZM12.5856 8H10.5856V16H12.5856V8Z"
                fill="#666C80"
            />
        </svg>
    );
};

export default DeleteIcon;