import React, { useEffect, useMemo } from 'react';
import './Explorer.scss';
import { Box, Center, Divider, Flex, Square, Text, useColorModeValue, VStack, Accordion, AccordionItem, AccordionPanel, AccordionButton, AccordionIcon } from '@chakra-ui/react';
import { RightArrow, WhiteExperiment } from '../../../assets/icons';
import { getAndUpdateAllProjectsData } from '../../../zustandActions/projectActions';
import useAppStore from '../../../store';
import { GetAllProjectsAppStoreState } from '../../../models/project';
import { updateSpinnerInfo } from '../../../zustandActions/commonActions';

const Explorer = (props: any) => {
    const textColor = useColorModeValue('dark.header', 'default.whiteText');
    const iconsColor = useColorModeValue(' #666C80', 'white');
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [subMenuForExplorer, setSubMenuForExplorer] = React.useState<any>([]);
    const [UserConfig] = useAppStore((state: any) => [state.UserConfig]);
    const checkForSubMenuOrNavigation = (selectedProjectId: any) => {
            props.hasThirdLevelMenu(selectedProjectId.id);
    };
    useEffect(() => {
        updateSpinnerInfo(true);
        if (AllProjectsData === null) {
            getAndUpdateAllProjectsData();
        } else {
            console.log('All Projects Data', AllProjectsData);
            const userId = UserConfig.userConfiguration.user.userId;
            const userOnlyProjects = AllProjectsData.filter((project) => {
                return project.created_by === userId;
            });
            const sharedWithMe = AllProjectsData.filter((project) => {
                return project.created_by !== userId;
            });
            console.log("1",userOnlyProjects )
            console.log("1",sharedWithMe )
            const explorerState = [
                {
                    name: 'My Projects',
                    hasSubMenu: userOnlyProjects
                },
                {
                    name: 'Shared with me',
                    hasSubMenu: sharedWithMe
                }
            ];
            setSubMenuForExplorer(explorerState);
            updateSpinnerInfo(false);
        }
    }, [AllProjectsData]);
    return (
        <>
            {
                AllProjectsData &&
                    <>
                        <Flex mt={'1px'}>
                            <Square ml={'16px'} className="sidebar-box-icon">
                                <WhiteExperiment color={iconsColor} />
                            </Square>
                            <Text fontWeight={800} ml={'11px'} color={textColor}>
                                Explorer
                            </Text>
                        </Flex>

                        <Divider mt={'16px'} orientation="horizontal" bg={'light.lighterGrayishBlue'} />

                        {subMenuForExplorer &&
                        subMenuForExplorer.map((section: any, sectionIndex: number) => {
                            return (
                                <Box>
                                    <Accordion defaultIndex={[0]} allowMultiple>
                                        <AccordionItem>
                                            <h2>
                                                <AccordionButton>
                                                    <AccordionIcon />
                                                    <Box as="span" flex='1' textAlign='left'>
                                                        {section.name}
                                                    </Box>
                                                    <Square size='20px' bg='purple.700' color='white'>
                                                        {section.hasSubMenu.length}
                                                    </Square>
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                {
                                                    section.hasSubMenu.map((project: any, projectIndex: any) => {
                                                      return (
                                                          <Box
                                                              key={project.id}
                                                              onClick={() => {
                                                                  checkForSubMenuOrNavigation(project);
                                                              }}
                                                              className="sidebar-box-recent"
                                                          >
                                                              <Flex mr={'10px'} height={'44px'}>
                                                                  <Box textAlign={'center'} ml={'17px'} mt={'10px'} color={textColor}>
                                                                      {' '}
                                                                      {project.name}{' '}
                                                                  </Box>
                                                                  <Center flex="2" justifyContent={'flex-end'} mr={'24px'}>
                                                                      <RightArrow color={iconsColor} />
                                                                  </Center>
                                                              </Flex>
                                                          </Box>
                                                      )
                                                    })
                                                }
                                            </AccordionPanel>
                                        </AccordionItem>
                                    </Accordion>
                                </Box>
                            );
                        })}
                    </>
            }
        </>
    );
};

export default Explorer;
