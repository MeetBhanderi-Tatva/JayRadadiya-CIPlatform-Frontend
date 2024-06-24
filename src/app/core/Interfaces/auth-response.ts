export interface AuthResponse<T> {
    data: T;
    result: boolean;
    statusCode: string;
    message: string;
}
