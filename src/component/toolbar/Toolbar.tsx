import React from 'react';
import {
    Box,
    Flex,
    Text,
    Button,
    Center,
    Divider,
    Stack,
    Switch,
    Spacer,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverFooter,
    ButtonGroup,
    Link,
    useColorModeValue,
    MenuList,
    MenuItem,
    MenuButton,
    Menu
} from '@chakra-ui/react';
import RunArrow from '../../assets/icons/RunArrow';
import toolbarDataIcons from '../../models/toolbarData';
import Comments from '../comments/Comments';
import DeployedIcon from '../../assets/icons/DeployedIcon';
import DeployedNotRunningIcon from '../../assets/icons/DeployNotRunning';
import Properties from '../modalSystem/Properties';
import Variables from '../modalSystem/Variables';
import SaveAs from '../modalSystem/SaveAs';
import Output from '../modalSystem/Output';
import ComputeJsonModal from '../modalSystem/ComputeJsonModal';
import DownArrowToolbar from '../../assets/icons/DownArrowToolbar';
import { toolbarPropsType } from '../../models/toolbar';
import DeployPipelineModal from '../modalSystem/DeployPipelineModal';
import { LineageIcon } from '../../assets/icons';
import LineageModal from '../modalSystem/LineageModal';
import { getAndUpdateDbSettingsData } from '../../zustandActions/computeActions';
import useAppStore from '../../store';
import { updateSpinnerInfo } from '../../zustandActions/commonActions';

