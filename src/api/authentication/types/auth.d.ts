export interface UserRegisterDto {
  email: string;
  userName: string;
  password: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
}

export interface TokenRequestDto {
  token: string;
  refreshToken: string;
}
