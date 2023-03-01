import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './project.scss';
import { Avatar, Box, Center, Flex, Text, useColorModeValue } from '@chakra-ui/react';

import { Documentation } from '../../assets/icons';
import { GetAllProjectsDetail } from '../../models/project';
import { getAndUpdateAllUsersData } from '../../zustandActions/commonActions';
import useAppStore from '../../store';
import { GetAllUsersDataAppStoreState } from '../../models/profile';
import { getUserNameFromId, getTruncatedText } from '../../utils/common.utils';
const ProjectsViews = (props: any) => {
    const textColor = useColorModeValue('light.header', 'dark.white');
    const AllProjectsData = props.data as GetAllProjectsDetail[];
    const navigate = useNavigate();
    const [AllUsersData] = useAppStore((state: GetAllUsersDataAppStoreState) => [state.AllUsersData]);
    const accessTextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const navigateToDetails = (id: string) => {
        navigate(`/projectDetails/${id}`);
    };
    useEffect(() => {
        if (AllUsersData === null) {
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        }
    }, [AllUsersData]);
    return (
        <>
            <Box border={'1px solid'} borderColor={'#D8DCDE'} borderRadius={8} width={'100%'} height={'auto'} mt={'20'} pb={'20'}>
                {' '}
                <Flex ml={'17'} mt={'21'} mb={'2'}>
                    <Center>
                        <Box>
                            <Text color={textColor}>Project Details</Text>
                        </Box>
                        <Box color={'default.containerAgGridRecords'}>
                            <Text ml={'14'}>{AllProjectsData?.length} Records</Text>
                        </Box>
                    </Center>
                </Flex>
                <Flex flexWrap={'wrap'} flexDirection={'row'}>
                    {AllProjectsData &&
                        AllUsersData &&
                        AllProjectsData.map((project: GetAllProjectsDetail) => {
                            return (
                                <div key={project.id}>
                                    <Box
                                        key={project.id}
                                        cursor={'pointer'}
                                        onClick={() => navigateToDetails(project.id)}
                                        bg={'#FFFFFF'}
                                        width={'309px'}
                                        border={'1px'}
                                        borderColor={'#D8DCDE'}
                                        height={'287px'}
                                        borderRadius={8}
                                        ml={'22'}
                                        mt={'20'}
                                    >
                                        <Box key={project.id} height={'69px'} bg={'#F7FAFC'} borderTopRadius={8}>
                                            <Center ml={'24px'} pt={'8px'} justifyContent={'flex-start'}>
                                                <Documentation color={'#666C80'} />
                                                <Text title={project.name} ml={'10px'} fontWeight={700} fontSize={20} pt={'4px'} color={'default.blackText'}>
                                                    {getTruncatedText(project && project.name)}
                                                </Text>
                                            </Center>
                                            <Text ml={'53'} color={'#646A78'} fontWeight={400}>
                                                ID: {project.id}
                                            </Text>
                                            <Box ml={'20px'}>
                                                <Flex>
                                                    <Avatar
                                                        p={'5px'}
                                                        borderRadius="full"
                                                        boxSize="42px"
                                                        name={getUserNameFromId(AllUsersData, project && project.created_by)}
                                                        color={'default.whiteText'}
                                                        mt={'21px'}
                                                    />
                                                    <Center>
                                                        <Box width={'300px'}>
                                                            <Text ml={10} color={'default.blackText'} mt={'21px'}>
                                                                Created by
                                                            </Text>
                                                            <Text title={project.created_by} ml={10} color={'#333333'} fontWeight={700}>
                                                                {getUserNameFromId(AllUsersData, project && project.created_by)}
                                                            </Text>

                                                            <Text ml={10} color={'#B3B3B3'} fontWeight={700}>
                                                                {project.created_at.replace('T', ' ')}
                                                            </Text>
                                                            <Text ml={10} fontWeight={700} color={'#B3B3B3'}>
                                                                Last Edited 10 min ago
                                                            </Text>
                                                        </Box>

                                                        <Flex>
                                                            <Flex>
                                                                <Center ml={20} mt={16}>
                                                                    {project && project.tags !== null &&  project.tags.map((tag, tagIndex) => {
                                                                        return (
                                                                            <Box key={tagIndex} mr={10} bg={'#F2F4F8'} height={'24px'} borderRadius={3} width={'auto'} pr={'5px'}>
                                                                                <Text color={'#1A3F59'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                                    {tag}
                                                                                </Text>
                                                                            </Box>
                                                                        )
                                                                    })}
                                                                    {project && project.tags === null &&
                                                                    <Box mr={10} bg={'#F2F4F8'}
                                                                         height={'24px'} borderRadius={3} width={'auto'}
                                                                         pr={'5px'}>
                                                                        <Text color={'#1A3F59'} fontSize={'14px'}
                                                                              mt={'2px'} ml={6}>
                                                                            No Tags Available
                                                                        </Text>
                                                                    </Box>
                                                                    }
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
                                                <Avatar mr={'6'} p={'5px'} borderRadius="full" boxSize="32px" name={'+ 1'} color={'#111111'} bg={'white'} border={'1px'} borderColor={'#B3B3B3'} />
                                            </Box>
                                        </Box>
                                    </Box>
                                </div>
                            );
                        })}
                </Flex>
            </Box>
        </>
    );
};

export default ProjectsViews;
