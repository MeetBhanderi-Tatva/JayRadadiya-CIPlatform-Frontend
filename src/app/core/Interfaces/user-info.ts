
export interface UserInfo {
    userId: number;
    userName: string;
    userEmail: string;
    cityId: number;
    countryId: number;
}

export interface LoginResponse {
    token: string;
    userInfo: UserInfo;
}