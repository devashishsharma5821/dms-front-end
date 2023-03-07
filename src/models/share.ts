export interface ShareData {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
}

export class ShareCreate<T> {
    dmsCreateOrUpdateProjectAccess!: T;
}

export class ShareCreateDetail {
    dmsCreateOrUpdateProjectAccess!: boolean;
}

export class ShareDelete<T> {
    dmsDeleteProjectAccess!: T;
}


export class ShareDeleteDetail {
    dmsDeleteProjectAccess!: boolean;
}
