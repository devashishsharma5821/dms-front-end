import React from 'react';
import './pagenotfound.scss';
import { Box, Flex, Text, useColorModeValue, Button, Link, Square, Stack, Center, Spinner } from '@chakra-ui/react';
import { PageNotFoundLogo } from '../../assets/icons';
import useAppStore from '../../store';

const PageNotFound = () => {
    const [SpinnerInfo] = useAppStore((state: any) => [state.SpinnerInfo]);

    const textColor = useColorModeValue('default.blackText', 'default.whiteText');
    return (
        <Flex flex="1" minWidth="max-content">
            <Square className="pageNotFound" pt={'70px'} pb={'55px'}>
                <Box mt={'30%'}>
                    <PageNotFoundLogo />
                </Box>

                {SpinnerInfo.loading && SpinnerInfo.to && <Spinner className="spinner" size="xl" thickness="4px" />}
                <Text mt={'93px'} color={'default.redLigh'} fontSize={24} lineHeight={'33px'}>
                    404 Error
                </Text>
                <Text color={textColor} fontSize={36} lineHeight={'49px'}>
                    Page Not Found
                </Text>
                <Text mt={'11px'} color={textColor}>
                    We can’t find the page you’re looking for.
                </Text>
                <Text>Try going back to previous page or home page</Text>

                <Stack>
                    <Button
                        fontWeight={600}
                        borderRadius={4}
                        mt={'75px'}
                        mb={'41px'}
                        variant="contained"
                        width={'152px'}
                        height={'48px'}
                        color={'default.whiteText'}
                        bg="default.shareModalButton"
                        onClick={() => {}}
                    >
                        Go To Home
                    </Button>
                </Stack>
                <Text>
                    {' '}
                    <Link color={'default.linkColor'}>Back to Previous Page</Link>
                </Text>
            </Square>
        </Flex>
    );
};

export default PageNotFound;