const Toolbar = (props: toolbarPropsType) => {
    const textColor = useColorModeValue('default.blackText', 'default.whiteText');
    const [commentChecked, setCommentChecked] = React.useState(false);
    const [dbSettingsData] = useAppStore((state: any) => [state.dbSettingsData]);
    const propertiesModal = useDisclosure();
    const saveAsModal = useDisclosure();
    const VariablesModal = useDisclosure();
    const OutputModal = useDisclosure();
    const commentModal = useDisclosure();
    const createModal = useDisclosure();
    const deployPipelineModal = useDisclosure();
    const LineageToolbarModal = useDisclosure();
    const triggerActions = (type: string) => {
        if (type === 'Properties') {
            propertiesModal.onOpen();
        } else if (type === 'SaveAs') {
            saveAsModal.onOpen();
        } else if (type === 'Variables') {
            VariablesModal.onOpen();
        } else if (type === 'Output') {
            OutputModal.onOpen();
        }
    };
    const commentModalClosed = () => {
        commentModal.onClose();
        setCommentChecked(false);
    };

    const onCreateModalOpenHandler = async () => {
        if (!dbSettingsData.length) {
            updateSpinnerInfo(true);
            const check = getAndUpdateDbSettingsData();
            check.then((data: any) => {
                data && createModal.onOpen();
            });
        } else {
            createModal.onOpen();
        }
    };

    return (
        <Flex height={'56px'} minWidth="max-content" alignItems="center" gap="2" ml={90}>
            {toolbarDataIcons.section1.map((sections, sectionIndex) => {
                return (
                    <>
                        {sections.type === 'icon' && sections.name === 'SaveAs' && (
                            <Center onClick={props.onSaveClickHandler} ml={'16'} mr={'16'}>
                                <Box mr={'8'}>{sections.component}</Box>
                                <Box>{sections.name}</Box>
                            </Center>
                        )}
                        {sections.type === 'icon' && sections.name !== 'SaveAs' && (
                            <Center onClick={() => triggerActions(sections.name)} ml={'16'} mr={'16'}>
                                <Box mr={'8'}>{sections.component}</Box>
                                <Box>{sections.name}</Box>
                            </Center>
                        )}
                        {sections.type === 'moreIcon' && (
                            <>
                                <Menu>
                                    <MenuButton>{sections.component}</MenuButton>
                                    <MenuList borderRadius={'0'} width={'194px'} height={'44px'} color={textColor} ml={'-16'}>
                                        <MenuItem mt={'5px'} onClick={LineageToolbarModal.onOpen}>
                                            <LineageIcon />
                                            <Text ml={'12'}>Lineage</Text>
                                        </MenuItem>
                                        <LineageModal isOpen={LineageToolbarModal.isOpen} onClose={LineageToolbarModal.onClose} />
                                    </MenuList>
                                </Menu>

                                <Divider orientation="vertical" ml={'14'} mr={'14'} height={'36px'} />
                            </>
                        )}
                        {sections.type === 'switch' && (
                            <>
                                <Stack align="center" direction="row">
                                    <Switch
                                        isChecked={commentChecked}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                setCommentChecked(true);
                                                commentModal.onOpen();
                                            }
                                        }}
                                        size="sm"
                                    />
                                </Stack>
                                <Box ml={'6'}>{sections.name}</Box>
                            </>
                        )}
                        {sections.type === 'button' && (
                            <>
                                <Divider orientation="vertical" ml={'14'} mr={'14'} height={'36px'} />
                                <Button disabled={sections.disabled} variant="solid" bg={'light.button'} width={'80px'} height={'36px'} pl={'10'} pr={'10'}>
                                    <RunArrow />
                                    <Text ml={'3'}>Run</Text>
                                </Button>
                            </>
                        )}
                        {sections.type === 'pipelineButton' && (
                            <>
                                <Button onClick={deployPipelineModal.onOpen} bg={'default.displayOffButton'} width={'150px'} height={'36px'} pl={'10'} pr={'10'} ml={'14'} borderRadius={4}>
                                    {' '}
                                    <Box mr={'8'}>{sections.component}</Box>
                                    <Box mr={'8'} color={'default.textDeployPiplineButton'} mt={'4px'}>
                                        {sections.name}
                                    </Box>
                                </Button>
                                <DeployPipelineModal isOpen={deployPipelineModal.isOpen} onClose={deployPipelineModal.onClose} />
                            </>
                        )}
                    </>
                );
            })}
            <Box ml="-200px">
                <>
                    <Center>
                        {props?.computeData?.length !== 0 &&
                            props?.computeData?.map((compute: any) => {
                                return (
                                    compute.is_default === true && (
                                        <>
                                            <Divider orientation="vertical" ml={'14'} mr={'14'} height={'36px'} />
                                            <Center mr={'10px'}>
                                                {compute.status === 'RUNNING' ? (
                                                    <div style={{ marginRight: 10 }}>
                                                        <DeployedIcon />
                                                    </div>
                                                ) : (
                                                    <div style={{ marginRight: 10 }}>
                                                        <DeployedNotRunningIcon />
                                                    </div>
                                                )}
                                                <Box>{compute.name}</Box>
                                            </Center>
                                            <Center fontWeight="medium" fontSize="sm" color={'default.containerAgGridRecords'}>
                                                <Text>{compute.totalMemory}</Text>
                                                <Divider orientation="vertical" mr={'8'} height={'16px'} />
                                                <Text> | {compute.totalCores} Cores</Text>
                                            </Center>
                                        </>
                                    )
                                );
                            })}
                        {props?.computeData?.length !== 0 && (
                            <Popover placement="bottom" isLazy={true} closeOnEsc={true} size={'sm'} variant="responsive">
                                <PopoverTrigger>
                                    <Button disabled={props?.computeData?.length === 0} mx="12px">
                                        <DownArrowToolbar />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverBody mt={'5px'}>
                                        {props?.computeData?.length !== 0 &&
                                            props?.computeData?.map((compute: any) => {
                                                return (
                                                    <Flex pb={'10px'} justifyContent={'space-between'}>
                                                        <Center>
                                                            {compute?.status === 'RUNNING' ? (
                                                                <Box mr={'8'}>
                                                                    {' '}
                                                                    <DeployedIcon />
                                                                </Box>
                                                            ) : (
                                                                <Box mr={'8'}>
                                                                    <DeployedNotRunningIcon />
                                                                </Box>
                                                            )}
                                                            <Box fontWeight={'600'} fontSize={'16px'} color={textColor}>
                                                                {compute?.name}
                                                            </Box>
                                                        </Center>
                                                        <Center fontWeight="medium" fontSize="sm" color={'default.containerAgGridRecords'}>
                                                            <Text>{compute?.totalMemory}</Text>
                                                            <Divider orientation="vertical" mr={'8'} height={'16px'} />
                                                            <Text> | {compute?.totalCores} Cores</Text>
                                                        </Center>
                                                    </Flex>
                                                );
                                            })}
                                    </PopoverBody>
                                    <PopoverFooter border="0" display="flex" alignItems="center" justifyContent="center" pb={4}>
                                        <ButtonGroup size="sm" onClick={onCreateModalOpenHandler}>
                                            <Link color="teal.500" href="#">
                                                Create Compute
                                            </Link>
                                        </ButtonGroup>
                                    </PopoverFooter>
                                </PopoverContent>
                            </Popover>
                        )}
                    </Center>
                </>
                {props?.computeData?.length === 0 && (
                    <Center mr={'40px'}>
                        <ButtonGroup size="sm">
                            <Link color="teal.500" href="#">
                                No Compute Found
                            </Link>
                        </ButtonGroup>
                    </Center>
                )}
            </Box>
            <Comments isOpen={commentModal.isOpen} onClose={commentModal.onClose} commentClosed={commentModalClosed}></Comments>
            {propertiesModal.isOpen && (
                <Properties
                    isOpen={propertiesModal.isOpen}
                    onClose={propertiesModal.onClose}
                    data={props.experimentData}
                    projectData={props.projectData}
                    userData={props.usersData}
                    userAccessList={props.userAccessList}
                />
            )}
            {saveAsModal.isOpen && <SaveAs isOpen={saveAsModal.isOpen} onClose={saveAsModal.onClose} />}
            {VariablesModal.isOpen && <Variables isOpen={VariablesModal.isOpen} onClose={VariablesModal.onClose} />}
            {OutputModal.isOpen && <Output isOpen={OutputModal.isOpen} onClose={OutputModal.onClose} />}
            {createModal.isOpen && <ComputeJsonModal isOpen={createModal.isOpen} onClose={createModal.onClose} />}
        </Flex>
    );
};

export default Toolbar;
