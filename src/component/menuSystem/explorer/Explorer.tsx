import React, { useEffect, useMemo } from 'react';
import './Explorer.scss';
import { Box, Center, Divider, Flex, Square, Text, useColorModeValue, VStack, Accordion, AccordionItem, AccordionPanel, AccordionButton, AccordionIcon } from '@chakra-ui/react';
import { RightArrow, WhiteExperiment } from '../../../assets/icons';
import { getAndUpdateAllProjectsData } from '../../../zustandActions/projectActions';
import useAppStore from '../../../store';
import { GetAllProjectsAppStoreState } from '../../../models/project';
import { updateSpinnerInfo } from '../../../zustandActions/commonActions';
import SearchComponent from '../../search/SearchComponent';
import { getTruncatedText } from '../../../utils/common.utils';

const Explorer = (props: any) => {
    const textColor = useColorModeValue('default.darkBlack', 'default.whiteText');
    const explorerTitle = useColorModeValue('default.blackText', 'default.whiteText');
    const explorerInnerTitle = useColorModeValue('default.darkBlack', 'default.whiteText');
    const iconsColor = useColorModeValue(' #666C80', 'white');
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [subMenuForExplorer, setSubMenuForExplorer] = React.useState<any>();
    const [UserConfig] = useAppStore((state: any) => [state.UserConfig]);
    const checkForSubMenuOrNavigation = (selectedProjectId: any) => {
        props.hasThirdLevelMenu(selectedProjectId.id);
    };
    useEffect(() => {
        updateSpinnerInfo(true);
        if (AllProjectsData === null) {
            getAndUpdateAllProjectsData();
        } else {
            const userId = UserConfig.userConfiguration.user.userId;
            const userOnlyProjects = AllProjectsData.filter((project) => {
                return project.created_by === userId;
            });
            const sharedWithMe = AllProjectsData.filter((project) => {
                return project.created_by !== userId;
            });
            const explorerState = [
                {
                    name: 'My Projects',
                    hasSubMenu: userOnlyProjects,
                    expanded: false
                },
                {
                    name: 'Shared with me',
                    hasSubMenu: sharedWithMe,
                    expanded: false
                }
            ];
            setSubMenuForExplorer(explorerState);
            updateSpinnerInfo(false);
        }
    }, [AllProjectsData]);

    return (
        <>
            {AllProjectsData && (
                <>
                    <Flex mt={'1px'}>
                        <Square ml={'18px'} className="sidebar-box-icon">
                            <WhiteExperiment color={iconsColor} />
                        </Square>
                        <Text fontWeight={800} ml={'11px'} color={explorerTitle}>
                            Explorer
                        </Text>
                    </Flex>

                    <Divider mt={'16px'} mb={'8px'} orientation="horizontal" bg={'light.lighterGrayishBlue'} />
                    <Box width={'226px'} height={'16px'} ml={'14px'}>
                        <SearchComponent />
                    </Box>
                    <Box mt={'24px'}>
                        {subMenuForExplorer &&
                            subMenuForExplorer.map((section: any, sectionIndex: number) => {
                                return (
                                    <Box>
                                        <Accordion allowMultiple cursor={'pointer'}>
                                            <AccordionItem>
                                                <h2>
                                                    <AccordionButton bg={'light.lightGrayishBlue'}>
                                                        <Box ml={'16px'}>
                                                            <AccordionIcon color={'#646A78'} />
                                                        </Box>
                                                        <Box as="span" flex="1" textAlign="left" color={explorerInnerTitle} fontWeight={700} ml={'8px'} height={'44px'} pt={'12px'}>
                                                            {section.name}
                                                        </Box>
                                                        <Square size="26px" bg="white" color="#646A78" mr={'12px'} borderRadius={4} border={'1px'} borderColor={'#E3E3E3'} fontWeight={700}>
                                                            {section.hasSubMenu.length}
                                                        </Square>
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    {section.hasSubMenu.map((project: any, projectIndex: any) => {
                                                        return (
                                                            <Box
                                                                key={project.id}
                                                                onClick={() => {
                                                                    checkForSubMenuOrNavigation(project);
                                                                }}
                                                                className="sidebar-box-recent"
                                                            >
                                                                <Flex width={'254px'} mr={'10px'} height={'44px'} justifyContent={'flex-start'}>
                                                                    <Box width={'80%'} ml={'44px'} mt={'10px'} color={textColor} fontWeight={400}>
                                                                        {' '}
                                                                        {getTruncatedText(project && project.name, 16)}
                                                                    </Box>
                                                                    <Center width={'20%'} justifyContent={'fle'} mr={'-8px'}>
                                                                        <RightArrow color={iconsColor} />
                                                                    </Center>
                                                                </Flex>
                                                            </Box>
                                                        );
                                                    })}
                                                </AccordionPanel>
                                            </AccordionItem>
                                        </Accordion>
                                    </Box>
                                );
                            })}
                    </Box>
                </>
            )}
        </>
    );
};

export default Explorer;
