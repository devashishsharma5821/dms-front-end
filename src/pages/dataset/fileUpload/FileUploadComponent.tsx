import React from 'react';
import './FileUploadComponent.scss';
import { Button, useColorModeValue, Text, Box } from '@chakra-ui/react';
import client from '../../../apollo-client';
import { UploadCSV, UploadCSVDetail } from '../../../models/dataset';
import { uploadCSVDataset } from '../../../query';
import { createStandaloneToast } from '@chakra-ui/react';
import { getToastOptions } from '../../../models/toastMessages';
import { updateSpinnerInfo } from '../../../zustandActions/commonActions';
import { convertApolloError } from '../../../utils/common.utils';
const { toast } = createStandaloneToast();

// drag drop file component
const FileUploadComponent = (props: any) => {
    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef(null);
    const titleDarkCSV = useColorModeValue('default.blackText', 'default.whiteText');

    const handleFile = (files: any) => {
        updateSpinnerInfo(true);
        props.disableStatus(true);
        let fileSizeMB = files[0].size / (1024 ** 2);
        if(fileSizeMB > 100) {
            toast(getToastOptions(`Please upload file less than 100 MB`, 'error'));
            updateSpinnerInfo(false);

        } else {
            client
                .mutate<UploadCSV<UploadCSVDetail>>({
                    mutation: uploadCSVDataset(),
                    variables: { file: files[0], projectId: props.projectId, datasetName: props.datasetName, format: JSON.stringify({"format": "PARQUET"}) },
                    context: { useMultipart: true }
                })
                .then((response: any) => {
                    setTimeout(() => {
                        props.getResponseFromFileUpload(response.data.dmsDatabricksUploadDBFS);
                        toast(getToastOptions(`${files[0].name} uploaded`, 'success'));
                        updateSpinnerInfo(false);
                        props.disableStatus(false);
                    },200)
                })
                .catch((err: any) => {
                    updateSpinnerInfo(false);
                    toast(getToastOptions(`${convertApolloError(err)}`, 'error'));
                });
        }
    };
    // handle drag events
    const handleDrag = (evt: any) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (evt.type === 'dragenter' || evt.type === 'dragover') {
            setDragActive(true);
        } else if (evt.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // triggers when file is dropped
    const handleDrop = (evt: any) => {
        evt.preventDefault();
        evt.stopPropagation();
        setDragActive(false);
        if (evt.dataTransfer.files && evt.dataTransfer.files[0] && (evt.dataTransfer.files[0].type === "text/csv" || evt.dataTransfer.files[0].type === "")) {
            handleFile(evt.dataTransfer.files);
        } else {
            toast(getToastOptions(`Please drag and drop only CSV OR PARQUET Files`, 'error'));
        }
    };

    // triggers when file is selected with click
    const handleChange = (evt: any) => {
        evt.preventDefault();
        if (evt.target.files && evt.target.files[0]) {
            handleFile(evt.target.files);
        }
    };

    // triggers the input when the button is clicked
    const onButtonClick = () => {
        // @ts-ignore
        inputRef.current.click();
    };

    return (
        <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input ref={inputRef} type="file" onClick={(e: any) => (e.target.value = null)} id="input-file-upload" accept=".csv,.parquet" multiple={false} onChange={handleChange} />
            <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? 'drag-active' : ''}>
                <div>
                    <Text fontSize={'21px'} fontWeight={600} color={titleDarkCSV} mt={'86px'}>
                        Drop files here to upload
                    </Text>
                    <Text fontSize={'14px'} color={'default.containerAgGridRecords'} ml={'100px'}>
                        or
                    </Text>
                    <Button onClick={onButtonClick} width={'98px'} height={'36px'} bg={'default.toolbarButton'} mt={'4px'} ml={'60px'}>
                        Select File
                    </Button>
                    <Text fontSize={'12px'} color={'default.containerAgGridRecords'} mt={'20px'} ml={'70px'}>
                        Supports: CSV
                    </Text>
                    <Text fontSize={'12px'} color={'default.containerAgGridRecords'} mt={'4px'} ml={'10px'}>
                        Max file size 100mb | File limit 100 CSV
                    </Text>
                </div>
            </label>
            {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
        </form>
    );
};
export default FileUploadComponent;
