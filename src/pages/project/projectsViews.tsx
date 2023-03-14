import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './project.scss';
import { Avatar, Box, Center, Flex, Text, useColorModeValue, AvatarGroup } from '@chakra-ui/react';
import { Documentation } from '../../assets/icons';
import { GetAllProjectsDetail } from '../../models/project';
import { getUserNameFromId, getTruncatedText, convertTime } from '../../utils/common.utils';
import useAppStore from '../../store';
import { ComputeAppStoreState } from '../../models/computeDetails';

const ProjectsViews = (props: any) => {
    const textColor = useColorModeValue('light.header', 'dark.white');
    const textColorPage = useColorModeValue('default.blackText', 'dark.white');
    const AllProjectsData = props.data as GetAllProjectsDetail[];
    const [UserConfig] = useAppStore((state: ComputeAppStoreState) => [state.UserConfig]);
    const navigate = useNavigate();
    const AllUsersData = props.AllUsersData;
    const accessTextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const navigateToDetails = (id: string) => {
        navigate(`/projectDetails/${id}`);
    };
    const [windowSize, setWindowSize] = React.useState([
        window.innerWidth,
        window.innerHeight,
    ]);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    });
    return (
        <>
            <Box border={'1px solid'} borderColor={'light.lighterGrayishBlue'} overflowX={'hidden'}  overflowY={'scroll'} borderRadius={8} width={'100%'} height={windowSize[1] - 270} mt={'16'} pb={'16'} pl={10}>
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
                                        <Box key={project.id} maxHeight={'69px'} bg={'light.lightGrayishBlue'} borderTopRadius={8}>
                                            <Center ml={'23px'} pt={'8px'} justifyContent={'flex-start'}>
                                                <Documentation color={'#666C80'} />
                                                <Text title={project.name} ml={'11px'} fontWeight={700} fontSize={20} mt={'2px'} color={'default.blackText'} height={'27px'}>
                                                    {getTruncatedText(project && project.name, 20)}
                                                </Text>
                                            </Center>
                                            <Text ml={'52px'} mb={'10px'} color={'default.containerAgGridRecords'} fontWeight={400} height={'22px'}>
                                                ID: {getTruncatedText(project && project.id, 20)}
                                            </Text>
                                            <Box ml={'20px'} mr={'20px'} height={'112px'}>
                                                <Flex>
                                                    <Avatar
                                                        p={'5px'}
                                                        borderRadius="full"
                                                        boxSize="42px"
                                                        name={getUserNameFromId(AllUsersData, project && project.created_by)}
                                                        color={'default.whiteText'}
                                                        mt={'20px'}
                                                    />
                                                    <Center>
                                                        <Box width={'300px'}>
                                                            <Text ml={10} color={'default.titleForShare'} mt={'20px'} fontWeight={600} height={'22px'}>
                                                                Created by
                                                            </Text>
                                                            <Text title={project.created_by} ml={10} color={'default.blackText'} fontWeight={700} height={'20px'}>
                                                                {getUserNameFromId(AllUsersData, project && project.created_by)}
                                                            </Text>

                                                            <Text ml={10} color={'default.veryLightGrayTextColor'} fontWeight={600} height={'20px'}>
                                                                {convertTime(project.created_at)}
                                                            </Text>
                                                        </Box>
                                                    </Center>
                                                </Flex>
                                            </Box>
                                            <Flex maxWidth={'280px'}>
                                                <Flex width={'280px'} height={'44px'}>
                                                    <Center ml={20} mt={10} mb={10}>
                                                        {project &&
                                                            project.tags !== null &&
                                                            project.tags.map((tag, tagIndex) => {
                                                                if (tagIndex < 3) {
                                                                    return (
                                                                        <Box key={tagIndex} bg={'#F2F4F8'} minHeight={'24px'} borderRadius={3} width={'auto'} mr={'14px'}>
                                                                            <Text color={'#1A3F59'} fontSize={'14px'} fontWeight={600} pl={'6px'} pr={'6px'} pt={'4px'} pb={'4px'}>
                                                                                {tagIndex > 1 ? `+ ${project.tags.length - 2} more` : getTruncatedText(tag, 8)}
                                                                            </Text>
                                                                        </Box>
                                                                    );
                                                                }
                                                            })}
                                                    </Center>
                                                </Flex>
                                            </Flex>
                                            {project.project_access && project.project_access.length > 0 && (
                                                <Box ml={'20px'} mt={'10px'} height={'62px'} mb={'10px'}>
                                                    <AvatarGroup size={'md'} max={3} spacing={1}>
                                                        {project.project_access.map((access, accessIndex) => {
                                                            return <Avatar name={getUserNameFromId(AllUsersData, access.user_id)} color={'default.whiteText'} />;
                                                        })}
                                                    </AvatarGroup>
                                                </Box>
                                            )}
                                            {project.project_access && project.project_access.length === 0 && (
                                                <Box ml={'20px'} mb={'10px'} mt={'10px'} height={'62px'}>
                                                    <Avatar mr={'6'} p={'5px'} borderRadius="full" boxSize="32px" name={getUserNameFromId(AllUsersData, project.created_by)} color={'default.whiteText'} />
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
