import React from 'react';
import { Box, Flex, Text, useColorModeValue, Editable, Button, Center, Avatar, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../colorModeSwitcher/ColorModeSwitcher';
import { DownArrow, PencilIcon, LogoLight, GridCanvas, LineCanvasLogo, NoneCanvasLogo } from '../../assets/icons';
import Share from '../modalSystem/Share';
import Settings from '../settings/Settings';
import ViewData from '../modalSystem/ViewData';
import NotebookModal from '../modalSystem/NotebookModal';

const Header = (props: any) => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const settingsModal = useDisclosure();
    const ViewDataModal = useDisclosure();
    const notebookModal = useDisclosure();

    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" height={'44px'} pl={'4'} bg={themebg} color={'default.lightText'}>
            <Box flex="3" ml={'16px'} mt={'7px'} mb={'7px'}>
                <LogoLight />
            </Box>
            <Center flex="3">
                <Text color={'default.lightGrayHeader'} mr={'8px'} fontSize={'18'} fontWeight={'400'} fontStyle={'normal'}>
                    Project Name
                </Text>
                <Text color={'default.lightGrayHeader'} pl={'2'}>
                    /
                </Text>
                <Text color={'default.whiteText'} pl={'2'} fontSize={'18'} fontWeight={'700'} fontStyle={'normal'} ml={'8px'}>
                    {' '}
                    My New Experiment
                </Text>

                <Editable pl={'10'} defaultValue="Take some chakra">
                    <PencilIcon color={'#A3B4D1'} height={'14px'} Height={'14px'} />
                </Editable>
            </Center>

            <Center flex="3" mr={5} justifyContent={'flex-end'}>
                <Box pl={'6'} pr={'6'}>
                    <Button onClick={onOpen} colorScheme="default.lightGrayHeader" variant="outline">
                        Share
                    </Button>
                    <Share isOpen={isOpen} onClose={onClose}></Share>
                </Box>
                <Box>
                    {' '}
                    <ColorModeSwitcher />
                </Box>
                <Menu>
                    <MenuButton ml={'24'}>
                        <GridCanvas />
                    </MenuButton>
                    <MenuList borderRadius={'0'} width={'110'} color={textColor} ml={'-46'}>
                        <MenuItem>
                            <GridCanvas />
                            <Text ml={'12'}>Dot</Text>
                        </MenuItem>
                        <MenuItem>
                            <LineCanvasLogo />
                            <Text ml={'12'}>Line</Text>
                        </MenuItem>
                        <MenuItem>
                            <NoneCanvasLogo />
                            <Text ml={'12'}>None</Text>
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Box mr={'27'} ml={'11'}>
                    <DownArrow color={'#A3B4D1'} />
                </Box>
                <Menu>
                    <MenuButton>
                        <Avatar borderRadius="full" boxSize="32px" name={`${props.firstName} ${props.lastName}`} bg={'default.userCircleHeaderBg'} color={'default.userCircleHeaderFont'} />
                    </MenuButton>
                    <MenuList width={127} borderRadius={'0'} mr={'-26'} mt={'-2'} color={textColor}>
                        <MenuItem>My Profile</MenuItem>
                        <MenuItem onClick={settingsModal.onOpen}>Settings</MenuItem>
                        <Settings isOpen={settingsModal.isOpen} onClose={settingsModal.onClose}></Settings>
                        <MenuItem>Signout</MenuItem>
                        <MenuItem onClick={ViewDataModal.onOpen}>View Data</MenuItem>
                        <ViewData isOpen={ViewDataModal.isOpen} onClose={ViewDataModal.onClose}></ViewData>
                        <MenuItem onClick={notebookModal.onOpen}>Notebook</MenuItem>
                        <NotebookModal isOpen={notebookModal.isOpen} onClose={notebookModal.onClose}></NotebookModal>
                    </MenuList>
                </Menu>
                <Box ml={'12'} mr={'23'}>
                    <DownArrow color={'#A3B4D1'} />
                </Box>
            </Center>
        </Flex>
    );
};

export default Header;
