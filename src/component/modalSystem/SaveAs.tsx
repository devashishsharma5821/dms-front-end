import React, { useEffect, useState } from 'react';
import { Formik, Field } from "formik";
import {
    Button,
    Divider,
    VStack,
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalCloseButton,
    ModalBody,
    FormControl,
    Input,
    FormLabel,
    ModalFooter,
    FormErrorMessage,
    useColorModeValue,
    Select,
    createStandaloneToast
} from '@chakra-ui/react';
import { cloneExperiment } from '../../query';
import { DownArrowShare } from '../../assets/icons';
import useAppStore from '../../store';
import { GetAllProjectsAppStoreState } from '../../models/project';
import { getAndUpdateAllProjectsData, getAndUpdateSingleProjectData } from '../../zustandActions/projectActions';
import { getProjectNameAndLabelsForSelect } from '../../utils/common.utils';
import { useParams } from 'react-router-dom';
import { CloneExperiment, CloneExperimentDetail } from '../../models/experimentModel';
import client from '../../apollo-client';
import { getToastOptions } from '../../models/toastMessages';
const SaveAs = (props: any) => {
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const textColorTitle = useColorModeValue('l default.titleForShare', 'default.whiteText');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [projectNames, setProjectNames] = React.useState([{name: '', id: ''}]);
    const [selectedProjectId, setSelectedProjectId] = React.useState('');
    const params = useParams();
    const { toast } = createStandaloneToast();
    interface databricksSettings {
        projectName: string;
        experimentName: string;
     }
    useEffect(() => {
        if (AllProjectsData === null) {
            getAndUpdateAllProjectsData();
        } else {
            setProjectNames(getProjectNameAndLabelsForSelect(AllProjectsData));
            setSelectedProjectId(getProjectNameAndLabelsForSelect(AllProjectsData)[0].id);
        }
    }, [AllProjectsData]);
    return (
    <Modal
        size={'lg'}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={props.isOpen}
        onClose={props.onClose}
        isCentered
        closeOnOverlayClick={false} trapFocus={false} lockFocusAcrossFrames={true}
      >
        <ModalOverlay />

        <ModalContent  >
          <ModalHeader color={textColor}  mt={'13px'}  ml={'20px'}>Save As</ModalHeader>
          <ModalCloseButton color={textColor} mr={'10px'} mt={'12px'} />
          <Divider color={"default.dividerColor"} mt={'13px'} mb={'20px'}/>
          <ModalBody pb={6}  mr={'20px'} ml={'18px'} >
            <Formik
                initialValues={{
                  validateOnMount: true,
                  projectName: projectNames[0].id,
                  experimentName: ""
                } as databricksSettings}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={(values) => {
                 setLoading(true);
                 console.log('Values', values.experimentName, selectedProjectId, params.experimentId);
                 const cloneVariables = {
                     projectSelected: selectedProjectId,
                     experimentId: params.experimentId,
                     experimentName: values.experimentName
                };
                 // The below api will be available when needs to be integrated
                    client.mutate<CloneExperiment<CloneExperimentDetail>>({
                        mutation: cloneExperiment(cloneVariables)
                    })
                    .then((response) => {
                        console.log('Respnse', response)
                        props.onClose();
                        setLoading(false);
                        toast(getToastOptions('Experiment Cloned Successfully', 'success'));
                        setSelectedProjectId('');
                    })
                    .catch((err) => toast(getToastOptions(`${err}`, 'error')));
                }}
            >
              {({ handleSubmit, errors, touched ,isValid}) => (
                  <form onSubmit={handleSubmit}>
                    <VStack  align="flex-start">
                      <FormControl  isInvalid={!!errors.projectName && touched.projectName} isRequired>
                        <FormLabel htmlFor="projectName" fontWeight={600}  color={textColorTitle} mb={6} >Project Name</FormLabel>
                        <Select
                            icon={<DownArrowShare pl={'15px'} color={'#666C80'}/>}
                            borderRadius={3}
                            mb={16}
                            border={'1px'}
                            borderColor={'#D8DCDE'}
                            as={Select}
                            id="projectName"
                            name="projectName"
                            variant='outline'
                            onChange={(evt: any) => setSelectedProjectId(evt.target.value)}
                            value={selectedProjectId}
                        >

                            {projectNames.map((project, projectIndex) => {
                                return <option key={project.id} value={project.id}>{project.name}</option>
                            })}

                        </Select>

                        <FormErrorMessage>{errors.projectName}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.experimentName && touched.experimentName} isRequired>
                        <FormLabel htmlFor="experimentName" fontWeight={600} color={textColorTitle} mb={6}>Experiment Name</FormLabel>
                        <Field
                            borderRadius={3}
                            border={'1px'}
                            borderColor={'#D8DCDE'}
                            as={Input}
                            id="experimentName"
                            name="experimentName"
                            variant='outline'
                            validate={(value: any) => {
                              let error;
                              if (value.length === 0) {
                                error = "Experiment Name is required";
                              }

                              return error;
                            }}
                        />
                        <FormErrorMessage>{errors.experimentName}</FormErrorMessage>

                        <Divider color={"default.dividerColor"} mt={'26px'} ml={'-24px'} width={'512px'}/>

                        <ModalFooter mb={'18px'}  mt={'21px'}  mr={'0px'} >
                            <Button disabled={loading} onClick={props.onClose} colorScheme='gray' bg={'white'} color={'#2180C2'}  width={'81px'}  border={'1px'} borderColor={'#2180C2'} height={'40px'} borderRadius={3}>Cancel</Button>
                            {
                                (loading) ?
                                    <Button width={'68px'} height={'40px'} ml={'11px'} borderRadius={3} isLoading disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object) } onSubmit={props.onSubmit} type="submit" colorScheme="blue" >Save</Button>
                                    : <Button width={'68px'} height={'40px'} ml={'11px'} borderRadius={3} disabled={!isValid || (Object.keys(touched).length === 0 && touched.constructor === Object) } onSubmit={props.onSubmit} type="submit" colorScheme="blue"  >Save</Button>
                            }
                         </ModalFooter>

                         </FormControl>
                    </VStack>
                  </form>
              )}
            </Formik>
          </ModalBody>
       </ModalContent>
    </Modal>

    );
};

export default SaveAs;
