import React, { useMemo } from 'react';

import { Box, Flex, Divider, useColorModeValue, Center, VStack, Square,Text, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import sideBarMenuIcons from '../../models/sideBarMenuData';
import './SideBarMenu.scss';
import { CreateIcon, WhiteComputeIcon, WideCreateIcon } from '../../assets/icons';
import CreateNew from '../createNew/CreateNew';


const SideBarMenu = () => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const themeSecondLevel = useColorModeValue('default.whiteText', 'dark.bgDark');
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
         <div style={{...zIndexStyle, position:'absolute', marginLeft:'212px', border:' 1px solid #D8DCDE'}} id="mySidebar" onMouseOver={hoverInSubMenu} onMouseOut={hoverOutSubMenu}>
             <Flex h={'95vh'}  as="nav" justify="space-between" wrap="wrap" bg={themeSecondLevel}  >
                 <VStack>
                     {
                         sideBarMenuIcons[0].section[currentIndex].isClicked &&
                         <Box width={'254px'}  pl={'0px'} mt="17" >
                             { sideBarMenuIcons[0].section[currentIndex].iconName === 'Create' &&
                                <h3><CreateNew/>  </h3>
                             }
                             { sideBarMenuIcons[0].section[currentIndex].iconName === 'Recent' &&
                             <h3>Add the Recent Component Here</h3>
                             }
                             { sideBarMenuIcons[0].section[currentIndex].iconName === 'Explorer' &&
                             <h3>Add the Explorer Component Here</h3>
                             }
                         </Box>
                     }
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
                                <Box width={'38px'} height={'40px'}>
                                    <Square>
                                        <CreateIcon />
                                    </Square>
                                </Box>
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

                <CommuteModal isOpen={isOpen} onClose={onClose}></CommuteModal>
            </div>
            {activateSubMenu && secondLevelMenu()}
        </Flex>
    );
};

export default SideBarMenu;
