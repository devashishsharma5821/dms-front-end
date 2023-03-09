import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './project.scss';
import { Avatar, Box, Center, Flex, Text, useColorModeValue, AvatarGroup } from '@chakra-ui/react';
import { Documentation } from '../../assets/icons';
import { GetAllProjectsDetail } from '../../models/project';
import { getUserNameFromId, getTruncatedText, convertTime } from '../../utils/common.utils';

const ProjectsViews = (props: any) => {
    const textColor = useColorModeValue('light.header', 'dark.white');
    const textColorPage = useColorModeValue('default.blackText', 'dark.white');
    const AllProjectsData = props.data as GetAllProjectsDetail[];
    const navigate = useNavigate();
    const AllUsersData = props.AllUsersData;
    const accessTextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const navigateToDetails = (id: string) => {
        navigate(`/projectDetails/${id}`);
    };
    return (
        <>
            <Box border={'1px solid'} borderColor={'light.lighterGrayishBlue'} borderRadius={8} width={'100%'} height={'auto'} mt={'24'} mb={'24'} pb={'98'}>
                {' '}
                <Flex ml={'24'} mt={'21'} mb={'3'}>
                    <Center>
                        <Box>
                            <Text color={textColorPage} fontWeight={700}>
                                Project Details
                            </Text>
                        </Box>
                        <Box color={'default.containerAgGridRecords'}>
                            <Text ml={'14'} fontWeight={700}>
                                {AllProjectsData?.length} Records
                            </Text>
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
                                                <Text title={project.name} ml={'10px'} fontWeight={700} fontSize={20} pt={'4px'}>
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
                                                            <Text ml={10} color={accessTextColor} mt={'21px'}>
                                                                Created by
                                                            </Text>
                                                            <Text title={project.created_by} ml={10} color={'#333333'} fontWeight={700}>
                                                                {getUserNameFromId(AllUsersData, project && project.created_by)}
                                                            </Text>

                                                            <Text ml={10} color={'#B3B3B3'} fontWeight={700}>
                                                                {convertTime(project.created_at)}
                                                            </Text>
                                                        </Box>
                                                    </Center>
                                                </Flex>
                                            </Box>
                                            <Flex width={'280px'}>
                                                <Flex width={'280px'}>
                                                    <Center ml={20} mt={16}>
                                                        {project &&
                                                            project.tags !== null &&
                                                            project.tags.map((tag, tagIndex) => {
                                                                if (tagIndex < 3) {
                                                                    return (
                                                                        <Box key={tagIndex} mr={10} bg={'#F2F4F8'} height={'24px'} borderRadius={3} width={'auto'} pr={'5px'}>
                                                                            <Text color={'#1A3F59'} fontSize={'14px'} fontWeight={600} mt={'2px'} ml={6}>
                                                                                {tagIndex > 1 ? `+ ${project.tags.length - 2} more` : tag}
                                                                            </Text>
                                                                        </Box>
                                                                    );
                                                                }
                                                            })}
                                                        {project && (project.tags === null || project.tags.length === 0) && (
                                                            <Box mr={10} bg={'#F2F4F8'} height={'24px'} borderRadius={3} width={'auto'} pr={'5px'}>
                                                                <Text color={'#1A3F59'} fontSize={'14px'} fontWeight={600} mt={'2px'} ml={6}>
                                                                    No Tags Available
                                                                </Text>
                                                            </Box>
                                                        )}
                                                    </Center>
                                                </Flex>
                                            </Flex>
                                            {project.project_access && project.project_access.length > 0 && (
                                                <Box ml={'20px'} m={'18px'}>
                                                    <AvatarGroup size={'md'} max={4} spacing={1}>
                                                        {project.project_access.map((access, accessIndex) => {
                                                            return <Avatar name={getUserNameFromId(AllUsersData, access.user_id)} color={'default.whiteText'} />;
                                                        })}
                                                    </AvatarGroup>
                                                </Box>
                                            )}
                                            {project.project_access && project.project_access.length === 0 && (
                                                <Box ml={'20px'} m={'18px'}>
                                                    <Avatar mr={'6'} p={'5px'} borderRadius="full" boxSize="32px" name={'0'} color={'#111111'} bg={'white'} border={'1px'} borderColor={'#B3B3B3'} />
                                                </Box>
                                            )}
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
