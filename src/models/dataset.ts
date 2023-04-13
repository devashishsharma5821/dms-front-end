export class UploadCSV<T> {
    dmsDatabricksUploadDBFS!: T;
}
export class UploadCSVDetail {
    dmsDatabricksUploadDBFS!: boolean;
}

export interface datasetPreviewSchema {
    col_name: string;
    data_type: string;
    comment: string;
}
export interface GetSingleDatasetAppStoreState {
    DatasetDetailData: GetDatasetDetail;
}
export class DeleteDataset<T> {
    dmsDeleteDatabricksDBFS!: T;
}
export class DeleteDatasetDetail {
    dmsDeleteDatabricksDBFS!: boolean;
}
export interface GetDatasetDetail {
    id: string;
    name: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    spec: {
        path: string;
    };
}
export class GetSingleDataset<T> {
    dmsDataSource!: T;
}

export class DatasetEdit<T> {
    dmsEditDataset!: T;
}
export class DatasetEditDetail {
    dmsEditDataset!: boolean;
}
export class DatasetDelete<T> {
    dmsDeleteDataset!: T;
}
export class GetAllDatasets<T> {
    dmsDatasets!: T;
}
export interface GetAllDatasetsDetail {
    id: string;
    name: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    spec: {
        path: string;
    };
}
