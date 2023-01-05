import React, { useState } from 'react';
import './Help.scss';
import { Box, Center, Divider, Flex, Square, Text, useColorModeValue } from '@chakra-ui/react';
import {  Documentation,  WhiteInfoIcon, WhiteRecentIcon, WhiteResourceCenterIcon } from '../../assets/icons';

const Help = (props: any) => {
    const textColor = useColorModeValue( 'dark.header','default.whiteText');
    const textClearColor = useColorModeValue( 'default.toolbarButton','default.whiteText');
    const iconsColor = useColorModeValue( ' #666C80','white');
    const subMenuForHelp = [
        {
            name: 'Documentation',
            icon: <Documentation color={iconsColor}/>,
        },
        {
            name: 'Resource Center',
            icon: <WhiteResourceCenterIcon color={iconsColor} />,
        },
        
        {
            name: 'FAQ',
            icon:  <WhiteInfoIcon color={iconsColor} />,
        },
    
];
    return (
        <>
  
         <Flex mt={'1px'}>
            <Square ml={'16px'}  className="sidebar-box-icon" ><WhiteRecentIcon color={iconsColor}/></Square>
            <Text fontWeight={800}  ml={'11px'} color={textColor}>Help</Text>
          
        </Flex>
        
        <Divider mt={'16px'}  orientation="horizontal" bg={'light.lighterGrayishBlue'} />
          
        { subMenuForHelp && subMenuForHelp.map(section => {
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

export default Help;
