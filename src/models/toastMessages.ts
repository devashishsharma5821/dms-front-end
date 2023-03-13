import { UseToastOptions } from '@chakra-ui/react';

export const getToastOptions = (title: string, status: string) => {
    return {
        title,
        status,
        isClosable: true,
        duration: 5000,
        position: 'top-right'
    } as UseToastOptions;
}
