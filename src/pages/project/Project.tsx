import React, { useEffect } from 'react';
import './project.scss';
import { Avatar, Box, Button, Center, Divider, Flex, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react';
import useAppStore from '../../store';
import { GetAllProjectsAppStoreState } from '../../models/project';
import { getAndUpdateAllProjectsData } from '../../zustandActions/projectActions';
import SearchComponent from '../../component/search/SearchComponent';
import { Documentation } from '../../assets/icons';

const Project = () => {
    const textColor = useColorModeValue('light.header', 'dark.white');
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const accesstextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    useEffect(() => {
        if (AllProjectsData === null) {
            getAndUpdateAllProjectsData();
        } else {
            console.log('Here is your Projects Data', AllProjectsData);
        }
    }, [AllProjectsData]);
    return (
        <>
            <Box marginLeft={36}>
                <Box fontSize={'24px'} fontWeight={700} ml={'24'} mt={'35'} mb={'24'}>
                    Projects
                </Box>
                <Stack spacing={4}>
                    <Text fontSize="md" ml={'24'} noOfLines={[2]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat. <br />
                        Duis aute irure dolor in reprehenderit in voluptate velit
                    </Text>
                </Stack>
                <Center flex="3" mr={5} justifyContent={'flex-end'} ml={'17'} mb={'-56px'} mt={'30px'} zIndex={2}>
                    <Box>
                        <SearchComponent />
                    </Box>
                    <Stack direction="row" height={'30'} border={'3'}>
                        {' '}
                        <Divider orientation="vertical" ml={'14'} mr={'14'} />
                    </Stack>

                    <Box>
                        <Button color={'default.whiteText'} bg={'default.hoverSideBarMenu'} variant="outline">
                            Create Project
                        </Button>
                    </Box>
                </Center>
                <Tabs defaultIndex={0} width={'96%'}>
                    <TabList ml={'44px'} mt={'34px'} width={'100%'}>
                        <Tab>All Projects</Tab>
                        <Tab ml={'26'}>My Projects</Tab>
                        <Tab ml={'26'}>Shared With Me</Tab>
                    </TabList>

                    <TabPanels ml={'44px'} mr={'10px'}>
                        <TabPanel>
                            <Box border={'1px solid'} borderColor={'#D8DCDE'} borderRadius={8} width={'100%'} height={'auto'} mt={'20'} pb={'20'}>
                                {' '}
                                <Flex ml={'17'} mt={'21'} mb={'2'}>
                                    <Center>
                                        <Box>
                                            <Text color={textColor}>Project Details</Text>
                                        </Box>
                                        <Box color={'default.containerAgGridRecords'}>
                                            <Text ml={'14'}>4 Records</Text>
                                        </Box>
                                    </Center>
                                </Flex>
                                <Flex flexWrap={'wrap'} flexDirection={'row'}>
                                    {AllProjectsData &&
                                        AllProjectsData.map((project) => {
                                            return (
                                                <>
                                                    <Box bg={'#FFFFFF'} width={'309px'} border={'1px'} borderColor={'#D8DCDE'} height={'287px'} borderRadius={8} ml={'22'} mt={'20'}>
                                                        <Box height={'69px'} bg={'#F7FAFC'} borderTopRadius={8}>
                                                            <Center ml={'24px'} pt={'8px'} justifyContent={'flex-start'}>
                                                                <Documentation color={'#666C80'} />
                                                                <Text ml={'10px'} fontWeight={700} fontSize={20} pt={'4px'}>
                                                                    {project.name}
                                                                </Text>
                                                            </Center>
                                                            <Text ml={'53'} color={'#646A78'} fontWeight={400}>
                                                                ID: {project.id}
                                                            </Text>
                                                            <Box ml={'20px'}>
                                                                <Flex>
                                                                    <Avatar p={'5px'} borderRadius="full" boxSize="42px" name={`Shirin Bampoori`} color={'default.whiteText'} mt={'21px'} />
                                                                    <Center>
                                                                        <Box width={'300px'}>
                                                                            <Text ml={10} color={accesstextColor} mt={'21px'}>
                                                                                Created by
                                                                            </Text>
                                                                            <Text ml={10} color={'#333333'} fontWeight={700}>
                                                                                {project.created_by}
                                                                            </Text>

                                                                            <Text ml={10} color={'#B3B3B3'} fontWeight={700}>
                                                                                {project.created_at.replace('T', ' ')}
                                                                            </Text>
                                                                            <Text ml={10} fontWeight={700} color={'#B3B3B3'}>
                                                                                Last Edited 10 min ago
                                                                            </Text>
                                                                        </Box>
                                                                    </Center>
                                                                </Flex>
                                                            </Box>
                                                            <Flex>
                                                                <Flex>
                                                                    <Center ml={20} mt={16}>
                                                                        <Box mr={10} bg={'#F2F4F8'} height={'24px'} borderRadius={3} width={'auto'} pr={'5px'}>
                                                                            <Text color={'#1A3F59'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                                Tag Name 1
                                                                            </Text>
                                                                        </Box>
                                                                        <Box mr={10} bg={'#F2F4F8'} height={'24px'} borderRadius={3} width={'auto'} pr={'5px'}>
                                                                            <Text color={'#1A3F59'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                                Tag Name 1
                                                                            </Text>
                                                                        </Box>
                                                                        <Box mr={10} bg={'#F2F4F8'} height={'24px'} borderRadius={3} width={'auto'} pr={'5px'}>
                                                                            <Text color={'#1A3F59'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                                +2 More
                                                                            </Text>
                                                                        </Box>
                                                                    </Center>
                                                                </Flex>
                                                            </Flex>
                                                            <Box ml={'20px'} m={'18px'}>
                                                                <Avatar mr={'6'} p={'5px'} borderRadius="full" boxSize="32px" name={'Shah zubin'} color={'default.whiteText'} />
                                                                <Avatar mr={'6'} p={'5px'} borderRadius="full" boxSize="32px" name={'Goel jalaj'} color={'default.whiteText'} />
                                                                <Avatar
                                                                    mr={'6'}
                                                                    p={'5px'}
                                                                    borderRadius="full"
                                                                    boxSize="32px"
                                                                    name={'+ 1'}
                                                                    color={'#111111'}
                                                                    bg={'white'}
                                                                    border={'1px'}
                                                                    borderColor={'#B3B3B3'}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </>
                                            );
                                        })}
                                </Flex>
                            </Box>
                        </TabPanel>
                        <TabPanel>
                            <Box border={'1px solid'} borderColor={'#D8DCDE'} borderRadius={8} width={'auto'} height={'auto'} mt={'20'}>
                                {' '}
                                <Text color={'#333333'} ml={'24'}>
                                    two!
                                </Text>
                            </Box>
                        </TabPanel>
                        <TabPanel>
                            <Box border={'1px solid'} borderColor={'#D8DCDE'} borderRadius={8} width={'auto'} height={'auto'} mt={'20'}>
                                {' '}
                                <Text>three!</Text>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    );
};

export default Project;
