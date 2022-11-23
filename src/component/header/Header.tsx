import React from 'react';
import { Box, Flex, Text, useColorModeValue, Editable, Button, Center, Avatar, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../colorModeSwitcher/ColorModeSwitcher';
import { DownArrow, PencilIcon, LogoLight } from '../../assets/icons';

const Header = () => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" height={'44px'} pl={'4'} bg={themebg} color={'default.lightText'}>
            <Box flex="3" ml={'2'}>
                <LogoLight />
            </Box>

            <Center flex="3">
                <Text color={'default.lightGrayHeader'} fontSize={'18'} fontStyle={'normal'}>
                    Project Name
                </Text>
                <Text color={'default.lightGrayHeader'} pl={'2'}>
                    /
                </Text>
                <Text color={'default.whiteText'} pl={'2'} fontSize={'18'} fontWeight={'700'} fontStyle={'normal'}>
                    {' '}
                    My New Experiment
                </Text>

                <Editable pl={'10'} defaultValue="Take some chakra">
                    <PencilIcon />
                </Editable>
            </Center>

            <Center flex="3" mr={5} justifyContent={'flex-end'}>
                <Box>
                    {' '}
                    <ColorModeSwitcher />
                </Box>
                <Box pl={'6'} pr={'6'}>
                    <Button colorScheme="default.lightGrayHeader" variant="outline">
                        Share
                    </Button>
                </Box>
                <Menu>
                    <MenuButton>
                        <Avatar borderRadius="full" boxSize="32px" name={'Shirin Bampoori'} bg={'default.userCircleHeaderBg'} color={'default.userCircleHeaderFont'} />
                    </MenuButton>
                    <MenuList width={127} borderRadius={'0'} mr={'-20'} mt={'-2'} color={textColor}>
                        <MenuItem>My Profile</MenuItem>
                        <MenuItem>Settings</MenuItem>
                        <MenuItem>Signout</MenuItem>
                    </MenuList>
                </Menu>
                <Box color={'default.whiteText'} ml={'5'} mr={'11'}>
                    {' '}
                    <DownArrow />
                </Box>
            </Center>
        </Flex>
    );
};

export default Header;
