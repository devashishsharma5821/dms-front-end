import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../dataset.scss';
import { Box, Center, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GetAllProjectsDetail } from '../../../models/project';

const DatasetViews = (props: any) => {
    const textColorPage = useColorModeValue('default.blackText', 'dark.white');
    const gridRef = useRef<AgGridReact<any>>(null);
    const gridStyle = useMemo(() => ({ height: '300px', width: '98%' }), []);
    const [rowData, setRowData] = useState<any[]>([]);
    const [columnDefs] = useState<ColDef[]>([
        {
            field: 'id',
            headerName: 'Dataset ID'
        },
        {
            field: 'name',
            headerName: 'Dataset Name'
        },
        {
            field: 'created_by',
            headerName: 'Created By'
        },
        {
            field: 'created_at',
            headerName: 'Created On',
        },
        {
            field: 'spec.path',
            headerName: 'Source'
        }
    ]);
    useEffect(() => {
        let datasourceData: any = [];
        props.data.forEach((project:GetAllProjectsDetail) => {
            let listOfDataSources = [];
            if(project.datasources.length > 0) {
                listOfDataSources = project.datasources.map((datasource: any) => {
                    return datasource;
                });
            };
            datasourceData.push(...listOfDataSources);
        });
        setRowData(datasourceData);
        if(props.search !== '') {
            setTimeout(() => {
                doGridSearch();
            }, 200)
        }
    }, [props.data]);

    const doGridSearch = () => {
        if(gridRef?.current!.api) {
            gridRef?.current!.api.setQuickFilter(props.search);
        }
    }
    useEffect(() => {
        doGridSearch();
    }, [props.search]);

    return (
        <>
            <Box border={'1px solid'} borderColor={'light.lighterGrayishBlue'} overflowX={'hidden'} overflowY={'scroll'} borderRadius={8} width={'100%'} mt={'16'} pb={'16'} pl={10}>
                {' '}
                <Flex ml={'24'} mt={'21'} mb={'3'}>
                    <Center>
                        <Box>
                            <Text color={textColorPage} fontWeight={700}>
                                Dataset Details
                            </Text>
                        </Box>
                        <Box color={'default.containerAgGridRecords'}>
                            <Text ml={'14'} fontWeight={700}>
                                1
                            </Text>
                        </Box>
                    </Center>
                </Flex>
                <Flex flexWrap={'wrap'} flexDirection={'row'} ml={'24'}>
                    <Box style={gridStyle} className="ag-theme-alpine">
                        <AgGridReact<any> ref={gridRef} rowData={rowData} columnDefs={columnDefs} animateRows={true}></AgGridReact>
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default DatasetViews;
