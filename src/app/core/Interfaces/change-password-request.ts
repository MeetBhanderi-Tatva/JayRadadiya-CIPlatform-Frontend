export interface ChangePasswordRequest {
    email: string;
    token: string;
    password: string;
    confirmPassword: string;
}
