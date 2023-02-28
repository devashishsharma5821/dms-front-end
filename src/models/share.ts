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
