import React, { useMemo } from 'react';
import { Box, Flex, Divider, useColorModeValue, Center, VStack } from '@chakra-ui/react';
import { Link as Routelink } from 'react-router-dom';
import sideBarMenuIcons from '../../models/sideBarMenuData';
import './style.scss';

const SideBarMenu = () => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const [isHovering, setIsHovering] = React.useState(false);
    const zIndexStyle = useMemo(() => ({ zIndex: '10000' }), []);
    const hoverIn = () => {
        setIsHovering(true);
    };
    const hoverOut = () => {
        setIsHovering(false);
    };

    return (
        <div style={zIndexStyle} id="mySidebar" onMouseOver={hoverIn} onMouseOut={hoverOut}>
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
                                                <Routelink to={icons.route}>
                                                    <Box mt="17">{icons.icon}</Box>
                                                </Routelink>
                                                <Center>
                                                    <Divider mt="17" orientation="horizontal" bg={'dark.borderColor'} />
                                                </Center>
                                            </>
                                        );
                                    } else {
                                        return (
                                            <Routelink to={icons.route}>
                                                <Box mt="17">{icons.icon}</Box>
                                            </Routelink>
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
                                                <Routelink to={icons.route}>
                                                    <Center className={'sidebar'}>
                                                        <Box className={'sidebarIon'} mt="17">
                                                            {icons.icon}
                                                        </Box>
                                                        <Box mt="17" pl={'6'} fontSize={'14px'} color={'default.whiteText'}>
                                                            {icons.iconName}
                                                        </Box>
                                                    </Center>
                                                </Routelink>
                                                <Center>
                                                    <Divider mt="17" orientation="horizontal" bg={'dark.borderColor'} />
                                                </Center>
                                            </>
                                        );
                                    } else {
                                        return (
                                            <Routelink to={icons.route}>
                                                <Center className={'sidebar'}>
                                                    <Box className={'sidebarIon'} mt="17">
                                                        {' '}
                                                        {icons.icon}
                                                    </Box>
                                                    <Box mt="17" pl={'6'} fontSize={'14px'} color={'default.whiteText'}>
                                                        {icons.iconName}
                                                    </Box>
                                                </Center>
                                            </Routelink>
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
    );
};

export default SideBarMenu;
