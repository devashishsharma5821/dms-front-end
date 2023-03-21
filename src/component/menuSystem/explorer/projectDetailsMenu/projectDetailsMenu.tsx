import React, { useEffect } from 'react';
import './projectDetailsMenu.scss';
import {
    Accordion,
    AccordionButton, AccordionIcon,
    AccordionItem, AccordionPanel,
    Box, Center,
    Divider,
    Flex, Square,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import { updateSpinnerInfo } from '../../../../zustandActions/commonActions';
import useAppStore from '../../../../store';
import { GetSingleProjectAppStoreState } from '../../../../models/project';
import { RightArrow } from '../../../../assets/icons/RightArrow';

const ProjectDetailsMenu = (props: any) => {
    const iconsColor = useColorModeValue(' #666C80', 'white');
    const textColor = useColorModeValue( 'dark.header','default.whiteText');
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    const [menuForProjectDetails, setMenuForProjectDetails] = React.useState<any>([]);
    const checkForSubMenuOrNavigation = (subSectionId: string, type: string) => {
        if(type === 'Dataset') {
            // TODO Navigate to Dataset
        } else if (type === 'Experiment') {
            // TODO Navigate to Experiment
        }
    };
    useEffect(() => {
        if(SingleProjectData !== null) {
            console.log('ChangedProjectData', SingleProjectData);
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
            {
                SingleProjectData &&
                    <>
                        <Flex mt={'1px'}>
                            <Text fontWeight={800}  ml={'17px'} color={textColor}>{SingleProjectData.basic.name}</Text>
                        </Flex>

                        <Divider mt={'16px'}  orientation="horizontal" bg={'light.lighterGrayishBlue'} />

                        { menuForProjectDetails && menuForProjectDetails.map((section: any, sectionIndex: any) => {
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
                                                    section.hasSubMenu.map((subSection: any, subSectionIndex: any) => {
                                                        return (
                                                            <Box
                                                                key={subSection.id}
                                                                onClick={() => {
                                                                    checkForSubMenuOrNavigation(subSection, section.name);
                                                                }}
                                                                className="sidebar-box-recent"
                                                            >
                                                                <Flex mr={'10px'} height={'44px'}>
                                                                    <Box textAlign={'center'} ml={'17px'} mt={'10px'} color={textColor}>
                                                                        {' '}
                                                                        {subSection.name}{' '}
                                                                    </Box>
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

                        })
                        }
                    </>
            }
        </>
    );
};
export default ProjectDetailsMenu;
