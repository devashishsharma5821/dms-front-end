import React from 'react';
import './FileUploadComponent.scss';
import {
    Button,
    useColorModeValue,
    Text,
    Toast
} from '@chakra-ui/react';
import client from '../../../apollo-client';
import { UploadCSV, UploadCSVDetail } from '../../../models/dataset';
import { uploadCSVDataset } from '../../../query';
// drag drop file component
const FileUploadComponent = () => {
    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef(null);
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const datasetTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const titleDarkCSV = useColorModeValue('default.blackText', 'default.whiteText');

    const handleFile = (files: any) => {
        console.log('Files', files)
        const uploadCSVVariables = {
            file: files[0],
            projectId: '41',
            datasetName: 'First-UI-Dataset-Upload'
        };
        client
            .mutate<UploadCSV<UploadCSVDetail>>({
                mutation: uploadCSVDataset(uploadCSVVariables)
            })
            .then(() => {
                Toast({
                    title: `File Uploaded Successfully`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            })
            .catch(() => {
                Toast({
                    title: `File cannot be uploaded`,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    }
    // handle drag events
    const handleDrag = (evt: any) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (evt.type === "dragenter" || evt.type === "dragover") {
            setDragActive(true);
        } else if (evt.type === "dragleave") {
            setDragActive(false);
        }
    };

    // triggers when file is dropped
    const handleDrop = (evt: any) => {
        evt.preventDefault();
        evt.stopPropagation();
        setDragActive(false);
        if (evt.dataTransfer.files && evt.dataTransfer.files[0]) {
            handleFile(evt.dataTransfer.files);
        }
    };

    // triggers when file is selected with click
    const handleChange = (evt:any) => {
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
        <form
            id="form-file-upload"
            onDragEnter={handleDrag}
            onSubmit={(e) => e.preventDefault()}
        >
            <input
                ref={inputRef}
                type="file"
                id="input-file-upload"
                multiple={true}
                onChange={handleChange}
            />
            <label
                id="label-file-upload"
                htmlFor="input-file-upload"
                className={dragActive ? "drag-active" : ""}
            >
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
            {dragActive && (
                <div
                    id="drag-file-element"
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                ></div>
            )}
        </form>
    );
}
export default FileUploadComponent;
