import React from 'react';
import { Box, Flex, Text, useColorModeValue, Button, Center, Divider, LightMode, Stack, Switch } from '@chakra-ui/react';
import Settings from '../../assets/icons/Settings';
import DownArrowToolbar from '../../assets/DownArrowToolbar';
import Output from '../../assets/icons/Output';
import RunArrow from '../../assets/icons/RunArrow';
import VariableToolbar from '../../assets/icons/VariableToolbar';
import SaveAs from '../../assets/icons/SaveAs';
import MoreIconToolbar from '../../assets/icons/MoreIconToolbar';
import DeployedIcon from '../../assets/icons/DeployedIcon';
import DeployPipelineButton from '../../assets/icons/DeployPipelineButton';

const ToolbarIcons = [
    {
        component: <Settings />,
        name: 'Setting',
        type: 'icon'
    },
    {
        component: <Output />,
        name: 'Output',
        type: 'icon'
    },
    {
        component: <VariableToolbar />,
        name: 'Variables',
        type: 'icon'
    },
    {
        component: <SaveAs />,
        name: 'SaveAs',
        type: 'icon'
    },
    { component: <MoreIconToolbar />, name: 'Run', type: 'moreIcon' },

    {
        name: 'Comments',
        type: 'switch'
    },

    {
        name: 'Run',
        type: 'button',
        disabled: false
    },
    { component: <DeployPipelineButton />, name: 'Deploy Pipeline', type: 'pipelineButton', disabled: true },
    { component: <DeployedIcon />, name: 'my-compute1', type: 'deployedIcon' },
    {
        gb: '8 GB',
        core: '4 Core',
        type: 'serverInfo'
    },
    { component: <DownArrowToolbar />, name: 'downArrow', type: 'downArrow' }
];
const Toolbar = () => {
    const themebg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" height={'56px'} pl={'4'} bg={themebg}>
            <Center flex="2" mr={12}>
                <Center>
                    {ToolbarIcons.map((sections, sectionIndex) => {
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
                                            <Text width={'10'}>{sections.core}</Text>
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
                            </>
                        );
                    })}
                </Center>
            </Center>
        </Flex>
    );
};

export default Toolbar;
