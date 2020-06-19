// export types


export interface ILoginResponse {
    error: boolean;
    message: boolean;
    user: TUserResponse;
    token: string;
}

export type TUserResponse = {
    accounts: TAccountUser[],
    isVerify: boolean;
    account: TAccountUser,
    _id: string;
    email: string;
    password: string | null;
    cratedAt: string;
    updatedAt: string;
}

export type TAccountUser = {
    userId: string;
    appKey: string;
    appToken: string;
    name: string;
    _id: string;
}

export interface InfoResponse {
    accounts: TAccountUser[];
    account: TAccountUser;
    _id: string;
    email: string;
    createdAt: string;
    error: boolean | string;
    message: string;
}


export interface ISelectAccount {
    account: string;
}

export interface IChoices {
    name: string;
    disabled: boolean;
    value: string;
    hint: string;
    message: string;
}
