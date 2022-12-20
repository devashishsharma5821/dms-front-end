import React from 'react';
import './CreateNew.scss';
import { Box, Center, Divider, Flex, Square, Text, useColorModeValue } from '@chakra-ui/react';
import PlusIcont from '../../assets/icons/PlusIcont';
import {  WhiteCollection, WhiteComputeIcon, WhiteDatasetIcon, WhiteExperiment, WhiteNotebookIcon, WhiteWorkflowsIcon, } from '../../assets/icons';

const CreateNew = (props: any) => {
    const textColor = useColorModeValue( 'dark.header','default.whiteText');
    const triggerAction = (type: string) => {
        if(type === 'Compute') {
            props.openCreateModal();
        }
    };
    const subMenuForCreate = [
        {
            sections: [
                {
                    name: 'Compute',
                    icon: <WhiteComputeIcon  color={'#666C80'}/>,
                },
                {
                    name: 'Project',
                    icon: <WhiteCollection  color={'#666C80'}/>,
                }
            ]
        },
        {
            sections: [
                {
                    name: 'Compute',
                    icon: <WhiteComputeIcon  color={'#666C80'}/>,
                },
                {
                    name: 'Project',
                    icon: <WhiteCollection  color={'#666C80'}/>,
                }
            ]
        },
        {
            sections: [
                {
                    name: 'Compute',
                    icon: <WhiteComputeIcon  color={'#666C80'}/>,
                },
                {
                    name: 'Project',
                    icon: <WhiteCollection  color={'#666C80'}/>,
                }
            ]
        }
    ];
    return (
        <>
  
         <Flex mt={'16px'}>
            <Square ml={'16px'}><PlusIcont/></Square>
            
            <Text fontWeight={800}  ml={'11px'} color={textColor}> Create New</Text>
        </Flex>
        <Divider mt={'16px'} mb={'10px'} orientation="horizontal" bg={'dark.borderColor'} />
            {
                subMenuForCreate && subMenuForCreate.map(row => {
                    return (
                        <Flex>
                            { row.sections && row.sections.map(section => {
                                return (
                                    <Box ml={'14px'} mr={'7px'} bg='default.lightGray' width={'106px'} height="76px" mt={'14px'} borderRadius={'2'} onClick={ () => triggerAction(section.name) }>
                                        <Center mt={'17px'} >
                                            {section.icon}
                                        </Center>
                                        <Text textAlign={'center'} mb={'14px'} mt={'4px'} color={'black'}> {section.name} </Text>
                                    </Box >
                                )
                            })}
                        </Flex>
                    );

                })
            }
        {/*<Flex>*/}
        {/*    <Box ml={'14px'} mr={'7px'} bg='default.lightGray'  width={'106px'} height="76px" mt={'14px'} borderRadius={'2'} onClick={ () => triggerAction('Compute') }>*/}
        {/*        <Center mt={'17px'} >*/}
        {/*        <WhiteComputeIcon  color={'#666C80'}/>*/}
        {/*        </Center>*/}
        {/*        <Text textAlign={'center'} mb={'14px'} mt={'4px'} color={'black'}> {section.name} </Text>*/}
        {/*    </Box >*/}
        {/*    <Box mr={'14px'} ml={'7px'} bg='default.lightGray'  width={'106px'} height="76px" mt={'14px'} borderRadius={'2'}>*/}
        {/*        <Center mt={'17px'}>*/}
        {/*        <WhiteCollection color={'#666C80'} />*/}
        {/*        </Center>*/}
        {/*        <Text textAlign={'center'} mb={'14px'} mt={'4px'}color={'black'} > Project </Text>*/}
        {/*    </Box >*/}

        {/*</Flex>*/}
        {/*<Flex >*/}
        {/*    <Box ml={'14px'} mr={'7px'} bg='default.lightGray'  width={'106px'} height="76px" mt={'14px'} borderRadius={'2'}>*/}
        {/*        <Center mt={'17px'} >*/}
        {/*        <WhiteDatasetIcon color={'#666C80'} />*/}
        {/*        </Center>*/}
        {/*        <Text textAlign={'center'} mb={'14px'} mt={'4px'} color={'black'}> Dataset </Text>*/}
        {/*    </Box >*/}
        {/*    <Box mr={'14px'} ml={'7px'} bg='default.lightGray'  width={'106px'} height="76px" mt={'14px'} borderRadius={'2'}>*/}
        {/*        <Center mt={'17px'}>*/}
        {/*        <WhiteExperiment color={'#666C80'}/>*/}
        {/*        </Center>*/}
        {/*        <Text textAlign={'center'} mb={'14px'} mt={'4px'} color={'black'}> Experiment </Text>*/}
        {/*    </Box >*/}

        {/*</Flex>*/}
        {/*<Flex>*/}
        {/*    <Box ml={'14px'} mr={'7px'} bg='default.lightGray'  width={'106px'} height="76px" mt={'14px'} borderRadius={'2'}>*/}
        {/*        <Center mt={'17px'} >*/}
        {/*        <WhiteNotebookIcon color={'#666C80'} />*/}
        {/*        </Center>*/}
        {/*        <Text textAlign={'center'} mb={'14px'} mt={'4px'} color={'black'}> Notebook </Text>*/}
        {/*    </Box >*/}
        {/*    <Box mr={'14px'} ml={'7px'} bg='default.lightGray'  width={'106px'} height="76px" mt={'14px'} borderRadius={'2'}>*/}
        {/*        <Center mt={'17px'}>*/}
        {/*        <WhiteWorkflowsIcon color={'#666C80'}/>*/}
        {/*        </Center>*/}
        {/*        <Text textAlign={'center'} mb={'14px'} mt={'4px'} color={'black'}> Workflow </Text>*/}
        {/*    </Box >*/}

        {/*</Flex>*/}
        
        </>

    );
};

export default CreateNew;
