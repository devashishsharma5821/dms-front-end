import React from 'react';
import './pagenotfound.scss';

import { useColorModeValue } from '@chakra-ui/react';
const PageNotFound = () => {
    const textColor = useColorModeValue('light.header', 'dark.white');
    return (
        <div className="page_not_found" color={textColor}>
            Component is in progress ...{' '}
        </div>
    );
};

export default PageNotFound;
