export interface IFile {
    name: string;
    link: string;
    size: string;
    time: string;
}

export interface IFileData {
    token: string;
    files: IFile[];
}

export interface IGetRes {
    status: 'success' | 'error';
    message: string;
    data: IFileData;
}
