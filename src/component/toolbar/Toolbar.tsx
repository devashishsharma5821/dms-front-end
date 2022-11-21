import React from 'react';
import { Box, Flex, Text, useColorModeValue, Button, Center, Divider, Stack, Switch, Heading, Spacer } from '@chakra-ui/react';
import RunArrow from '../../assets/icons/RunArrow';
import toolbarDataIcons from '../../models/toolbarData';

const Toolbar = () => {
    const themebg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
    return (
            <Flex height={'56px'} minWidth='max-content' alignItems='center' gap='2' pl={35}>
                    {toolbarDataIcons.section1.map((sections, sectionIndex) => {
                        return (
                            <>
                                {sections.type === 'icon' && (
                                    <Center ml={'16'} mr={'16'}>
                                        <Box mr={'8'}>{sections.component}</Box>
                                        <Box>{sections.name}</Box>
                                    </Center>
                                )}
                                {sections.type === 'moreIcon' && (
                                    <>
                                        <Box>{sections.component}</Box>
                                        <Divider orientation="vertical" ml={'14'} mr={'14'} height={'36px'} />
                                    </>
                                )}
                                {sections.type === 'switch' && (
                                    <>
                                        <Stack align="center" direction="row">
                                            <Switch size="sm" />
                                        </Stack>
                                        <Box ml={'6'}>{sections.name}</Box>
                                    </>
                                )}
                                {sections.type === 'button' && (
                                    <>
                                        <Divider orientation="vertical" ml={'14'} mr={'14'} height={'36px'} />
                                        <Button disabled={sections.disabled} variant="solid" bg={'light.button'} width={'80px'} height={'36px'} pl={'10'} pr={'10'}>
                                            <RunArrow />
                                            <Text ml={'3'}>Run</Text>
                                        </Button>
                                    </>
                                )}
                                {sections.type === 'pipelineButton' && (
                                    <>
                                        <Button variant="solid" bg={'default.displayOffButton'} width={'150px'} height={'36px'} pl={'10'} pr={'10'} ml={'14'}>
                                            {' '}
                                            <Box>{sections.component}</Box>
                                        </Button>
                                    </>
                                )}
                            </>
                        );
                    })}
                <Spacer />
                    <Flex height={'56px'} gap='2'>
                        {toolbarDataIcons.section2.map((sections, sectionIndex) => {
                            return (
                                <Center>
                                    {sections.type === 'deployedIcon' && (
                                        <>
                                            {' '}
                                            <Divider orientation="vertical" ml={'14'} mr={'14'} height={'36px'} />
                                            <Center>
                                                <Box mr={'8'}>{sections.component}</Box>
                                                <Box width={'100px'}>{sections.name}</Box>
                                            </Center>
                                        </>
                                    )}
                                    {sections.type === 'serverInfo' && (
                                        <>
                                            <Center fontWeight="medium" fontSize="sm" color={'default.containerAgGridRecords'}>
                                                <Text width={'10'}>{sections.gb}</Text>
                                                <Divider orientation="vertical" mr={'8'} height={'16px'} />
                                                <Text width={'12'}>{sections.core}</Text>
                                            </Center>
                                        </>
                                    )}
                                    {sections.type === 'downArrow' && (
                                        <>
                                            <Center flex="2" mr={5} justifyContent={'flex-end'}>
                                                <Box pl={'2'}>{sections.component}</Box>
                                            </Center>
                                        </>
                                    )}
                                </Center>
                            );
                        })}
                        </Flex>
            </Flex>
    );
};

export default Toolbar;
