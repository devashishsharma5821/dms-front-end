import React from 'react';
import { useColorMode, useColorModeValue, IconButtonProps, Flex, IconButton, Text, Stack } from '@chakra-ui/react';
import { SwitchOff, SwitchOn } from '../../assets/icons';

export const ColorModeSwitcher = (props: Omit<IconButtonProps, 'aria-label'>) => {
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('Dark Mode', 'Light Mode');
    const SwitchIcon: any = useColorModeValue(SwitchOff, SwitchOn);

    return (
        <Flex>
            <Stack spacing={8} direction="row">
                <IconButton
                    _active={{ bg: 'none' }}
                    _hover={{ bg: 'none' }}
                    {...props}
                    aria-label={`Switch to ${text} mode`}
                    variant="ghost"
                    onClick={toggleColorMode}
                    icon={<SwitchIcon />}
                    size="md"
                    fontSize="lg"
                />
                <Text fontSize={16} color={'default.headerTitleColor'} alignSelf="center" fontWeight={400} line-height={'24px'}>
                    {text}
                </Text>
            </Stack>
        </Flex>
    );
};
