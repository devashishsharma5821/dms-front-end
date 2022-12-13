import React from 'react';
import './pagenotfound.scss';
import { Box, Flex, Text, useColorModeValue, Button,  Link, Square, Stack } from '@chakra-ui/react';
import {  PageNotFoundLogo } from '../../assets/icons';

const PageNotFound = () => {
    const textColor = useColorModeValue('default.blackText', 'default.whiteText');
    return (

     <Flex  flex='1'>
            
      <Square  className="bodyMessages" pt={'70px'} pb={'55px'} >        
           <Box mt={'30%'}><PageNotFoundLogo/></Box>
    
                <Text  className="title" mt={'93px'} color={'default.redLigh'}>404 Error</Text>
                <Text  className="messageFirst" color={textColor}>Page Not Found</Text>
                <Text   className="messageSecond"  mt={'11px'} color={textColor}>We can’t find the page you’re looking for.
                <br/>Try going back to previous page or home page</Text>
            
               <Stack >
                    <Button 
                    borderRadius={4}
                    mt={'75px'}
                    mb={'41px'}
                    variant="contained"
                    width={'152px'}
                    height={'48px'}
                    color={'default.whiteText'}
                    bg="default.shareModalButton"
                    onClick={() => { }}>Go To Home</Button>
               </Stack>
               <Text > <Link color={'default.linkColor'}>Back to Previous Page</Link></Text>
        </Square >
             
     </Flex>            
               
  

    );
};

export default PageNotFound;
