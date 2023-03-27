import React, { useEffect } from 'react';
import './dataset.scss';
import { Box, Button, Center, Divider, Flex, FormControl, FormLabel, Select, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import SearchComponent from '../../component/search/SearchComponent';
import { DownArrowShare } from '../../assets/icons';
import DatasetViews from './datasetDetails/datasetViews';
import CreateDatasetModal from '../../component/modalSystem/CreateDatasetModal';

const Dataset = () => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const projectTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const tabTextColor = useColorModeValue('default.darkGrayCreate', 'dark.white');
    const textColorPage = useColorModeValue('default.blackText', 'dark.white');
    const openCreateDatasetModal = useDisclosure();
    return (
        <>
            <Box className="dataset-page" marginLeft={50}>
                <Box fontSize={'24px'} fontWeight={700} mt={'24'} mb={'8'} color={textColorPage}>
                    Dataset
                </Box>
                <Stack spacing={4} mb={'24px'}>
                    <Text fontSize={16} noOfLines={[2]} color={textColorPage}>
                        Explore the datasets ingested in DMS with ease, leveraging source references and granular filtering options by project and user.
                    </Text>
                </Stack>
                <Flex flexDir={'row'} maxWidth={'294px'}>
                    <FormControl isRequired mr={'20px'}>
                        <FormLabel color={projectTitleColor} fontWeight={600}>
                            Project Name
                        </FormLabel>
                        <Select
                            icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                            borderRadius={3}
                            width={'294px'}
                            mb={38}
                            border={'1px'}
                            borderColor={'light.lighterGrayishBlue'}
                            as={Select}
                            id="existingProject"
                            name="existingProject"
                            variant="outline"
                            validate={(value: any) => {
                                let error;
                                if (value.length === 0) {
                                    error = ' Select here';
                                }
                                return error;
                            }}
                        >
                            <>
                                <option>Project 1</option>
                                <option>Project 2</option>
                            </>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <Box>
                            <FormLabel color={projectTitleColor} fontWeight={600}>
                                Created by
                            </FormLabel>
                            <Select
                                icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                borderRadius={3}
                                width={'294px'}
                                mb={38}
                                border={'1px'}
                                borderColor={'light.lighterGrayishBlue'}
                                as={Select}
                                id="userDataset"
                                name="userDataset"
                                variant="outline"
                                validate={(value: any) => {
                                    let error;
                                    if (value.length === 0) {
                                        error = ' Select here';
                                    }
                                    return error;
                                }}
                            >
                                <>
                                    <option>User 1</option>
                                    <option>User 2</option>
                                </>
                            </Select>
                        </Box>
                    </FormControl>
                </Flex>
                <Center mt={-10} flex="3" justifyContent={'flex-end'} zIndex={2}>
                    <Box>
                        <SearchComponent />
                    </Box>
                    <Stack direction="row" height={'30'} border={'3'}>
                        {' '}
                        <Divider orientation="vertical" ml={'20'} mr={'20'} className={'dividerCss'} />
                    </Stack>

                    <Button color={'white'} bg={'default.toolbarButton'} width={'133px'} height={'36px'} borderRadius={'3'} onClick={openCreateDatasetModal.onOpen}>
                        {' '}
                        <Text fontWeight={600}> Create Dataset</Text>
                    </Button>
                    <CreateDatasetModal isOpen={openCreateDatasetModal.isOpen} onClose={openCreateDatasetModal.onClose} />
                </Center>
                <Tabs index={tabIndex} width={'100%'} isLazy mt={-30} colorScheme={'tabsTheme'}>
                    <TabList width={'100%'} color={tabTextColor}>
                        <Tab pb={'14px'} fontWeight={600} pl={10}>
                            All Dataset
                        </Tab>
                        <Tab pb={'14px'} ml={'26'} fontWeight={600}>
                            My Dataset
                        </Tab>
                        <Tab pb={'14px'} ml={'26'} fontWeight={600}>
                            Shared With Me
                        </Tab>
                    </TabList>

                    <TabPanels mr={'10px'} maxHeight="758px">
                        <TabPanel>
                            <DatasetViews />
                        </TabPanel>
                        <TabPanel>
                            <DatasetViews />
                        </TabPanel>
                        <TabPanel>
                            <DatasetViews />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    );
};

export default Dataset;