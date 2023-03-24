import React, { useEffect } from 'react';
import './projectDetailsMenu.scss';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Center, Divider, Flex, Square, Text, useColorModeValue } from '@chakra-ui/react';
import { updateSpinnerInfo } from '../../../../zustandActions/commonActions';
import useAppStore from '../../../../store';
import { GetSingleProjectAppStoreState } from '../../../../models/project';
import { RightArrow } from '../../../../assets/icons/RightArrow';
import { useNavigate } from 'react-router-dom';
import { getTruncatedText } from '../../../../utils/common.utils';

const ProjectDetailsMenu = (props: any) => {
    const iconsColor = useColorModeValue(' #666C80', 'white');
    const explorerInnerTitle = useColorModeValue('default.darkBlack', 'default.whiteText');
    const textColor = useColorModeValue('dark.header', 'default.whiteText');
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    const [menuForProjectDetails, setMenuForProjectDetails] = React.useState<any>([]);
    const navigate = useNavigate();
    const checkForSubMenuOrNavigation = (projectId: string, subSectionId: any, type: string) => {
        if (type === 'Dataset') {
            // TODO Navigate to Dataset
            navigate(`/datasetDetails/${subSectionId.id}`);
        } else if (type === 'Experiment') {
            // TODO Navigate to Experiment
            navigate(`/projectDetails/${projectId}/experiment/${subSectionId.id}`);
        }
    };
    useEffect(() => {
        if (SingleProjectData !== null) {
            const accordionMenuForProjects = [
                {
                    name: 'Dataset',
                    hasSubMenu: SingleProjectData.datasources
                },
                {
                    name: 'Experiment',
                    hasSubMenu: SingleProjectData.experiments
                }
            ];
            setMenuForProjectDetails(accordionMenuForProjects);
            updateSpinnerInfo(false);
        }
    }, [SingleProjectData]);
    return (
        <>
            {SingleProjectData && (
                <>
                    <Flex mt={'1px'}>
                        <Text fontWeight={800} ml={'17px'} color={textColor}>
                            {getTruncatedText(SingleProjectData && SingleProjectData.basic.name, 25)}
                        </Text>
                    </Flex>

                    <Divider mt={'16px'} orientation="horizontal" bg={'light.lighterGrayishBlue'} />

                    {menuForProjectDetails &&
                        menuForProjectDetails.map((section: any, sectionIndex: any) => {
                            return (
                                <Box>
                                    <Accordion allowMultiple>
                                        <AccordionItem height={'50%'} maxHeight={'400px'} overflowY={'scroll'}>
                                            <h2>
                                                <AccordionButton>
                                                    <Box ml={'16px'}>
                                                        <AccordionIcon color={'#646A78'} />
                                                    </Box>
                                                    <Box as="span" flex="1" textAlign="left" color={explorerInnerTitle} fontWeight={700} ml={'8px'} height={'44px'} pt={'12px'}>
                                                        {getTruncatedText(section && section.name, 15)}
                                                    </Box>
                                                    <Square size="26px" bg="white" color="#646A78" mr={'12px'} borderRadius={4} border={'1px'} borderColor={'#E3E3E3'} fontWeight={700}>
                                                        {section.hasSubMenu.length}
                                                    </Square>
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                {section.hasSubMenu.map((subSection: any, subSectionIndex: any) => {
                                                    return (
                                                        <Box
                                                            key={subSection.id}
                                                            onClick={() => {
                                                                checkForSubMenuOrNavigation(SingleProjectData.basic.id, subSection, section.name);
                                                            }}
                                                            className="sidebar-box-recent"
                                                        >
                                                            <Flex mr={'10px'} height={'44px'}>
                                                                <Box width={'80%'} ml={'44px'} mt={'10px'} color={textColor} fontWeight={400}>
                                                                    {' '}
                                                                    {getTruncatedText(subSection && subSection.name, 16)}
                                                                </Box>
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
                </>
            )}
        </>
    );
};
export default ProjectDetailsMenu;
