import React, { useState } from 'react';
import './Explorer.scss';
import { Box, Center, Divider, Flex, Square, Text, useColorModeValue } from '@chakra-ui/react';
import {  RightArrow, WhiteCollection, WhiteComputeIcon, WhiteDatasetIcon, WhiteExperiment, WhiteNotebookIcon, WhiteRecentIcon } from '../../assets/icons';

const Explorer = (props: any) => {
    const textColor = useColorModeValue( 'dark.header','default.whiteText');
    const iconsColor = useColorModeValue( ' #666C80','white');
    const subMenuForRecent = [
        {
            name: 'Dataset',
          },
        {
            name: 'Experiment',
            hasSubMenu: [],
            isClicked: false
          },
        {
            name: 'Pipeline',
        },
    

];

    return (
        <>
  
         <Flex mt={'1px'}>
            <Square ml={'16px'}  className="sidebar-box-icon" ><WhiteExperiment color={iconsColor}/></Square>
            <Text fontWeight={800}  ml={'11px'} color={textColor}>Explorer</Text>
        </Flex>
        
        <Divider mt={'16px'}  orientation="horizontal" bg={'light.lighterGrayishBlue'} />
          
        { subMenuForRecent && subMenuForRecent.map(section => {
                    return (
                        <Box  className="sidebar-box-recent">
                        <Flex  mr={'10px'}  height={'44px'}>   
                            
                            <Box  textAlign={'center'} ml={'17px'} mt={'10px'}  color={textColor}> {section.name} </Box>
                            <Center flex="2" justifyContent={'flex-end'} mr={'24px'}>
                                <RightArrow color={iconsColor}/>
                            </Center>

                        </Flex>
                        </Box>
                    );

                })
            }       
                
                  
        </>
    );
};

export default Explorer;
