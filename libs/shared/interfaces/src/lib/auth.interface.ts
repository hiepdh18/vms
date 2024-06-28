export interface ICredentials {
  username: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  permissions: { [key: string]: number };
  twoFaAuthToken?: string;
  qrCode?: string;
}

export interface IAuthToken {
  userId: number;
  token: string;
}
