/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Login {
    email: string;
    password: string;
    os: string;
    osVersion: string;
    deviceId: string;
    appVersion: string;
}

export interface LoginResponse {
    token: string;
    tokenExpires: Date;
    refreshToken: string;
    refreshTokenExpires: Date;
    user: any;
}