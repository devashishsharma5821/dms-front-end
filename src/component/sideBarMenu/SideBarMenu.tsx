import React, { useMemo } from 'react';
import {
    Box,
    Flex,
    Divider,
    useColorModeValue,
    Center,
    VStack,
    Square,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Switch,
    Text,
    Tooltip
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import sideBarMenuIcons from '../../models/sideBarMenuData';
import './style.scss';
import { CreateIcon, WideCreateIcon } from '../../assets/icons';
import BlackbottomedTriangleIcon from '../../assets/icons/BlackbottomedTriangleIcon';
import InfoIcon from '../../assets/icons/InfoIcon';
import './SideBarMenu.scss';

const SideBarMenu = () => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const [isHovering, setIsHovering] = React.useState(false);
    const [activateSubMenu, setActivateSubMenu] = React.useState(false);
    const zIndexStyle = useMemo(() => ({ zIndex: '10000' }), []);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const hoverIn = () => {
        setIsHovering(true);
    };
    const hoverOut = () => {
        // Turn Off the Sub Menu
        if (!activateSubMenu) {
            setActivateSubMenu(false);
            setIsHovering(false);
        }
    };
    const hoverInSubMenu = () => {
        setActivateSubMenu(true);
        setIsHovering(true);
    };
    const hoverOutSubMenu = () => {
        setActivateSubMenu(false);
        setIsHovering(false);
    };
    const checkForSubMenuOrNavigation = (data: any, index: any) => {
        console.log('Data', data);
        if (data.route) {
            sideBarMenuIcons[0].section[currentIndex].isClicked = false;
            navigate(data.route);
        } else if (data.hasSubMenu) {
            // Turn on the Sub Menu
            //data.isClicked = true;
            sideBarMenuIcons[0].section[currentIndex].isClicked = false;
            setCurrentIndex(index);
            sideBarMenuIcons[0].section[index].isClicked = true;
            setActivateSubMenu(true);
        }
    };

    const secondLevelMenu = () => {
        console.log('Switch', sideBarMenuIcons);
        return (
            <div style={{ ...zIndexStyle, position: 'absolute', marginLeft: '200px', border: ' 1px solid #D8DCDE' }} id="mySidebar" onMouseOver={hoverInSubMenu} onMouseOut={hoverOutSubMenu}>
                <Flex h={'95vh'} as="nav" justify="space-between" wrap="wrap" bg={'white'} color={'black'}>
                    <VStack>
                        {sideBarMenuIcons[0].section[currentIndex].isClicked && (
                            <Box width={'254px'} ml="15" mr="15" pl={'0px'} mt="17">
                                {sideBarMenuIcons[0].section[currentIndex].iconName === 'Create' && <h3>Add the Create Component Here</h3>}
                                {sideBarMenuIcons[0].section[currentIndex].iconName === 'Recent' && <h3>Add the Recent Component Here</h3>}
                                {sideBarMenuIcons[0].section[currentIndex].iconName === 'Explorer' && <h3>Add the Explorer Component Here</h3>}
                            </Box>
                        )}
                    </VStack>
                </Flex>
            </div>
        );
    };
    return (
        <Flex>
            <div style={{ ...zIndexStyle, position: 'absolute' }} id="mySidebar" onMouseOver={hoverIn} onMouseOut={hoverOut}>
                <Flex h={'95vh'} className={''} as="nav" justify="space-between" wrap="wrap" bg={themebg} color={'default.lightText'}>
                    <VStack>
                        {!isHovering && (
                            <Box ml="6" mr="6" mt="30">
                                {/*<Box  width={'38px'}  height={'40px'}>*/}
                                {/*    <Square ><CreateIcon/></Square>*/}
                                {/*</Box>*/}
                                {sideBarMenuIcons.map((sections, sectionIndex) => {
                                    const lastItemLength = sections.section.length - 1;
                                    const listSections = sections.section.map((icons, iconIndex) => {
                                        if (lastItemLength === iconIndex) {
                                            return (
                                                <>
                                                    <Box m={'8px auto'} pt={'20%'} width={'38px'} height={'40px'}>
                                                        <Square>{icons.icon}</Square>
                                                    </Box>
                                                    <Center>
                                                        <Divider orientation="horizontal" bg={'dark.borderColor'} />
                                                    </Center>
                                                </>
                                            );
                                        } else {
                                            return (
                                                <Box m={'8px auto'} width={'38px'} pt={'20%'} height={'40px'}>
                                                    <Square>{icons.icon}</Square>
                                                </Box>
                                            );
                                        }
                                    });

                                    return listSections;
                                })}
                            </Box>
                        )}
                        {isHovering && (
                            <Box width="212px" mt="30">
                                <Box width={'200px'} ml={'6px'} mr={'6px'} height={'40px'} mb={'9px'} onClick={onOpen}>
                                    <Square>
                                        <WideCreateIcon />
                                    </Square>
                                </Box>
                                {sideBarMenuIcons.map((sections, sectionIndex) => {
                                    const lastItemLength = sections.section.length - 1;
                                    const listSections = sections.section.map((icons, iconIndex) => {
                                        if (lastItemLength === iconIndex) {
                                            return (
                                                <>
                                                    <Center
                                                        onClick={() => {
                                                            checkForSubMenuOrNavigation(icons, iconIndex);
                                                        }}
                                                        className={'sidebar'}
                                                    >
                                                        <Box m={'8px 8px'} width={'30px'} height={'32px'}>
                                                            <Square>{icons.icon}</Square>
                                                        </Box>
                                                        <Box pl={'6px'} fontSize={'14px'} m={'8px 0px'} width={'30px'} height={'32px'} color={'default.whiteText'}>
                                                            <Square className="text">{icons.iconName}</Square>
                                                        </Box>
                                                    </Center>
                                                    <Center>
                                                        <Divider mb={'8px'} ml={'8px'} mr={'8px'} orientation="horizontal" bg={'dark.borderColor'} />
                                                    </Center>
                                                </>
                                            );
                                        } else {
                                            return (
                                                <Center
                                                    onClick={() => {
                                                        checkForSubMenuOrNavigation(icons, iconIndex);
                                                    }}
                                                    className={'sidebar'}
                                                >
                                                    <Box m={'8px 8px'} width={'30px'} height={'32px'}>
                                                        <Square>{icons.icon}</Square>
                                                    </Box>
                                                    <Box pl={'6px'} fontSize={'14px'} m={'8px 0px'} width={'30px'} height={'32px'} color={'default.whiteText'}>
                                                        <Square className="text">{icons.iconName}</Square>
                                                    </Box>
                                                </Center>
                                            );
                                        }
                                    });

                                    return listSections;
                                })}
                            </Box>
                        )}
                    </VStack>
                </Flex>

                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent width={630} maxWidth={630} height="var(--chakra-space-464)" color="#171717">
                        <ModalHeader height="var(--chakra-space-60)" fontSize={16} borderBottom="1px solid #EAEAEA" fontWeight="700" flex={'none'} padding={20}>
                            Edit Compute
                        </ModalHeader>
                        <ModalCloseButton mt={10} />
                        <ModalBody padding={20}>
                            <FormControl>
                                <FormLabel>
                                    Compute Name{' '}
                                    <Text as="sup" color="#ED1C24" fontSize={16} fontWeight="bold" verticalAlign={'sub'}>
                                        *
                                    </Text>
                                </FormLabel>
                                <Input type="text" />
                            </FormControl>
                            <Box mt={22} display="flex" mb={20}>
                                <FormControl width={327}>
                                    <FormLabel>
                                        Worker Type{' '}
                                        <Text as="sup" color="#ED1C24" fontSize={16} fontWeight="bold" verticalAlign={'sub'}>
                                            *
                                        </Text>
                                        <Tooltip label="Right end" placement="right-end" hasArrow>
                                            <Text display={'inline-block'} ml={2}>
                                                <InfoIcon />
                                            </Text>
                                        </Tooltip>
                                    </FormLabel>
                                    <Select
                                        placeholder="Standard_DS3_v2   56 GB | 16 Cores"
                                        icon={
                                            <Text mt={10} marginRight={'13'}>
                                                <BlackbottomedTriangleIcon />
                                            </Text>
                                        }
                                    >
                                        <option>Standard_DS3_v2 56 GB | 16 Cores </option>
                                    </Select>
                                </FormControl>
                                <FormControl width={112} ml={24}>
                                    <FormLabel>
                                        Min Workers
                                        <Text as="sup" color="#ED1C24" fontSize={16} fontWeight="bold" verticalAlign={'sub'}>
                                            *
                                        </Text>
                                    </FormLabel>
                                    <Input type="text" />
                                </FormControl>
                                <FormControl width={113} ml={16}>
                                    <FormLabel>
                                        Max Workers
                                        <Text as="sup" color="#ED1C24" fontSize={16} fontWeight="bold" verticalAlign={'sub'}>
                                            *
                                        </Text>
                                    </FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            </Box>
                            <FormControl display="flex" alignItems="center" mb={16}>
                                <Switch id="spot-instances" width={30} height={15} />
                                <FormLabel htmlFor="spot-instances" mb="0" ml={7}>
                                    Spot instances
                                </FormLabel>
                            </FormControl>
                            <FormControl display="flex" alignItems="center" mb={14}>
                                <Switch id="enable-autoscaling" />
                                <FormLabel htmlFor="enable-autoscaling" mb="0" ml={7}>
                                    Enable autoscaling
                                </FormLabel>
                            </FormControl>
                            <FormControl display="flex" alignItems="center">
                                <Switch id="terminate-after" />
                                <FormLabel htmlFor="terminate-after" mb="0" ml={7}>
                                    Terminate after
                                </FormLabel>
                                <Input type="text" width="var(--chakra-space-44)" />
                                <FormLabel mb="0" ml={8}>
                                    minutes of inactivity
                                </FormLabel>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter height="var(--chakra-space-75)" borderTop="1px solid #EAEAEA" padding={'20'}>
                            <Button colorScheme="blue" fontSize={16} variant="outline" pt={'10'} pb={'10'} pl={'17'} pr={'17'}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" fontSize={16} ml={15} pt={'10'} pb={'10'} pl={'17'} pr={'17'}>
                                Create
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
            {activateSubMenu && secondLevelMenu()}
        </Flex>
    );
};

export default SideBarMenu;
