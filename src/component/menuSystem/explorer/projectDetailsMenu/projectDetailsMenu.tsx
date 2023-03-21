import React, { useEffect } from 'react';
import './projectDetailsMenu.scss';
import { Box, Divider, Flex,Text, useColorModeValue } from '@chakra-ui/react';
import { updateSpinnerInfo } from '../../../../zustandActions/commonActions';
import useAppStore from '../../../../store';
import { GetSingleProjectAppStoreState } from '../../../../models/project';

const ProjectDetailsMenu = (props: any) => {
    const textColor = useColorModeValue( 'dark.header','default.whiteText');
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);

    const subMenuForExperiment = [
        {
            name: 'My New Experiment',
          },
        {
            name: 'Test_Experiment',
        
          },
        {
            name: 'Test 1_Experiment',
        }, 

];
    const checkForSubMenuOrNavigation = (data: any, index: any) => {
        if (data.hasSubMenu) {
            props.hasThirdLevelMenu(data.name);
        }
    };
    useEffect(() => {
        if(SingleProjectData !== null) {
            console.log('ChangedProjectData', SingleProjectData)
            updateSpinnerInfo(false);
        }
    }, [SingleProjectData]);
    return (
        <>
  
         <Flex mt={'1px'}>
            <Text fontWeight={800}  ml={'17px'} color={textColor}>Experiment</Text>
        </Flex>
        
        <Divider mt={'16px'}  orientation="horizontal" bg={'light.lighterGrayishBlue'} />
          
        { subMenuForExperiment && subMenuForExperiment.map((section, sectionIndex) => {
                    return (
                        <Box  onClick={() => { checkForSubMenuOrNavigation(section, sectionIndex) }} className="sidebar-box-recent">
                        <Flex  mr={'10px'}  height={'44px'}>
                            <Box
                                 textAlign={'center'} ml={'17px'} mt={'10px'}  color={textColor}> {section.name} </Box>   
                        </Flex>
                        </Box>
                    );

                })
            }
        </>
    );
};
export default ProjectDetailsMenu;
