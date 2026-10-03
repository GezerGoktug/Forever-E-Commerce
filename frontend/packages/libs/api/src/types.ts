import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"

export interface IDefaultResponse {
    message: string
}

export interface IResponse<T> {
    statusCode: number,
    success: boolean,
    data: T
}

type Error = {
    path: string;
    hostName: string;
    createdAt: Date;
    errorMessage: string | Record<string, string[]>;
}

export type IError = AxiosError<{ error: Error }>;

export interface IPaginationResult<T, OtherDataType> {
    totalItems: number;
    totalPage: number;
    pageSize: number;
    page: number;
    hasNext: boolean;
    hasPrev: boolean;
    content: T[];
    otherData?: OtherDataType;
}

export interface RequestInterceptorItem {
    useFunc: (request: InternalAxiosRequestConfig) => InternalAxiosRequestConfig,
    errFunc?: (error: IError) => Promise<IError>
}

export interface ResponseInterceptorItem {
    useFunc: (response: AxiosResponse) => AxiosResponse,
    errFunc?: (error: IError) => Promise<IError>
}

