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

export class DeleteDataset<T> {
    dmsDeleteDatabricksDBFS!: T;
}
export class DeleteDatasetDetail {
    dmsDeleteDatabricksDBFS!: boolean;
}
