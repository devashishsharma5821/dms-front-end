import React, { useMemo } from 'react';
import { Box, Flex, Divider, useColorModeValue, Center, VStack, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import sideBarMenuIcons from '../../models/sideBarMenuData';
import './style.scss';

const SideBarMenu = () => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const [isHovering, setIsHovering] = React.useState(false);
    const [activateSubMenu, setActivateSubMenu] = React.useState(false);
    const zIndexStyle = useMemo(() => ({ zIndex: '10000' }), []);
     const [currentIndex, setCurrentIndex] = React.useState(0);
    const navigate = useNavigate();
    const hoverIn = () => {
        setIsHovering(true);
    };
    const hoverOut = () => {
        // Turn Off the Sub Menu
        if(!activateSubMenu){
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
    const checkForSubMenuOrNavigation = (data: any, index:any) => {
        console.log('Data', data);
        if(data.route) {
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
         <div style={{...zIndexStyle, position:'absolute', marginLeft:'221px', border:' 1px solid #D8DCDE'}} id="mySidebar" onMouseOver={hoverInSubMenu} onMouseOut={hoverOutSubMenu}>
             <Flex h={'95vh'} className={''} as="nav" justify="space-between" wrap="wrap" bg={'white'} color={'black'}>
                 <VStack>
                     {
                         sideBarMenuIcons[0].section[currentIndex].isClicked &&
                         <Box width={'254px'} ml="15" mr="15" pl={'0px'} mt="17">
                             { sideBarMenuIcons[0].section[currentIndex].iconName === 'Create' &&
                                <h3>Add the Create Component Here</h3>
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
            <div style={{...zIndexStyle, position:'absolute'}} id="mySidebar" onMouseOver={hoverIn} onMouseOut={hoverOut}>
                <Flex h={'95vh'} className={''} as="nav" justify="space-between" wrap="wrap" bg={themebg} color={'default.lightText'}>
                    <VStack>
                        {!isHovering && (
                            <Box ml="15" mr="15">
                                {sideBarMenuIcons.map((sections, sectionIndex) => {
                                    const lastItemLength = sections.section.length - 1;
                                    const listSections = sections.section.map((icons, iconIndex) => {
                                        if (lastItemLength === iconIndex) {
                                            return (
                                                <>

                                                        <Box mt="17">{icons.icon}</Box>
                                                    <Center>
                                                        <Divider mt="17" orientation="horizontal" bg={'dark.borderColor'} />
                                                    </Center>
                                                </>
                                            );
                                        } else {
                                            return (
                                                    <Box mt="17">{icons.icon}</Box>
                                            );
                                        }
                                    });

                                    return listSections;
                                })}
                            </Box>
                        )}
                        {isHovering && (
                            <Box width={'212px'} ml="15" mr="15" pl={'0px'} mt="17">
                                {sideBarMenuIcons.map((sections, sectionIndex) => {
                                    const lastItemLength = sections.section.length - 1;
                                    const listSections = sections.section.map((icons, iconIndex) => {
                                        if (lastItemLength === iconIndex) {
                                            return (
                                                <>
                                                        <Center onClick={() => {checkForSubMenuOrNavigation(icons,iconIndex)}} className={'sidebar'}>
                                                            <Box className={'sidebarIon'} mt="17">
                                                                {icons.icon}
                                                            </Box>
                                                            <Box mt="17" pl={'6'} fontSize={'14px'} color={'default.whiteText'}>
                                                                {icons.iconName}
                                                            </Box>
                                                        </Center>
                                                    <Center>
                                                        <Divider mt="17" orientation="horizontal" bg={'dark.borderColor'} />
                                                    </Center>
                                                </>
                                            );
                                        } else {
                                            return (
                                                    <Center onClick={() => {checkForSubMenuOrNavigation(icons, iconIndex)}} className={'sidebar'}>
                                                        <Box className={'sidebarIon'} mt="17">
                                                            {' '}
                                                            {icons.icon}
                                                        </Box>
                                                        <Box mt="17" pl={'6'} fontSize={'14px'} color={'default.whiteText'}>
                                                            {icons.iconName}
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
            </div>
            {
                activateSubMenu && secondLevelMenu()
            }


        </Flex>

    );
};

export default SideBarMenu;
