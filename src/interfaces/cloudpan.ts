export interface IFileData {
    token: string;
    files: any[];
}

export interface IGetRes {
    status: 'success' | 'error';
    message: string;
    data: IFileData;
}
