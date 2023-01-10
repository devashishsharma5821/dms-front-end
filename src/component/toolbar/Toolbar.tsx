import React from 'react';
import {
    Box,
    Flex,
    Text,
    Button,
    Center,
    Divider,
    Stack,
    Switch,
    Spacer,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverFooter,
    ButtonGroup,
    Link,
    useColorModeValue
} from '@chakra-ui/react';
import RunArrow from '../../assets/icons/RunArrow';
import toolbarDataIcons from '../../models/toolbarData';
import Comments from '../comments/Comments';
import DeployedIcon from '../../assets/icons/DeployedIcon';
import DeployedNotRunningIcon from '../../assets/icons/DeployNotRunning';

const Toolbar = (props: any) => {
    const textColor = useColorModeValue('default.blackText', 'default.whiteText');
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Flex height={'56px'} minWidth="max-content" alignItems="center" gap="2" pl={90}>
            {toolbarDataIcons.section1.map((sections, sectionIndex) => {
                return (
                    <>
                        {sections.type === 'icon' && (
                            <Center ml={'16'} mr={'16'} >
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
                                    <Switch onChange={onOpen} size="sm" />
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
            <Flex height={'56px'} gap="2">
                {props?.computeData?.length !== 0 &&
                    toolbarDataIcons.section2.map((sections, sectionIndex) => {
                        return (
                            <>
                                <Center>
                                    {sections.type === 'deployedIcon' && (
                                        <>
                                            <Divider orientation="vertical" ml={'14'} mr={'14'} height={'36px'} />
                                            <Center mr={'10px'}>
                                                <Box mr={'8'}>{sections.component}</Box>
                                                <Box>{sections.name}</Box>
                                            </Center>
                                        </>
                                    )}
                                    {sections.type === 'serverInfo' && (
                                        <>
                                            <Center fontWeight="medium" fontSize="sm" color={'default.containerAgGridRecords'}>
                                                <Text>{sections.gb}</Text>
                                                <Divider orientation="vertical" mr={'8'} height={'16px'} />
                                                <Text>{sections.core}</Text>
                                            </Center>
                                        </>
                                    )}
                                    {sections.type === 'downArrow' && (
                                        <>
                                            <Popover placement="bottom" isLazy={true} closeOnEsc={true} size={'sm'} variant="responsive">
                                                <PopoverTrigger>
                                                    <Button disabled={props?.computeData?.length === 0}>
                                                        <Box pl={'2'}>{sections.component}</Box>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <PopoverBody mt={'5px'}>
                                                        {props?.computeData?.length !== 0 &&
                                                            props?.computeData?.map((compute: any) => {
                                                                return (
                                                                    <Flex pb={'10px'} justifyContent={'space-between'}>
                                                                        <Center>
                                                                            {compute?.active ? (
                                                                                <Box mr={'8'}>
                                                                                    {' '}
                                                                                    <DeployedIcon />
                                                                                </Box>
                                                                            ) : (
                                                                                <Box mr={'8'}>
                                                                                    <DeployedNotRunningIcon />
                                                                                </Box>
                                                                            )}
                                                                            <Box fontWeight={'600'} fontSize={'16px'} color={textColor}>
                                                                                {compute?.name}
                                                                            </Box>
                                                                        </Center>
                                                                        <Center fontWeight="medium" fontSize="sm" color={'default.containerAgGridRecords'}>
                                                                            <Text>{compute?.memory}</Text>
                                                                            <Divider orientation="vertical" mr={'8'} height={'16px'} />
                                                                            <Text>{compute?.cpu}</Text>
                                                                        </Center>
                                                                    </Flex>
                                                                );
                                                            })}
                                                    </PopoverBody>
                                                    <PopoverFooter border="0" display="flex" alignItems="center" justifyContent="center" pb={4}>
                                                        <ButtonGroup size="sm">
                                                            <Link color="teal.500" href="#">
                                                                Create Compute
                                                            </Link>
                                                        </ButtonGroup>
                                                    </PopoverFooter>
                                                </PopoverContent>
                                            </Popover>
                                        </>
                                    )}
                                </Center>
                            </>
                        );
                    })}
                {props?.computeData?.length === 0 && (
                    <Center mr={'40px'}>
                        <ButtonGroup size="sm">
                            <Link color="teal.500" href="#">
                                No Compute Found
                            </Link>
                        </ButtonGroup>
                    </Center>
                )}
            </Flex>
            <Comments isOpen={isOpen} onClose={onClose}></Comments>
        </Flex>
    );
};

export default Toolbar;
