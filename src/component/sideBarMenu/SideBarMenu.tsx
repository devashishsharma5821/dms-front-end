import React from 'react';
import { Box, Flex, Divider, useColorModeValue, Center, VStack } from '@chakra-ui/react';
import { Link as Routelink } from 'react-router-dom';
import sideBarMenuIcons from '../../models/sideBarMenuData';

const SideBarMenu = () => {
    const themebg = useColorModeValue('light.header', 'dark.header');

    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" ml="15" mr="15" bg={themebg} color={'default.lightText'}>
            <VStack>
                <Box>
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
            </VStack>
        </Flex>
    );
};

export default SideBarMenu;
