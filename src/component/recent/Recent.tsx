import React, { useState } from 'react';
import './Recent.scss';
import { Box, Center, Divider, Flex, Square, Text, useColorModeValue } from '@chakra-ui/react';
import {  WhiteCollection, WhiteComputeIcon, WhiteDatasetIcon, WhiteExperiment, WhiteNotebookIcon, WhiteRecentIcon } from '../../assets/icons';

const Recent = (props: any) => {
    const textColor = useColorModeValue( 'dark.header','default.whiteText');
    const textClearColor = useColorModeValue( 'default.toolbarButton','default.whiteText');
    const iconsColor = useColorModeValue( ' #666C80','white');
    const subMenuForRecent = [
        {
            name: 'My Experiment 1',
            icon: <WhiteExperiment color={iconsColor}/>,
        },
        {
            name: 'Driver_alignment_doc',
            icon: <WhiteNotebookIcon color={iconsColor} />,
        },
        
        {
            name: 'Dataset_V1',
            icon:  <WhiteDatasetIcon color={iconsColor} />,
        },
        {
            name: 'Dataset_1',
            icon:  <WhiteDatasetIcon color={iconsColor} />,
        },
        {
            name: 'My Compute 1',
            icon: <WhiteComputeIcon  color={iconsColor}/>,
        },
        {
            name: 'Project',
            icon: <WhiteCollection  color={iconsColor}/>,
        },     

];
    return (
        <>
  
         <Flex mt={'1px'}>
            <Square ml={'16px'}  className="sidebar-box-icon" ><WhiteRecentIcon color={iconsColor}/></Square>
            <Text fontWeight={800}  ml={'11px'} color={textColor}>Recent</Text>
            <Center flex="2" justifyContent={'flex-end'}>
               <Text fontWeight={600}  color={textClearColor}  mr={'15px'}>Clear</Text>
            </Center>
        </Flex>
        
        <Divider mt={'16px'}  orientation="horizontal" bg={'light.lighterGrayishBlue'} />
          
        { subMenuForRecent && subMenuForRecent.map(section => {
                    return (
                        <Box  className="sidebar-box-recent">
                        <Flex  mr={'10px'} ml={'18px'} height={'44px'}>   
                           <Center color={textColor}  >
                                {section.icon }
                            </Center>
                            
                            <Box  textAlign={'center'} ml={'10px'} mt={'10px'}  color={textColor}> {section.name} </Box>

                        </Flex>
                        </Box>
                    );

                })
            }       
                
                  
        </>
    );
};

export default Recent;
