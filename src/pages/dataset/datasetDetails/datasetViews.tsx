import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../dataset.scss';
import { Box, Center, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GetAllProjectsDetail } from '../../../models/project';
import { useNavigate } from 'react-router-dom';
import { convertTime, getUserNameFromId } from '../../../utils/common.utils';

const DatasetViews = (props: any) => {
    const textColorPage = useColorModeValue('default.blackText', 'dark.white');
    const gridRef = useRef<AgGridReact<any>>(null);
    const gridStyle = useMemo(() => ({ height: '300px', width: '98%' }), []);
    const [rowData, setRowData] = useState<any[]>([]);
    const navigate = useNavigate();
    const renderDatasetId = (params: any) => {
        return (
            <div style={{ color: 'rgb(3, 135, 176)', cursor: 'pointer' }} onClick={() => navigateToDataset(params.data.id)}>
                {params.data.id}
            </div>
        );
    };
    const navigateToDataset = (id: any) => {
        navigate(`/datasetDetails/${id}`);
    };
    const [columnDefs] = useState<ColDef[]>([
        {
            field: 'id',
            headerName: 'Dataset ID',
            cellRenderer: renderDatasetId
        },
        {
            field: 'name',
            headerName: 'Dataset Name'
        },
        {
            field: 'created_by',
            headerName: 'Created By',
            valueFormatter: (params: any) => {
                return getUserNameFromId(props.allUsers, params.data.created_by);
            }
        },
        {
            field: 'created_at',
            headerName: 'Created On',
            valueFormatter: (params: any) => {
                return convertTime(params.data.created_at, false);
            }
        },
        {
            field: 'spec.path',
            headerName: 'Source'
        }
    ]);

    useEffect(() => {
        let datasourceData: any = [];
        props.data.forEach((project: GetAllProjectsDetail) => {
            let listOfDataSources = [];
            if (project.datasources.length > 0) {
                listOfDataSources = project.datasources.map((datasource: any) => {
                    return datasource;
                });
            }
            datasourceData.push(...listOfDataSources);
        });
        setRowData(datasourceData);
        if (props.search !== '') {
            setTimeout(() => {
                doGridSearch();
            }, 200);
        }
    }, [props.data]);

    const doGridSearch = () => {
        if (gridRef?.current!.api) {
            gridRef?.current!.api.setQuickFilter(props.search);
        }
    };
    useEffect(() => {
        doGridSearch();
    }, [props.search]);

    const onFirstDataRendered = () => {
        gridRef?.current!?.api?.sizeColumnsToFit();
    };
    window.addEventListener('resize', () => {
        if (gridRef?.current!.api) {
            gridRef?.current!?.api?.sizeColumnsToFit();
        }
    });
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
                                {rowData.length}
                            </Text>
                        </Box>
                    </Center>
                </Flex>
                <Flex flexWrap={'wrap'} flexDirection={'row'} ml={'24'}>
                    <Box style={gridStyle} className="ag-theme-alpine">
                        <AgGridReact<any> ref={gridRef} onFirstDataRendered={onFirstDataRendered} rowData={rowData} columnDefs={columnDefs} animateRows={true}></AgGridReact>
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default DatasetViews;
