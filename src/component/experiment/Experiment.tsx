import React, { useMemo } from 'react';
import './Experiment.scss';
import { Box, Divider, Flex,Text, useColorModeValue } from '@chakra-ui/react';

const Experiment = (props: any) => {
    const textColor = useColorModeValue( 'dark.header','default.whiteText');
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
            console.log("I Have Level 3 Menu", data, index)
            props.hasThirdLevelMenu(data.name);
        }
    };
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
export default Experiment;
